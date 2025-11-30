//a jatek tabla HTML elemet keressuk
const gameBoard = document.getElementById("game-board");
// az idomeret meghatarozasa
const timerDisplay = document.getElementById("timer");
// probaalkozas szamlalo html elemet keressuk
const movesDisplay = document.getElementById('moves');
//Uzenet doboz html elemet keressuk
const messageBox = document.getElementById('message-box');

// Jatek allapota--
let card = []; // a kartyak tombje
let flippedCards = []; // a megforditott kartyakat tarolja
let matchedPairs = 0; // a talalatok szamlaloja
let moves = 0; // a probaalkozasok szamlaloja
let timer = 0; // az idomero valtozoja
let timerInterval; // az időzítő intervallum változója
let isWaiting = false; // jelzi hogy a jatek elkezdodott-e
let gameStarted = false; // jelzi hogy a játék elindult-e

// ido az utolso kartyaforditas ota
let lastFlipTimestamp = 0;
// bonusz idokorlat 1 masodperc
const BONUS_TIME_LIMIT = 1000;

const winterImage = [
    'fa_hoember.jpg',
    'forro-csoki-blog.jpg',
    'hopehely.jpg',
    'kandalo.jpg',
    'korcsolya.jpg',
    'renszarvas.webp',
    'teli_fenyofa.jpg',
    'https://placehold.co/120x120/a8dadc/1d3557?text=Kesztyu',
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
function formatTime(seconds) {
    //kiszamitjuk a perceket
    const minutes = Math.floor(seconds / 60);
    //kiszámitja a fenmarado masodperceket 
    const remainingSeconds = seconds % 60;
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
    matchedPairs = 0;
    moves = 0;
    isWaiting = false;
    // Visszaállítja a várakozási állapotot
    gameStarted = true; // A játék most elindult!
    // frissiti a probaalkozasok szamlalojat
    movesDisplay.textContent = moves;
    // uzenet doboz torlese
    messageBox.style.display = 'none';

    // Kártyák előkészítése - duplikáljuk és keverjük meg
    card = [...winterImage, ...winterImage];
    shuffleArray(card);

    // kartayak elokeszitese
    // vegigmegy az osszes kartyan 
    card.forEach((imageUrl, index) => {
        //latrehoz egy kontainer div elemet a 3d hatashoz
        const container = document.createElement('div');
        // hazzadja a stilus osztalyt
        container.classList.add('card-container');
        // beallitja az adat indexet
        container.dataset.index = index;
        // esemenyfigyelo hozzaadasa a kattintashoz, atadva a kepet
        container.addEventListener('click', () => flipCard(container, imageUrl));

        // html generalas: img tag hasznalata a kephez
        container.innerHTML = `
            <div class="card" id="card-${index}">
                <div class="card-face card-back">.</div>
                <div class="card-face card-front">
                    <img src="${imageUrl}" alt="Card Image">
                </div>
            </div>
        `;
        // hozzaadja a kartya kontainert a jatek tablahoz
        gameBoard.appendChild(container);
    });
    // elinditja az idozitot
    startTimer();
}

// egy kartya felforditasa
function flipCard(cardContainer, imageUrl) {
    // ellenorzi hogy a jatek elindult-e, nem var-e, vagy mar felforditottak-e ket kartyat
    if (!gameStarted || isWaiting || cardContainer.querySelector('.card').classList.contains('flipped') || cardContainer.querySelector('.card').classList.contains('matched')) {
        // ha nem lehet felforditani, kilep a fuggvenybol
        return;
    }

    // megkeresi a kartya elemet
    const cardElement = cardContainer.querySelector('.card');
    // hozzaadja a flipped osztályt a 3d atforditashoz
    cardElement.classList.add('flipped');
    // Hozzaadja a kartyat a felforditott kartyak listajahoz
    flippedCards.push({ element: cardElement, imageUrl:imageUrl, index: cardContainer.dataset.index });

    // ket lap van felforditva?
    if (flippedCards.length === 2) {
        // A lepesszam novelese a checkForMatch-ben tortenik, a bonusz ellenorzes utan
        isWaiting = true; //zarolja a kattintasoat

        // ellenorzi a bonusz idokorlatozast
        setTimeout(checkForMatch, 1000);
    } else if (flippedCards.length === 1) {
        // ÚJ: Ha ez az ELSŐ kártya egy próbálkozáson belül, rögzítjük az időt
        lastFlipTimestamp = Date.now();
    }
}

//bonusz felugro uzenet mutatasa
function showBonusPopup() {
    const bonusPopup = document.getElementById('bonus-move');
    bonusPopup.style.display = 'block';
    // megjeleniti a bonusz uzenetet egy kis animacioval
    setTimeout(() => {
        bonusPopup.classList.add('show');
    }, 10); // kis kesleltetes az animacio inditasahoz

    // eltunteti az uzenetet 1 masodperc mulva
    setTimeout(() => {
        bonusPopup.classList.remove('show');
        // elrejti az elemet animacio utan
        setTimeout(() => {
            bonusPopup.style.display = 'none';
        }, 300);
    }, 1000);
}

// elenorzi hogy a ket felforditott kartya megegyezik-e
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;
    
    // Kiszamitja az eltelt idot az elso kartya felforditasa ota
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastFlipTimestamp;
    let isBonusMatch = false;

    if (firstCard.imageUrl === secondCard.imageUrl) {
        // Megtalált pár

        // bonusz ellenorzes: ha gyors volt a 2. forditas
        if (timeElapsed <= BONUS_TIME_LIMIT) {
            // bonusz, nem noveli a lepesszamot
            showBonusPopup(); // megjeleniti a bonusz uzenetet
            isBonusMatch = true;
        }

        // noveli a lepesszamot csak ha nem bonusz
        if (!isBonusMatch) {
            moves++;
            movesDisplay.textContent = moves;
        }

        // Hozzáadja a 'matched' osztályt, ami zöld kerettel jelzi a találatot
        firstCard.element.classList.add('matched');
        // A második kártyán is beállítja a találat jelzést
        secondCard.element.classList.add('matched');
        // Növeli a megtalált párok számát
        matchedPairs++;
        
        // Ellenőrzi, hogy az összes párt megtaláltuk-e (8 pár)
        if (matchedPairs === card.length / 2) {
            // Ha igen, befejezi a játékot
            endGame();
        }

    } else {
        // Nem egyezik, fordítsd vissza
        // Eltávolítja a 'flipped' osztályt az első kártyáról (visszafordul)
        firstCard.element.classList.remove('flipped');
        // Eltávolítja a 'flipped' osztályt a második kártyáról (visszafordul)
        secondCard.element.classList.remove('flipped');
    }

    // Törli a felfordított kártyák listáját a következő próbálkozáshoz
    flippedCards = [];
    // Visszaállítja a várakozási állapotot, lehetővé téve az újabb kattintásokat
    isWaiting = false;// Feloldja a kattintás zárolását
}

// A játék befejezése (ha az összes párt megtaláltuk)
function endGame() {
    // Megállítja az időzítőt
    clearInterval(timerInterval);
    // Beállítja a játékot befejezettre
    gameStarted = false;
    
    // Üzenet megjelenítése
    // Beállítja a végső időt a modális ablakban
    document.getElementById('final-time').textContent = formatTime(timer);
    // Beállítja a végső próbálkozások számát a modális ablakban
    document.getElementById('final-moves').textContent = moves;
    // Megjeleníti a modális ablakot
    messageBox.style.display = 'flex';
}

 // Hópelyhek generálása
function createSnowflakes() {
    const snowflakeCount = 50; // Hópelyhek száma
    const body = document.body;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Véletlenszerű pozíció
        snowflake.style.left = Math.random() * 100 + '%';
        //kezdo pozicio a kepernyo teteje felett
        snowflake.style.top = '-10vh'; 
        // Véletlenszerű animáció időtartam (5-15 másodperc)
        snowflake.style.animationDuration = (Math.random() * 10 + 5) + 's';
        // Véletlenszerű késleltetés
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        // veletlenszeru meret
        const size = Math.random() * 3 + 2;
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';
        
        body.appendChild(snowflake);
    }
}

// Sarki fény háttér hozzáadása
function createAuroraBackground() {
    const aurora = document.createElement('div');
    aurora.classList.add('aurora-background');
    document.body.insertBefore(aurora, document.body.firstChild);
}

// Indítás a betöltéskor
window.onload = function() {
    createAuroraBackground();
    createSnowflakes();
    startGame();
};
