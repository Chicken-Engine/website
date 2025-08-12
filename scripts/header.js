document.querySelectorAll("headerr").forEach(qer => {
    let scriptUrl = document.currentScript.src; 
    let scriptDir = scriptUrl.substring(0, scriptUrl.lastIndexOf("/") + 1);

    let root = scriptDir.replace(/scripts\/$/, "");

    qer.outerHTML = `
  <link href="${root}scripts/header.css" rel="stylesheet">
  <header>
    <a href="${root}index.html">
      <img src="${root}logo.png" alt="Chicken Engine">
    </a>

    <div class="nav-buttons">
      <a href="${root}index.html">Home</a>
      <a href="${root}blogs.html">Blogs</a>
      <a href="${root}wordle.html">Wordle</a>
    </div>
  </header>
`;
});
