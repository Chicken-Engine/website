document.querySelectorAll("footerr").forEach(qer => {
    let scriptUrl = document.currentScript.src; 
    let scriptDir = scriptUrl.substring(0, scriptUrl.lastIndexOf("/") + 1);

    let root = scriptDir.replace(/scripts\/$/, "");

    qer.outerHTML = `
  <link href="${root}scripts/footer.css" rel="stylesheet">
  <footer>
    <div class="footer-socials">
      <a href="https://discord.gg/nVXMEUNG9v" target="_blank"><img src="https://www.svgrepo.com/show/353655/discord-icon.svg"></a>
      <a href="https://x.com/ChicknEngine" target="_blank"><img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-white-icon.png"></a>
      <a href="https://youtube.com/@ChickenEngine" target="_blank"><img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/youtube-app-white-icon.png"></a>
    </div>
  </footer>
`;
});
