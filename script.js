const levels = {
    easy: [
        { numbers: [1, 2, 3], order: 'ascending' },
        { numbers: [1, 2, 3], order: 'descending' },
        { numbers: [1, 2, 3, 4], order: 'ascending' },
        { numbers: [1, 2, 3, 4], order: 'descending' },
        { numbers: [1, 2, 3, 4, 5], order: 'ascending' },
        { numbers: [1, 2, 3, 4, 5], order: 'descending' }
    ],
    medium: [
        { numbers: [1, 2, 3, 4, 5], order: 'ascending' },
        { numbers: [2, 3, 4, 5, 6], order: 'ascending' },
        { numbers: [3, 4, 5, 6, 7], order: 'ascending' },
        { numbers: [4, 5, 6, 7, 8], order: 'ascending' },
        { numbers: [5, 6, 7, 8, 9], order: 'ascending' },
        { numbers: [6, 7, 8, 9, 10], order: 'ascending' }
    ],
    hard: [
        { numbers: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5), order: 'ascending' },
        { numbers: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5), order: 'ascending' },
        { numbers: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5), order: 'ascending' },
        { numbers: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5), order: 'descending' },
        { numbers: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5), order: 'descending' },
        { numbers: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5), order: 'descending' }
    ]
};

let currentLevelIndex = 0;
let currentLevelSet = [];
let selectedChoices = [];

document.addEventListener('DOMContentLoaded', initMenu);

function initMenu() {
    document.getElementById('easy-button').onclick = () => startGame('easy');
    document.getElementById('medium-button').onclick = () => startGame('medium');
    document.getElementById('hard-button').onclick = () => startGame('hard');
}

function startGame(difficulty) {
    currentLevelSet = levels[difficulty];
    currentLevelIndex = 0;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    setupLevel(currentLevelSet[currentLevelIndex]);
}

function setupLevel(level) {
    const dropBoxesContainer = document.getElementById('drop-boxes');
    const choicesContainer = document.getElementById('choices');
    const gameTitle = document.getElementById('game-title');

    dropBoxesContainer.innerHTML = '';
    choicesContainer.innerHTML = '';
    selectedChoices = [];

    gameTitle.innerText = level.order === 'ascending' ? 'Järjestä numerot pienimmästä suurimpaan' : 'Järjestä numerot suurimmasta pienimpään';

    playLevelSound(level.order);

    level.numbers.slice().sort((a, b) => level.order === 'ascending' ? a - b : b - a).forEach(() => {
        const box = document.createElement('div');
        box.classList.add('box');
        dropBoxesContainer.appendChild(box);
    });

    shuffle(level.numbers).forEach(number => {
        const choice = document.createElement('div');
        choice.classList.add('choice');
        choice.style.backgroundImage = `url('${number}.avif')`;
        choice.onclick = () => handleChoiceClick(choice, number);
        choicesContainer.appendChild(choice);
    });
}

function playLevelSound(order) {
    const audio = new Audio(order === 'ascending' ? 'pieniaani.mp3' : 'suuriaani.mp3');
    audio.play();
}

function handleChoiceClick(choiceElement, number) {
    const dropBoxes = document.querySelectorAll('#drop-boxes .box');
    const currentDropBox = dropBoxes[selectedChoices.length];

    if (currentDropBox) {
        const level = currentLevelSet[currentLevelIndex];
        const correctNumber = level.order === 'ascending' ? level.numbers.sort((a, b) => a - b)[selectedChoices.length] : level.numbers.sort((a, b) => b - a)[selectedChoices.length];

        if (number === correctNumber) {
            currentDropBox.style.backgroundImage = `url('${number}.avif')`;
            playSound(number);
            selectedChoices.push(number);
            choiceElement.classList.add('faded');

            if (selectedChoices.length === level.numbers.length) {
                if (currentLevelIndex < currentLevelSet.length - 1) {
                    document.getElementById('next-level').style.display = 'block';
                } else {
                    showCompletionMessage();
                }
            }
        } else {
            choiceElement.classList.add('incorrect');
            setTimeout(() => {
                choiceElement.classList.remove('incorrect');
            }, 1000);
        }
    }
}

function playSound(number) {
    const audio = new Audio(`${number}.mp3`);
    audio.play();
}

document.getElementById('next-level').onclick = () => {
    currentLevelIndex++;
    setupLevel(currentLevelSet[currentLevelIndex]);
    document.getElementById('next-level').style.display = 'none';
}

function showCompletionMessage() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = `
        <h1>HIENOA!</h1>
        <div>
            <img src="tahti.avif" alt="Tähti" class="star">
            <img src="tahti.avif" alt="Tähti" class="star">
            <img src="tahti.avif" alt="Tähti" class="star">
        </div>
        <button id="restart-game">Palaa alkuvalikkoon</button>
    `;
    document.getElementById('restart-game').onclick = restartGame;
}

function restartGame() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-container').innerHTML = `
        <h1 id="game-title"></h1>
        <div id="drop-boxes"></div>
        <div id="choices"></div>
        <button id="next-level" style="display: none;">Seuraava taso</button>
    `;
    initMenu();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}