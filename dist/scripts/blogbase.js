window.addEventListener('DOMContentLoaded', () => {
    const blogContent = document.querySelector('.blog-post');
    if (!blogContent) return;

    const text = blogContent.innerText || blogContent.textContent;
    const wordCount = text.trim().split(/\s+/).length;

    const readTimeEl = document.createElement('p');
    readTimeEl.innerHTML = `<strong>Read Time:</strong> ${Math.ceil(wordCount / 200)} min read`;

    const dateParagraph = blogContent.querySelector('p');
    
    if (dateParagraph)
        dateParagraph.insertAdjacentElement('afterend', readTimeEl);
    else
        blogContent.prepend(readTimeEl);
});

document.querySelectorAll("evideo").forEach(header => {
    if (!header.id) return;

    var progressthumburl = "https://www.pets-n-friends.com/image.edit/imagelibrary/petsnfriends/shapes/dot_06_white.png";

    header.outerHTML = `
    <div class="video-container">
    <video id="myVideo" preload="metadata" src="${header.id}">
        Your browser does not support the video tag.
    </video>
    <!-- <video id="myVideo" src="${header.id}" preload="metadata"></video> -->
    <div class="controls">
        <button class="play-btn" id="playPauseBtn">Play</button>
        <div class="progress" id="progressBar">
        <div id="progressBar" class="progress">
            <div class="progress-filled"></div>
            <img id="progressThumb" class="progress-thumb" src="${progressthumburl}">
        </div>
        <div class="progress-filled"></div>
        </div>
    </div>
    </div>
    `;
});

document.querySelectorAll("e1, e2, e3, e1title, e2title, e3title").forEach(header => {
    if (!header.id) return;

    let tag;
    let code;

    switch (header.tagName.toLowerCase())
    {
    case "e1" || "e1title":
        tag = "h1";
        break;

    case "e2" || "e2title":
        tag = "h2";
        break;

    case "e3" || "e3title":
        tag = "h3";
        break;

    default:
        tag = "h1";
        break;
    }

    switch (header.tagName.toLowerCase())
    {
    case "e1title" || "e2title" || "e3title":
        code = `<title>Chicken Engine - ${header.id}</title>`;
        break;

    default:
        code = ``;
        break;
    };

    header.outerHTML = `${code}<${tag} id="${header.id}">${header.id}</${tag}>`;
});

document.querySelectorAll("h1, h2, h3").forEach(header => {
    if (!header.id) return;

    let id = header.id;

    let btn = document.createElement("img");
    btn.src = "https://www.svgrepo.com/show/532867/link.svg";
    btn.alt = "Copy link";
    btn.title = "Copy link";

    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0px 0px 0px white";
    btn.className = "hover";
    btn.style.marginLeft = "0.4em";
    btn.style.marginTop = "0.8em";
    btn.style.visibility = "hidden";
    btn.style.filter = "invert(100%)";
    btn.style.height = "1em";
    btn.style.width = "auto";
    btn.style.verticalAlign = "middle";

    btn.onclick = () => {
        let baseUrl = window.location.href.split('#')[0];
        let url = `${baseUrl}#${encodeURIComponent(id)}`;
        navigator.clipboard.writeText(url).then(() => {
            btn.style.filter = "invert(55%) sepia(84%) saturate(457%) hue-rotate(184deg) brightness(32%) contrast(92%)";
            setTimeout(() => {
                btn.style.filter = "invert(100%)";
            }, 1000);
        });
    };

    header.addEventListener("mouseenter", () => btn.style.visibility = "visible");
    header.addEventListener("mouseleave", () => btn.style.visibility = "hidden");

    header.appendChild(btn);
});