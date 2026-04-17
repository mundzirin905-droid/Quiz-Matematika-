// script.js - Logika Quiz Matematika Anak SD dengan Level dan Stimulus Literasi

const levelConfig = {
    Mudah: {
        label: 'Level Mudah',
        multiplier: { min: 1, max: 6 },
        divisor: { min: 1, max: 6 },
        story: {
            multiply: [
                'Rina memiliki {a} kotak kue, setiap kotak berisi {b} kue. Berapa total kue yang dimiliki Rina?',
                'Pak Budi menata {a} baris pensil, setiap baris terdiri dari {b} pensil. Berapa pensil semuanya?',
                'Sebuah rak memiliki {a} kotak mainan, di dalam setiap kotak ada {b} bola. Berapa bola total pada rak tersebut?'
            ],
            divide: [
                'Tono memiliki {a} buah apel dan membaginya ke dalam {b} piring sama rata. Berapa apel di setiap piring?',
                'maya membuat {a} kue dan ingin membagi ke {b} teman sama banyak. Berapa kue untuk setiap teman?',
                'Ibu membeli {a} permen dan memasukkannya ke dalam {b} kantong dengan jumlah sama. Berapa permen di setiap kantong?'
            ]
        }
    },
    Sedang: {
        label: 'Level Sedang',
        multiplier: { min: 3, max: 10 },
        divisor: { min: 2, max: 10 },
        story: {
            multiply: [
                'Sebuah kelas memiliki {a} meja, setiap meja diisi {b} murid. Berapa murid total di kelas?',
                'Ada {a} keranjang jeruk, tiap keranjang berisi {b} jeruk. Berapa jeruk semuanya?',
                'Riza menanam {a} baris bunga, setiap baris ada {b} bunga. Berapa jumlah bunga yang tumbuh?'
            ],
            divide: [
                'Bapak membawa {a} botol minum dan ingin membagikannya ke {b} anak dengan jumlah sama. Berapa botol untuk setiap anak?',
                'Dek usahakan menyusun {a} kertas dalam {b} tumpukan sama tinggi sehingga ada berapa kertas di tiap tumpukan?',
                'Ani punya {a} buah jeruk dan membaginya pada {b} teman. Berapa jeruk untuk setiap teman?'
            ]
        }
    },
    Sulit: {
        label: 'Level Sulit',
        multiplier: { min: 5, max: 15 },
        divisor: { min: 3, max: 12 },
        story: {
            multiply: [
                'Sebuah perpustakaan menata {a} rak buku, setiap rak berisi {b} buku. Berapa buku yang dipajang?',
                'Rian mengumpulkan {a} kotak pensil, setiap kotak berisi {b} pensil. Berapa pensil total yang dikumpulkan?',
                'Taman bermain memiliki {a} baris ayunan, tiap baris {b} ayunan. Berapa ayunan di seluruh taman?'
            ],
            divide: [
                'Sebuah kelas akan membagi {a} kelereng ke {b} kelompok dengan jumlah sama. Berapa kelereng setiap kelompok?',
                'Toko buah menjual {a} buah persik dalam {b} kotak yang sama banyak. Berapa buah persik setiap kotak?',
                'Kakak memiliki {a} permen untuk dibagi ke {b} saudara. Berapa permen untuk setiap saudara?'
            ]
        }
    }
};

const questionCount = 10;
let currentLevel = null;
let questions = [];
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let currentAnswer = null;

const selectedLevelEl = document.getElementById('selectedLevel');
const scoreEl = document.getElementById('score');
const questionCountEl = document.getElementById('questionCount');
const correctCountEl = document.getElementById('correctCount');
const progressTextEl = document.getElementById('progressText');
const questionTextEl = document.getElementById('questionText');
const feedbackTextEl = document.getElementById('feedbackText');
const gamePanel = document.getElementById('gamePanel');
const completedPanel = document.getElementById('completedPanel');
const levelSelection = document.getElementById('levelSelection');
const choiceButtons = [
    document.getElementById('choice0'),
    document.getElementById('choice1'),
    document.getElementById('choice2'),
    document.getElementById('choice3')
];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function formatStory(template, a, b) {
    return template.replace('{a}', a).replace('{b}', b);
}

function createQuestion(text, answer) {
    const choices = new Set([answer]);
    while (choices.size < 4) {
        const variation = randomInt(1, Math.max(3, Math.floor(answer * 0.3) + 1));
        const wrong = [answer + variation, answer - variation, answer + variation + 2][randomInt(0, 2)];
        if (wrong >= 0) {
            choices.add(wrong);
        }
    }
    return {
        text,
        answer,
        choices: shuffle(Array.from(choices))
    };
}

function generateQuestions(levelKey) {
    const config = levelConfig[levelKey];
    const list = [];
    const multiplyTemplates = config.story.multiply;
    const divideTemplates = config.story.divide;

    for (let i = 0; i < questionCount / 2; i += 1) {
        const a = randomInt(config.multiplier.min, config.multiplier.max);
        const b = randomInt(config.multiplier.min, config.multiplier.max);
        const template = multiplyTemplates[randomInt(0, multiplyTemplates.length - 1)];
        list.push(createQuestion(formatStory(template, a, b), a * b));
    }

    for (let i = 0; i < questionCount / 2; i += 1) {
        const divisor = randomInt(config.divisor.min, config.divisor.max);
        const quotient = randomInt(config.divisor.min, config.divisor.max);
        const dividend = divisor * quotient;
        const template = divideTemplates[randomInt(0, divideTemplates.length - 1)];
        list.push(createQuestion(formatStory(template, dividend, divisor), quotient));
    }

    return shuffle(list);
}

function selectLevel(levelKey) {
    currentLevel = levelKey;
    questions = generateQuestions(levelKey);
    currentIndex = 0;
    score = 0;
    correctCount = 0;
    currentAnswer = null;

    selectedLevelEl.textContent = levelConfig[levelKey].label;
    levelSelection.style.display = 'none';
    gamePanel.classList.add('active');
    completedPanel.classList.remove('active');
    updateStats();
    showQuestion();
    feedbackTextEl.textContent = 'Mulai jawab soal dengan cerita di atas. Pilih jawaban yang tepat!';
    feedbackTextEl.style.color = '#2d4a6b';
}

function updateStats() {
    scoreEl.textContent = score;
    correctCountEl.textContent = correctCount;
    questionCountEl.textContent = `${Math.min(currentIndex + 1, questions.length)} / ${questions.length}`;
}

function showQuestion() {
    const current = questions[currentIndex];
    progressTextEl.textContent = `Soal ${currentIndex + 1} dari ${questions.length}`;
    questionTextEl.textContent = current.text;
    current.choices.forEach((choice, index) => {
        choiceButtons[index].textContent = choice;
        choiceButtons[index].disabled = false;
    });
    currentAnswer = current.answer;
}

function chooseAnswer(index) {
    if (currentAnswer === null) {
        return;
    }
    const selected = Number(choiceButtons[index].textContent);
    const isCorrect = selected === currentAnswer;

    if (isCorrect) {
        score += 10;
        correctCount += 1;
        feedbackTextEl.textContent = 'Jawaban benar! Bagus sekali, lanjut ke soal berikutnya.';
        feedbackTextEl.style.color = '#0f7a3f';
    } else {
        feedbackTextEl.textContent = `Sayang sekali, jawaban yang benar adalah ${currentAnswer}. Yuk coba soal berikutnya.`;
        feedbackTextEl.style.color = '#be2d2d';
    }

    currentIndex += 1;
    if (currentIndex >= questions.length) {
        finishGame();
        return;
    }
    updateStats();
    showQuestion();
}

function finishGame() {
    gamePanel.classList.remove('active');
    completedPanel.classList.add('active');
    const percent = Math.round((correctCount / questions.length) * 100);
    document.getElementById('finalMessage').textContent = `Kamu telah menyelesaikan ${levelConfig[currentLevel].label} dengan skor ${score} dan ${correctCount} jawaban benar dari ${questions.length}. Nilai akhir ${percent}%!`;
}

function resetGame(showLevel = false) {
    if (showLevel) {
        levelSelection.style.display = 'grid';
        gamePanel.classList.remove('active');
        completedPanel.classList.remove('active');
    }
    currentLevel = null;
    questions = [];
    currentIndex = 0;
    score = 0;
    correctCount = 0;
    currentAnswer = null;
    selectedLevelEl.textContent = '-';
    progressTextEl.textContent = 'Pilih level untuk mulai kuis.';
    questionTextEl.textContent = 'Siap menjawab semua soal cerita matematika?';
    feedbackTextEl.textContent = 'Semua soal dilengkapi cerita singkat supaya kamu belajar sambil berpikir.';
    feedbackTextEl.style.color = '#2d4a6b';
    scoreEl.textContent = '0';
    correctCountEl.textContent = '0';
    questionCountEl.textContent = `0 / ${questionCount}`;
    choiceButtons.forEach(btn => {
        btn.textContent = '-';
        btn.disabled = true;
    });
}

// Inisialisasi awal
resetGame(true);