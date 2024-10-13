const startBtn = document.querySelector('#game-start');
const screens = document.querySelectorAll('.screen');
const timeOptions = document.querySelector('#time-options');
const timeEl = document.querySelector('#game-time');
const playArea = document.querySelector('#play-area');
const scoreListEl = document.querySelector('#score-list');
const restartBtn = document.querySelector('#restart-btn');
const resetScoresBtn = document.querySelector('#reset-scores-btn');

const shapes = ['🌟', '✨', '💫', '🌠', '🌼', '❤️', '🎈', '🏀', '⚽', '🌈'];
let time = 0;
let score = 0;
let gameInterval = null;
let gameNumber = 0;

startBtn.addEventListener('click', (event) => {
	event.preventDefault();
	showScreen('time-selection-screen');
});

timeOptions.addEventListener('click', (event) => {
	if (event.target.classList.contains('time-choice')) {
		time = parseInt(event.target.getAttribute('data-time'));
		showScreen('game-screen');
		startGame();
	}
});

playArea.addEventListener('click', (event) => {
	if (event.target.classList.contains('shape')) {
		score++;
		event.target.remove();
		createRandomShape();
	}
});

restartBtn.addEventListener('click', resetGame);

resetScoresBtn.addEventListener('click', () => {
	localStorage.removeItem('results');
	scoreListEl.innerHTML = '';
	gameNumber = 0;
});

function showScreen(screenId) {
	screens.forEach((screen) => {
		if (screen.id === screenId) {
			screen.classList.add('active');
		} else {
			screen.classList.remove('active');
		}
	});
}

function startGame() {
	score = 0;
	gameNumber++;
	timeEl.parentNode.classList.remove('hide');
	gameInterval = setInterval(decreaseTime, 1000);
	createRandomShape();
	setTime(time);
}

function decreaseTime() {
	if (time === 0) {
		finishGame();
	} else {
		let current = --time;
		if (current < 10) {
			current = `0${current}`;
		}
		setTime(current);
	}
}

function setTime(value) {
	timeEl.innerHTML = `00:${value}`;
}

function finishGame() {
	clearInterval(gameInterval);
	timeEl.parentNode.classList.add('hide');
	playArea.innerHTML = '';

	saveResult(score);
	displayResults();

	showScreen('result-section');
}

function createRandomShape() {
	const shape = document.createElement('div');
	const size = getRandomNumber(30, 100);
	const { width, height } = playArea.getBoundingClientRect();
	const x = getRandomNumber(0, width - size);
	const y = getRandomNumber(0, height - size);
	const symbol = getRandomShape();

	shape.classList.add('shape');
	shape.style.fontSize = `${size}px`;
	shape.style.position = 'absolute';
	shape.style.top = `${y}px`;
	shape.style.left = `${x}px`;
	shape.textContent = symbol;

	shape.classList.add('animate-shape');

	playArea.append(shape);
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function getRandomShape() {
	return shapes[Math.floor(Math.random() * shapes.length)];
}

function resetGame() {
	score = 0;
	time = 0;
	scoreListEl.innerHTML = '';
	showScreen('start-screen');
}

function saveResult(score) {
	const results = JSON.parse(localStorage.getItem('results')) || [];
	results.push({ game: gameNumber, score: score });
	localStorage.setItem('results', JSON.stringify(results));
}

function displayResults() {
	let results = JSON.parse(localStorage.getItem('results')) || [];
	scoreListEl.innerHTML = '';
	results.forEach((result, index) => {
		const li = document.createElement('li');
		li.textContent = `Game ${result.game}: ${result.score} points`;
		scoreListEl.append(li);
	});
}
