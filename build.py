import os, re, sys, html, shutil, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
POSTS = ROOT / "posts"
TEMPLATES = ROOT / "templates"
DIST = ROOT / "dist"

EXCLUDE_COPY = {".git", ".github", "dist", "posts", "templates", "build.py"}

def slugify(s):
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "post"

def read_file(p):
    return Path(p).read_text(encoding="utf-8")

def write_file(p, content):
    p = Path(p)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")

def parse_front_matter(text):
    if text.startswith("---"):
        parts = text.split("\n", 1)[1].split("\n---", 1)
        if len(parts) == 2:
            fm, rest = parts[0], parts[1]
            meta = {}
            for line in fm.splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
            if rest.startswith("\n"):
                rest = rest[1:]
            return meta, rest
    return {}, text

def strip_md(text):
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"(\*\*|__|\*|_)", "", text)
    text = re.sub(r"^\s*(#{1,6}|>|\-|\*|\+|\d+\.)\s*", "", text, flags=re.M)
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"\s+", " ", text).strip()

CUSTOM_TAGS = {
    "#L": ("<e1 id=\"", "\"></e1>"),
    "#img": ("<img src=\"", "\"></img>")
}

def md_to_html(md):
    lines = md.replace("\r\n", "\n").split("\n")
    html_lines, in_code, code_buf = [], False, []

    html_block = False

    for line in lines:
        stripped = line.strip()

        if stripped.startswith("```"):
            if not in_code:
                in_code, code_buf = True, []
            else:
                html_lines.append("<pre><code>" + html.escape("\n".join(code_buf)) + "</code></pre>")
                in_code = False
            continue

        if in_code:
            code_buf.append(line)
            continue

        if stripped.startswith("<") and stripped.endswith(">") and not stripped.startswith("</"):
            html_block = True
        elif stripped.startswith("</"):
            html_block = False

        if html_block or stripped.startswith("<"):
            html_lines.append(line)
            continue

        matched_custom = False
        for tag, (open_html, close_html) in CUSTOM_TAGS.items():
            if stripped.startswith(tag):
                content = stripped[len(tag):].strip()
                html_lines.append(f"{open_html}{html.escape(content)}{close_html}")
                matched_custom = True
                break
        if matched_custom:
            continue

        m = re.match(r"^\s*(#{1,6})\s+(.+)$", line)
        if m:
            level = len(m.group(1))
            html_lines.append(f"<h{level}>" + html.escape(m.group(2)) + f"</h{level}>")
        elif stripped:
            html_lines.append("<p>" + html.escape(line) + "</p>")

    return "\n".join(html_lines)

def render_template(name, **ctx):
    tpl = read_file(TEMPLATES / name)
    def repl(m):
        return str(ctx.get(m.group(1).strip(), ""))
    return re.sub(r"\{\{\s*([a-zA-Z0-9_]+)\s*\}\}", repl, tpl)

def copy_site_root():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True, exist_ok=True)
    for item in ROOT.iterdir():
        if item.name in EXCLUDE_COPY:
            continue
        dest = DIST / item.name
        if item.is_dir():
            shutil.copytree(item, dest, dirs_exist_ok=True)
        else:
            shutil.copy2(item, dest)

def load_posts():
    posts = []
    seen_slugs = set()

    for mdfile in sorted(POSTS.glob("*.md")):
        raw = read_file(mdfile)
        meta, body = parse_front_matter(raw)
        title = meta.get("title") or mdfile.stem
        date_str = meta.get("date", "")
        writer = meta.get("writer", "").strip()

        date = None
        if date_str:
            try:
                date = datetime.date.fromisoformat(date_str)
            except ValueError:
                date = None

        if not date:
            mtime = mdfile.stat().st_mtime
            date = datetime.date.fromtimestamp(mtime)

        display_date = date.strftime("%B %d, %Y")

        description = meta.get("description", "").strip()
        if not description:
            plain = strip_md(body)
            description = plain[:106] + " ..." if len(plain) > 140 else plain

        slug = meta.get("slug") or slugify(title)

        if slug in seen_slugs:
            print(f"Skipping duplicate post with slug: {slug}")
            continue
        seen_slugs.add(slug)

        html_body = md_to_html(body)
        posts.append({
            "title": title,
            "writer": writer,
            "date": date,
            "date_str": display_date,
            "description": description,
            "slug": slug,
            "html": html_body
        })

    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts

def build():
    copy_site_root()
    posts = load_posts()

    for p in posts:
        html_out = render_template("post.html", title=p["title"], date=p["date_str"], writer=p["writer"], content=p["html"])
        out_dir = DIST / "blogs" / p["slug"]
        out_dir.mkdir(parents=True, exist_ok=True)
        write_file(out_dir / "index.html", html_out)

    items = []
    for p in posts:
        
        items.append(
            '<div class="blog-post">'
            f'<h2>{html.escape(p["title"])}</h2>'
            f'<p>{html.escape(p["date_str"])}</p>'
            f'<p>{html.escape(p["description"])}</p>'
            '<br>'
            f'<div class="blog-buttons"><a href="../blogs/{p["slug"]}/index.html">Read more</a></div>'
            '</div>'
        )
    blogs_index = render_template("blogs_index.html", posts="".join(items))
    write_file(DIST / "blogs" / "index.html", blogs_index)
    print(f"Built {len(posts)} posts")

def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd == "build":
        build()
    else:
        print("Usage: python build.py build")

if __name__ == "__main__":
    main()
