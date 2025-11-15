// Register Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("SW Registered ✔"))
        .catch(err => console.log("SW Failed ❌", err));
}


// PWA Install Handler
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById("installPWA").style.display = "block";
});

document.getElementById("installPWA").addEventListener("click", async () => {
    document.getElementById("installPWA").style.display = "none";
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
});
