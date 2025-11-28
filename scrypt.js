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
    'renszarvas.png',
    'fa_hoember.png',
    ''
];
