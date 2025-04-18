document.addEventListener("DOMContentLoaded", () => {
    video = document.getElementById("gameplayVideo");
    buttons = document.querySelectorAll(".game-btn");

    video.src = "videos/minecraft.mp4";
    video.load();
    video.play();

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            selected = button.getAttribute("data-src");
            video.src = `videos/${selected}`;
            video.load();
            video.play();
        });
    });
});
