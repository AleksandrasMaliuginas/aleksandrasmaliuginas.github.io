"use strict";

const sleep = ms => new Promise(r => setTimeout(r, ms));

let animation_lock = false;
async function animateNextCard() {

    if (animation_lock) return;
    animation_lock = true;

    const allCards = document.querySelectorAll(".moving-card")

    allCards.forEach(async (value, key) => {

        resetAnimation(value)
        value.classList.add("move")

        await sleep(1000)
        value.classList.remove("move")
        resetAnimation(value)

        if (value.classList.contains("one")) {
            value.classList.remove("one")
            value.classList.add("three")
        } else if (value.classList.contains("two")) {
            value.classList.remove("two")
            value.classList.add("one")
        } else if (value.classList.contains("three")) {
            value.classList.remove("three")
            value.classList.add("two")
        } 

        resetAnimation(value)
        animation_lock = false;
    })
}

function resetAnimation(element) {
    element.style.animation = 'none';
    element.offsetHeight; /* trigger reflow */
    element.style.animation = null;
}

export const showNextCard = animateNextCard
export const animationInProgress = () => animation_lock === true
