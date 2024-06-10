"use strict";
import { showNextCard, animationInProgress } from "./moving-cards.js";

let questionCounter = 0;
let QUESTIONS = [
    "What weird food combinations do you really enjoy?",
    "How judgmental are you?",
    "What is a memorable mess you had to clean up?",
];

async function loadQuestions() {
    await loadQuestionSet("questions/500-good-questions-to-ask.csv", "500 Good questions to ask");
}

async function loadQuestionSet(fileUrl, title) {
    const response = await fetch(fileUrl);
    const fileStr = await response.text();
    QUESTIONS = fileStr.split('\n');
}



await loadQuestions();
shuffleQuestions();

const nextButton = document.getElementById("btn-next-card")
nextButton.addEventListener("click", onNextCard);
const shuffleButton = document.getElementById("btn-shuffle")
shuffleButton.addEventListener("click", shuffleQuestions);



function shuffleQuestions() {
    shuffle(QUESTIONS);
    questionCounter = 0;

    const currentCard = document.querySelector(".moving-card.one .card-title")
    currentCard.textContent = QUESTIONS[questionCounter++];
}

function onNextCard() {
    if (animationInProgress()) return;

    const nextCard = document.querySelector(".moving-card.two .card-title")
    nextCard.textContent = QUESTIONS[questionCounter++ % QUESTIONS.length];

    showNextCard();
}


// https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}
