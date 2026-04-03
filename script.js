// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, color) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.borderColor = color;
    toast.style.color = color;
    toast.classList.add('show');

    setTimeout(function() {
        toast.classList.remove('show');
    }, 2000);
}


// ============================================
// GAME 1 - EMOJI QUIZ
// ============================================

var quizData = [
    { q: '🍕 + 🍕 = ?',       opts: ['🍕🍕', '🍔', '🍕x2', '2 Pizza'],          ans: 0 },
    { q: '🐶 says what?',      opts: ['Meow', 'Woof', 'Moo', 'Oink'],             ans: 1 },
    { q: 'Capital of 🇮🇳?',   opts: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'], ans: 2 },
    { q: '2 + 2 = ?',          opts: ['3', '5', '4', '22'],                        ans: 2 },
    { q: '🌙 comes after?',    opts: ['Dawn', 'Noon', 'Evening', 'Sunset'],        ans: 2 },
    { q: '🍌 is a?',           opts: ['Vegetable', 'Fruit', 'Grain', 'Nut'],       ans: 1 },
    { q: 'Fastest animal 🏃?', opts: ['Lion', 'Eagle', 'Cheetah', 'Horse'],        ans: 2 },
    { q: '🔴 + 🔵 = ?',       opts: ['Green', 'Purple', 'Orange', 'Pink'],        ans: 1 },
];

var qIdx       = 0;
var quizScore  = 0;
var quizActive = false;

function startQuiz() {
    qIdx       = 0;
    quizScore  = 0;
    quizActive = true;
    document.getElementById('quiz-result').textContent = '';
    showQuizQuestion();
}

function showQuizQuestion() {
    if (qIdx >= quizData.length) {
        document.getElementById('quiz-q').textContent    = quizScore >= 6 ? '🎉 Shandaar!' : '😊 Done!';
        document.getElementById('quiz-opts').innerHTML   = '';
        document.getElementById('quiz-result').textContent = quizScore + '/' + quizData.length + ' sahi!';
        document.getElementById('quiz-score').textContent  = quizScore + '/' + quizData.length;
        quizActive = false;
        return;
    }

    var current = quizData[qIdx];
    document.getElementById('quiz-q').textContent    = current.q;
    document.getElementById('quiz-score').textContent = qIdx + '/' + quizData.length;

    var optsDiv = document.getElementById('quiz-opts');
    optsDiv.innerHTML = '';

    for (var i = 0; i < current.opts.length; i++) {
        var btn = document.createElement('button');
        btn.className   = 'quiz-opt';
        btn.textContent = current.opts[i];
        btn.setAttribute('data-index', i);
        btn.onclick = function() {
            answerQuiz(parseInt(this.getAttribute('data-index')), this);
        };
        optsDiv.appendChild(btn);
    }
}

function answerQuiz(selectedIndex, clickedBtn) {
    if (!quizActive) return;

    var current  = quizData[qIdx];
    var allBtns  = document.querySelectorAll('.quiz-opt');

    allBtns.forEach(function(b) {
        b.onclick = null;
    });

    if (selectedIndex === current.ans) {
        clickedBtn.classList.add('correct');
        quizScore++;
        showToast('✅ Sahi hai!', 'var(--accent3)');
    } else {
        clickedBtn.classList.add('wrong');
        allBtns[current.ans].classList.add('correct');
        showToast('❌ Galat!', 'var(--accent1)');
    }

    setTimeout(function() {
        qIdx++;
        showQuizQuestion();
    }, 900);
}

startQuiz();


// ============================================
// GAME 2 - MEMORY MATCH
// ============================================

var emojis       = ['🐶', '🐱', '🦊', '🐸', '🦁', '🐧', '🦋', '🌸'];
var memCards     = [];
var flipped      = [];
var matchedCount = 0;
var movesCount   = 0;
var canFlip      = true;

function initMemory() {
    var allEmojis = emojis.concat(emojis);

    // Shuffle karo
    allEmojis.sort(function() {
        return Math.random() - 0.5;
    });

    flipped      = [];
    matchedCount = 0;
    movesCount   = 0;
    canFlip      = true;

    document.getElementById('moves').textContent   = 0;
    document.getElementById('matched').textContent = 0;

    var grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    memCards = [];

    for (var i = 0; i < allEmojis.length; i++) {
        var card = document.createElement('div');
        card.className        = 'mem-card';
        card.dataset.emoji    = allEmojis[i];
        card.innerHTML        = '<span class="back">❓</span><span class="front">' + allEmojis[i] + '</span>';
        card.onclick          = (function(c) {
            return function() { flipCard(c); };
        })(card);
        grid.appendChild(card);
        memCards.push(card);
    }
}

function flipCard(card) {
    if (!canFlip) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flipped.push(card);

    if (flipped.length === 2) {
        canFlip = false;
        movesCount++;
        document.getElementById('moves').textContent = movesCount;

        if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
            // Match mila!
            flipped[0].classList.add('matched');
            flipped[1].classList.add('matched');
            matchedCount++;
            document.getElementById('matched').textContent = matchedCount;
            flipped  = [];
            canFlip  = true;

            if (matchedCount === 8) {
                showToast('🎉 ' + movesCount + ' moves mein complete!', 'var(--accent2)');
            }
        } else {
            // Match nahi mila — wapas palto
            setTimeout(function() {
                flipped[0].classList.remove('flipped');
                flipped[1].classList.remove('flipped');
                flipped = [];
                canFlip = true;
            }, 800);
        }
    }
}

initMemory();


// ============================================
// GAME 3 - REACTION TEST
// ============================================

var reactionState  = 'idle';
var reactionTimer  = null;
var reactionStart  = 0;
var reactionTimes  = [];

function startReaction() {
    reactionState = 'waiting';
    reactionTimes = [];

    document.getElementById('reaction-results').innerHTML = '';
    document.getElementById('reaction-avg').textContent   = '';

    var box = document.getElementById('reaction-box');
    box.className   = 'reaction-area waiting';
    box.textContent = '🟡 Ruko... green hone ka wait karo';

    clearTimeout(reactionTimer);

    var delay = 1500 + Math.random() * 3000;

    reactionTimer = setTimeout(function() {
        box.className   = 'reaction-area ready';
        box.textContent = '🟢 ABHI CLICK KARO!';
        reactionStart   = Date.now();
        reactionState   = 'ready';
    }, delay);
}

function reactionClick() {
    var box = document.getElementById('reaction-box');

    if (reactionState === 'waiting') {
        clearTimeout(reactionTimer);
        box.className   = 'reaction-area too-early';
        box.textContent = '❌ Bahut jaldi! Dobara try karo...';
        reactionState   = 'idle';
        showToast('Bahut jaldi! ⚡', 'var(--accent1)');
        return;
    }

    if (reactionState === 'ready') {
        var ms = Date.now() - reactionStart;
        reactionTimes.push(ms);
        reactionState = 'idle';

        box.className   = 'reaction-area waiting';

        // Result chip banao
        var chip = document.createElement('div');
        chip.className   = 'reaction-chip';
        chip.textContent = ms + 'ms';
        document.getElementById('reaction-results').appendChild(chip);

        // Average calculate karo
        if (reactionTimes.length >= 3) {
            var total = 0;
            for (var i = 0; i < reactionTimes.length; i++) {
                total += reactionTimes[i];
            }
            var avg = Math.round(total / reactionTimes.length);
            document.getElementById('reaction-avg').textContent = 'Avg: ' + avg + 'ms';
        }

        var emoji = ms < 200 ? '🚀 Ultra Fast!' : ms < 300 ? '⚡ Fast!' : ms < 450 ? '👍 OK' : '🐢 Slow';
        showToast(ms + 'ms — ' + emoji, 'var(--accent4)');

        if (reactionTimes.length < 5) {
            box.textContent = ms + 'ms! Aur ek baar? Click "Start"';
        } else {
            var total2 = 0;
            for (var j = 0; j < reactionTimes.length; j++) {
                total2 += reactionTimes[j];
            }
            var avg2 = Math.round(total2 / reactionTimes.length);
            box.textContent = 'Done! Avg: ' + avg2 + 'ms';
        }
    }
}


// ============================================
// GAME 4 - NUMBER GUESS
// ============================================

var secretNum    = 0;
var guessAttempts = 0;
var guessActive  = false;

function startGuess() {
    secretNum     = Math.floor(Math.random() * 100) + 1;
    guessAttempts = 0;
    guessActive   = true;

    document.getElementById('guess-display').textContent  = '?';
    document.getElementById('guess-hint').textContent     = '1 se 100 ke beech guess karo!';
    document.getElementById('guess-attempts').textContent = 'Attempts: 0/7';
    document.getElementById('guess-fill').style.width     = '50%';

    var input = document.getElementById('guess-input');
    input.value    = '';
    input.disabled = false;
    input.focus();
}

function checkGuess() {
    if (!guessActive) {
        startGuess();
        return;
    }

    var input = document.getElementById('guess-input');
    var val   = parseInt(input.value);

    if (!val || val < 1 || val > 100) {
        showToast('1-100 ke beech likho!', 'var(--accent1)');
        return;
    }

    guessAttempts++;
    document.getElementById('guess-attempts').textContent = 'Attempts: ' + guessAttempts + '/7';
    input.value = '';

    var pct = (val / 100) * 100;
    document.getElementById('guess-fill').style.width = pct + '%';

    if (val === secretNum) {
        document.getElementById('guess-display').textContent = '🎉';
        document.getElementById('guess-hint').textContent    = 'Sahi! ' + guessAttempts + ' attempts mein mila!';
        showToast('🎉 ' + guessAttempts + ' moves mein milgaya!', 'var(--accent3)');
        guessActive    = false;
        input.disabled = true;

    } else if (guessAttempts >= 7) {
        document.getElementById('guess-display').textContent = secretNum;
        document.getElementById('guess-hint').textContent    = 'Oof! Number tha ' + secretNum + '. Dobara try karo!';
        showToast('💀 Game Over! New Game dabao', 'var(--accent1)');
        guessActive    = false;
        input.disabled = true;

    } else if (val < secretNum) {
        document.getElementById('guess-display').textContent = val + ' 📈';
        document.getElementById('guess-hint').textContent    = val + ' se zyada hai! ' + (7 - guessAttempts) + ' chances baaki';

    } else {
        document.getElementById('guess-display').textContent = val + ' 📉';
        document.getElementById('guess-hint').textContent    = val + ' se kam hai! ' + (7 - guessAttempts) + ' chances baaki';
    }
}

startGuess();


// ============================================
// GAME 5 - WORD SCRAMBLE
// ============================================

var wordList = [
    { word: 'MANGO', hint: '🥭 Ek fruit'         },
    { word: 'TIGER', hint: '🐯 Jungle ka raja'    },
    { word: 'CLOUD', hint: '☁️ Sky mein'          },
    { word: 'CHAIR', hint: '🪑 Baithne ke liye'   },
    { word: 'MUSIC', hint: '🎵 Sunne ke liye'     },
    { word: 'PLANT', hint: '🌿 Garden mein'       },
    { word: 'BREAD', hint: '🍞 Khane ki cheez'    },
    { word: 'RIVER', hint: '🏞️ Pani bahta hai'    },
    { word: 'CLOCK', hint: '🕐 Time batata hai'   },
    { word: 'FLAME', hint: '🔥 Jalti cheez'       },
];

var usedIndexes  = [];
var wsScore      = 0;
var wsStreak     = 0;
var currentWord  = null;

function scrambleWord(word) {
    var arr = word.split('');
    do {
        arr.sort(function() { return Math.random() - 0.5; });
    } while (arr.join('') === word);
    return arr.join('');
}

function nextScramble() {
    if (usedIndexes.length === wordList.length) {
        usedIndexes = [];
    }

    var pool = [];
    for (var i = 0; i < wordList.length; i++) {
        if (usedIndexes.indexOf(i) === -1) {
            pool.push(i);
        }
    }

    var randomIndex = pool[Math.floor(Math.random() * pool.length)];
    usedIndexes.push(randomIndex);
    currentWord = wordList[randomIndex];

    document.getElementById('scramble-word').textContent = scrambleWord(currentWord.word);
    document.getElementById('scramble-hint').textContent = 'Hint: ' + currentWord.hint;

    var input = document.getElementById('scramble-input');
    input.value = '';
    input.classList.remove('correct-anim', 'wrong-anim');
}

function checkScramble() {
    var input = document.getElementById('scramble-input');
    var val   = input.value.trim().toUpperCase();

    if (!val) return;

    if (val === currentWord.word) {
        wsScore++;
        wsStreak++;
        document.getElementById('ws-score').textContent  = wsScore;
        document.getElementById('ws-streak').textContent = wsStreak;
        input.classList.add('correct-anim');
        showToast('✅ Sahi! 🔥 Streak: ' + wsStreak, 'var(--accent3)');

        setTimeout(function() {
            nextScramble();
        }, 600);

    } else {
        wsStreak = 0;
        document.getElementById('ws-streak').textContent = 0;
        input.classList.add('wrong-anim');
        showToast('❌ Galat! Try again', 'var(--accent1)');

        setTimeout(function() {
            input.classList.remove('wrong-anim');
            input.value = '';
        }, 500);
    }
}

nextScramble();