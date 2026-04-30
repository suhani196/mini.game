/* =========================
   TOAST SYSTEM
========================= */

function showToast(message) {
    const toast = document.getElementById('toast');

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}


/* =========================
   GAME 1 - EMOJI QUIZ
========================= */

const quizData = [
    { q: '🍕 + 🍕 = ?', opts: ['🍕🍕', '🍔', '🍕x2', '2 Pizza'], ans: 0 },
    { q: '🐶 says?', opts: ['Meow', 'Woof', 'Moo', 'Oink'], ans: 1 },
    { q: 'Capital of India?', opts: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'], ans: 2 },
    { q: '2 + 2 = ?', opts: ['3', '5', '4', '22'], ans: 2 },
    { q: '🌙 comes after?', opts: ['Dawn', 'Noon', 'Evening', 'Sunset'], ans: 2 },
    { q: '🍌 is a?', opts: ['Vegetable', 'Fruit', 'Grain', 'Nut'], ans: 1 },
    { q: 'Fastest animal?', opts: ['Lion', 'Eagle', 'Cheetah', 'Horse'], ans: 2 },
    { q: 'Red + Blue = ?', opts: ['Green', 'Purple', 'Orange', 'Pink'], ans: 1 }
];

let quizIndex = 0;
let quizScore = 0;
let quizActive = false;

function startQuiz() {
    quizIndex = 0;
    quizScore = 0;
    quizActive = true;

    document.getElementById('quiz-result').textContent = '';
    loadQuiz();
}

function loadQuiz() {
    if (quizIndex >= quizData.length) {
        document.getElementById('quiz-q').textContent =
            quizScore >= 6 ? '🎉 Great Job!' : '😊 Finished!';

        document.getElementById('quiz-opts').innerHTML = '';
        document.getElementById('quiz-score').textContent =
            `${quizScore}/${quizData.length}`;

        quizActive = false;
        return;
    }

    const data = quizData[quizIndex];

    document.getElementById('quiz-q').textContent = data.q;
    document.getElementById('quiz-score').textContent =
        `${quizIndex}/${quizData.length}`;

    const container = document.getElementById('quiz-opts');
    container.innerHTML = '';

    data.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt;

        btn.onclick = () => checkAnswer(i, btn);
        container.appendChild(btn);
    });
}

function checkAnswer(index, btn) {
    if (!quizActive) return;

    const correct = quizData[quizIndex].ans;
    const buttons = document.querySelectorAll('#quiz-opts button');

    buttons.forEach(b => (b.disabled = true));

    if (index === correct) {
        btn.style.background = '#2ecc71';
        quizScore++;
        showToast('Correct ✅');
    } else {
        btn.style.background = '#e74c3c';
        buttons[correct].style.background = '#2ecc71';
        showToast('Wrong ❌');
    }

    setTimeout(() => {
        quizIndex++;
        loadQuiz();
    }, 800);
}

startQuiz();


/* =========================
   GAME 2 - MEMORY MATCH
========================= */

const emojis = ['🐶', '🐱', '🦊', '🐸', '🦁', '🐧', '🦋', '🌸'];

let cards = [];
let flipped = [];
let moves = 0;
let matched = 0;
let lock = false;

function initMemory() {
    const board = document.getElementById('memory-grid');

    const shuffled = [...emojis, ...emojis]
        .sort(() => Math.random() - 0.5);

    board.innerHTML = '';
    cards = [];
    flipped = [];
    moves = 0;
    matched = 0;
    lock = false;

    document.getElementById('moves').textContent = 0;
    document.getElementById('matched').textContent = 0;

    shuffled.forEach(symbol => {
        const card = document.createElement('div');
        card.className = 'mem-card';
        card.dataset.value = symbol;
        card.textContent = '❓';

        card.onclick = () => flipCard(card);

        board.appendChild(card);
        cards.push(card);
    });
}

function flipCard(card) {
    if (lock || card.classList.contains('open')) return;

    card.classList.add('open');
    card.textContent = card.dataset.value;

    flipped.push(card);

    if (flipped.length === 2) {
        lock = true;
        moves++;
        document.getElementById('moves').textContent = moves;

        const [a, b] = flipped;

        if (a.dataset.value === b.dataset.value) {
            matched++;
            document.getElementById('matched').textContent = matched;

            flipped = [];
            lock = false;

            if (matched === emojis.length) {
                showToast('🎉 You Won!');
            }
        } else {
            setTimeout(() => {
                a.classList.remove('open');
                b.classList.remove('open');
                a.textContent = '❓';
                b.textContent = '❓';

                flipped = [];
                lock = false;
            }, 700);
        }
    }
}

initMemory();


/* =========================
   GAME 3 - REACTION TEST
========================= */

let state = 'idle';
let startTime;
let timer;

function startReaction() {
    const box = document.getElementById('reaction-box');

    box.textContent = 'Wait for green...';
    box.style.background = '#222';

    state = 'waiting';

    const delay = 1000 + Math.random() * 3000;

    timer = setTimeout(() => {
        box.textContent = 'CLICK NOW!';
        box.style.background = '#2ecc71';

        startTime = Date.now();
        state = 'ready';
    }, delay);
}

function reactionClick() {
    const box = document.getElementById('reaction-box');

    if (state === 'waiting') {
        clearTimeout(timer);
        showToast('Too early ❌');
        state = 'idle';
        box.textContent = 'Click Start again';
        return;
    }

    if (state === 'ready') {
        const time = Date.now() - startTime;

        showToast(`${time}ms ⚡`);
        box.textContent = `${time}ms`;

        state = 'idle';
    }
}


/* =========================
   GAME 4 - NUMBER GUESS
========================= */

let secret = 0;
let attempts = 0;
let active = false;

function startGuess() {
    secret = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    active = true;

    document.getElementById('guess-display').textContent = '?';
    document.getElementById('guess-hint').textContent = 'Start guessing!';
    document.getElementById('guess-attempts').textContent = '0/7';
}

function checkGuess() {
    if (!active) return startGuess();

    const input = document.getElementById('guess-input');
    const val = Number(input.value);

    if (!val) return;

    attempts++;

    document.getElementById('guess-attempts').textContent =
        `${attempts}/7`;

    if (val === secret) {
        showToast('Correct 🎉');
        active = false;
    } else if (attempts >= 7) {
        showToast(`Game Over ❌ ${secret}`);
        active = false;
    } else if (val < secret) {
        showToast('Higher 📈');
    } else {
        showToast('Lower 📉');
    }

    input.value = '';
}

startGuess();


/* =========================
   GAME 5 - WORD SCRAMBLE
========================= */

const words = [
    { w: 'MANGO', h: '🥭 Fruit' },
    { w: 'TIGER', h: '🐯 Animal' },
    { w: 'CLOUD', h: '☁️ Sky' },
    { w: 'CHAIR', h: '🪑 Object' },
    { w: 'MUSIC', h: '🎵 Sound' }
];

let current;
let streak = 0;
let score = 0;

function nextScramble() {
    current = words[Math.floor(Math.random() * words.length)];

    const scrambled = current.w
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    document.getElementById('scramble-word').textContent = scrambled;
    document.getElementById('scramble-hint').textContent = current.h;

    document.getElementById('scramble-input').value = '';
}

function checkScramble() {
    const input = document.getElementById('scramble-input').value.toUpperCase();

    if (input === current.w) {
        score++;
        streak++;

        showToast('Correct 🔥');

        document.getElementById('ws-score').textContent = score;
        document.getElementById('ws-streak').textContent = streak;

        nextScramble();
    } else {
        streak = 0;
        showToast('Wrong ❌');
        document.getElementById('ws-streak').textContent = 0;
    }
}

nextScramble();
