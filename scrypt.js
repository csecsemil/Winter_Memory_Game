//a jatek tabla HTML elemet keressuk
const gameBoard = document.getElementById("game-board");
// az idomeret meghatarozasa
const timerDisplay = document.getElementById("timer");
// probaalkozas szamlalo html elemet keressuk
const movesDisplay = document.getElementById('moves');
//Uzenet doboz html elemet keressuk
const messageBox = document.getElementById('message-box');

// Jatek allapota--
let card = []; // a jatektablan levo kartya  utvonalakat url tarolja
let flippedCards = []; // a megforditott kartyakat tarolja
let matchedPairs = 0; // a talalatok szamlaloja
let moves = 0; // a probaalkozasok szamlaloja
let timer; // az idomero valtozoja
let isWaiting = false; // jelzi hogy a jatek elkezdodott-e

const winterImage = [
    'fa_hoember.jpg',
    'forro-csoki-blog.jpg',
    'hopehely.jpg',
    'kandalo.jpg',
    'korcsolya.jpg',
    'renszarvas.webp',
    'teli_fenyofa.jpg',
];

// segedd funkcio a tomb osszekeveresere

// ---TENYLEG kevero funkcio---
function shuffleArray(array) {
    // vegig megy a tomb elemein visszafele
    for (let i = array.length - 1; i > 0; i--) { 
        // Véletlenszerű index generálása az aktuális pozíció előtt
        const j = Math.floor(Math.random() * (i + 1));
        // Elemek felcserélése (destructuring assignment)
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// idoformazo  fugveny perc es masodperc megjelenitesere
function formatTime(second) {
    //iszanitjuk a perceket
    const minutes = Math.floor(seconds / 60);
    //kiszámitja a fenmarado masodperceket 
    const remainingSeconds = second % 60;
    //visszateritjuk a formazott stringet (pl. 00:05), ket szamjegyre kiegeszitve
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// az idozito elinditasa vagy ujrainditasa
function startTimer() {
    clearInterval(timerInterval); // korabbi idozito torlese
    timer = 0; // idozito nullazasa
    timerDisplay.textContent = formatTime(timer); // kezdo ertek megjelenitese
    timerInterval = setInterval(() => {
        // noveli az idot
        timer++;
        // frissiti a megjelenitest
        timerDisplay.textContent = formatTime(timer);
    }, 1000); // masodpercenkent frissit
}

// fo jatek logika
function startGame() {
    //jatek allaphelyzetbe allitasa
    // megallitja az idozitot
    clearInterval(timerInterval);
    // torli a jatektablat
    gameBoard.innerHTML = '';
    //torli a felforsitott kartyakat
    flippedCards = []; 
}
