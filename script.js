const frame = document.getElementById("contentFrame");
const buttons = document.querySelectorAll(".tabBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const splashScreen = document.getElementById("splashScreen");
const frameLoader = document.getElementById("frameLoader");
const audio = document.getElementById("globalAudioPlayer");
 
window.songsList = [
    {
        name: "From The Start",
        author: "Laufey",
        url: "Assets/From The Start.mp3"
    },
    {
        name: "Falling Behind",
        author: "Laufey",
        url: "Assets/Falling Behind.mp3"
    }
];
window.currentSongIndex = 0;

frame.addEventListener('load', () => {
    frameLoader.classList.remove('visible');
});

buttons.forEach(button => {
    button.addEventListener("click", () => {
        if (button.classList.contains("active")) return;

        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        frameLoader.classList.add('visible');
        frame.src = button.dataset.tab;

        if (window.innerWidth <= 768) {
            sidebar.classList.remove("open");
            overlay.classList.remove("open");
        }
    });
});

splashScreen.addEventListener("click", () => {
    splashScreen.classList.add("fade-out");
    if (audio.paused && !audio.src) {
        audio.src = window.songsList[window.currentSongIndex].url;
        audio.volume = 1;
        audio.play().catch(err => console.log(err));
        if (frame.contentWindow && typeof frame.contentWindow.syncPlayerState === 'function') {
            frame.contentWindow.syncPlayerState();
        }
    }
});

audio.addEventListener("ended", () => {
    if (window.currentSongIndex < window.songsList.length - 1) {
        window.currentSongIndex++;
        audio.src = window.songsList[window.currentSongIndex].url;
        audio.play().catch(err => console.log(err));
    } else {
        audio.currentTime = 0;
    }
    if (frame.contentWindow && typeof frame.contentWindow.syncPlayerState === 'function') {
        frame.contentWindow.syncPlayerState();
    }
});

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("open");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
});
