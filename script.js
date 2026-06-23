const frame = document.getElementById("contentFrame");
const buttons = document.querySelectorAll(".tabBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const splashScreen = document.getElementById("splashScreen");
const frameLoader = document.getElementById("frameLoader");
const audio = document.getElementById("globalAudioPlayer");
 
window.songsRaw = [
    "Assets/From The Start - Laufey.mp3",
    "Assets/Falling Behind - Laufey.mp3",
    "Assets/Coffee - Beabadoobee.mp3",
    "Assets/Glue Song - Beabadoobee.mp3",
];
window.currentSongIndex = 0;

function parseSongData(url) {
    if (!url) return { name: "-", author: "-", url: "" };
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const cleanName = filename.replace(/\.[^/.]+$/, "");
    const parts = cleanName.split(" - ");
    
    if (parts.length >= 2) {
        return {
            name: parts[0].trim(),
            author: parts[1].trim(),
            url: url
        };
    }
    return {
        name: cleanName.trim(),
        author: "Unknown",
        url: url
    };
}

Object.defineProperty(window, 'songsList', {
    get: function() {
        return window.songsRaw.map(url => parseSongData(url));
    }
});

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
        audio.src = window.songsRaw[window.currentSongIndex];
        audio.volume = 1;
        audio.play().catch(err => console.log(err));
        if (frame.contentWindow && typeof frame.contentWindow.syncPlayerState === 'function') {
            frame.contentWindow.syncPlayerState();
        }
    }
});

audio.addEventListener("ended", () => {
    if (audio.loop) {
        if (frame.contentWindow && typeof frame.contentWindow.syncPlayerState === 'function') {
            frame.contentWindow.syncPlayerState();
        }
        return;
    }

    if (window.currentSongIndex < window.songsRaw.length - 1) {
        window.currentSongIndex++;
        audio.src = window.songsRaw[window.currentSongIndex];
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
