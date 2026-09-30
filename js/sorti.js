/* =====================================================
   SORTI — Mascot controller
   createSorti(imgId) makes an independent controller for
   one <img>, so the site can run more than one mascot at
   once (Studi Kasus + Materi) without them fighting over
   the same element.
   ===================================================== */

const SORTI_ASSETS = {
    welcome: "assets/sorti/welcome.png",
    idle: "assets/sorti/idle.png",
    left: "assets/sorti/point_left.png",
    right: "assets/sorti/point_right.png",
    think: "assets/sorti/think.png",
    swap: "assets/sorti/swap.png",
    explain: "assets/sorti/explain.png",
    success: "assets/sorti/success.png",
    alert: "assets/sorti/alert.png"
};

function createSorti(imgId){

    const img = document.getElementById(imgId);

    return {

        img,

        set(state){

            if(!img || !SORTI_ASSETS[state]) return;

            img.classList.add("fade-out");

            setTimeout(() => {

                img.src = SORTI_ASSETS[state];
                img.classList.remove("fade-out");

            }, 180);

        }

    };

}

// Maskot utama (Studi Kasus). Fungsi global di bawah ini dipertahankan
// agar seluruh kode yang sudah memanggilnya tetap berjalan tanpa perubahan.
const SORTI = createSorti("sortiCharacter");

function compareLeft(){ SORTI.set("left"); }
function compareRight(){ SORTI.set("right"); }
function thinking(){ SORTI.set("think"); }
function swapping(){ SORTI.set("swap"); }
function explaining(){ SORTI.set("explain"); }
function finishSort(){ SORTI.set("success"); }
function warningSort(){ SORTI.set("alert"); }
function idle(){ SORTI.set("idle"); }
