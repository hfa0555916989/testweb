/**
 * مسابقة الثقافة الرياضية المدرسية
 * نظام المسابقات المتطور
 */

// ====== Group & Key Management ======
const GROUP = window.GAME_GROUP || 'a';
function KEY(k) { return GROUP === 'a' ? k : k + '_b'; }

// ====== Sound Effects using Web Audio API ======
class SoundEffects {
    constructor() {
        this.audioCtx = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch(e) {
            console.log('Web Audio API not supported');
        }
    }

    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    playCorrect() {
        this.init();
        this.playTone(523, 0.15, 'sine', 0.4);
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.4), 100);
        setTimeout(() => this.playTone(784, 0.3, 'sine', 0.4), 200);
    }

    playWrong() {
        this.init();
        this.playTone(200, 0.3, 'sawtooth', 0.2);
        setTimeout(() => this.playTone(180, 0.4, 'sawtooth', 0.2), 200);
    }

    playClick() {
        this.init();
        this.playTone(800, 0.08, 'sine', 0.2);
    }

    playTick() {
        this.init();
        this.playTone(1000, 0.03, 'sine', 0.1);
    }

    playTimerWarning() {
        this.init();
        this.playTone(600, 0.1, 'square', 0.15);
    }

    playTimeout() {
        this.init();
        this.playTone(300, 0.2, 'sawtooth', 0.2);
        setTimeout(() => this.playTone(250, 0.3, 'sawtooth', 0.2), 150);
        setTimeout(() => this.playTone(200, 0.5, 'sawtooth', 0.2), 300);
    }

    playCelebration() {
        this.init();
        const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
        notes.forEach((note, i) => {
            setTimeout(() => {
                this.playTone(note, 0.2, 'sine', 0.3);
                this.playTone(note * 1.5, 0.2, 'triangle', 0.15);
            }, i * 120);
        });
        // Second wave
        setTimeout(() => {
            notes.reverse().forEach((note, i) => {
                setTimeout(() => {
                    this.playTone(note, 0.25, 'sine', 0.25);
                }, i * 100);
            });
        }, 1200);
        // Fanfare
        setTimeout(() => {
            this.playTone(1047, 0.5, 'sine', 0.4);
            this.playTone(1319, 0.5, 'triangle', 0.2);
            this.playTone(1568, 0.5, 'sine', 0.2);
        }, 2500);
    }

    playNumberSelect() {
        this.init();
        this.playTone(400, 0.1, 'sine', 0.2);
        setTimeout(() => this.playTone(600, 0.1, 'sine', 0.2), 80);
        setTimeout(() => this.playTone(800, 0.15, 'sine', 0.2), 160);
    }

    // White noise buffer 2s with bandpass at 2000 Hz — simulates crowd applause
    playApplause() {
        this.init();
        if (!this.audioCtx) return;
        const sampleRate = this.audioCtx.sampleRate;
        const bufferSize = sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.5;

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 2);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        source.start();
        source.stop(this.audioCtx.currentTime + 2);
    }

    // Applause burst + celebratory melody + confetti
    playCelebrationFanfare() {
        this.init();
        this.playApplause();

        const fanfare = [523, 659, 784, 1047, 1319, 1047, 784, 1047];
        fanfare.forEach((note, i) => {
            setTimeout(() => {
                this.playTone(note, 0.3, 'sine', 0.4);
                this.playTone(note * 1.25, 0.2, 'triangle', 0.2);
            }, i * 180 + 300);
        });

        setTimeout(() => {
            this.playTone(1047, 0.6, 'sine', 0.45);
            this.playTone(1319, 0.6, 'triangle', 0.25);
            this.playTone(1568, 0.6, 'sine', 0.2);
        }, 2000);

        if (confetti) {
            confetti.start();
            setTimeout(() => { if (confetti) confetti.stop(); }, 6000);
        }
    }
}

// ====== Confetti System ======
class ConfettiSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        const colors = ['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4','#009688','#4caf50','#8bc34a','#cddc39','#ffeb3b','#ffc107','#ff9800','#ff5722','#d4af37'];
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.canvas.height,
            w: Math.random() * 12 + 5,
            h: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            speedX: (Math.random() - 0.5) * 6,
            speedY: Math.random() * 4 + 2,
            oscillation: Math.random() * Math.PI * 2,
            oscillationSpeed: Math.random() * 0.05 + 0.02
        };
    }

    start() {
        this.running = true;
        this.particles = [];
        for (let i = 0; i < 200; i++) {
            this.particles.push(this.createParticle());
        }
        this.animate();
    }

    stop() {
        this.running = false;
        setTimeout(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles = [];
        }, 100);
    }

    animate() {
        if (!this.running) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.oscillation) * 2;
            p.rotation += p.rotationSpeed;
            p.oscillation += p.oscillationSpeed;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            this.ctx.restore();

            if (p.y > this.canvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * this.canvas.width;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ====== Default Questions ======
const defaultQuestions = [
    { id: 1,  question: "ما هي المدة الزمنية لمباراة كرة القدم؟",                      answers: ["60 دقيقة", "90 دقيقة", "120 دقيقة", "45 دقيقة"],           correct: 1 },
    { id: 2,  question: "كم عدد لاعبي فريق كرة السلة على أرض الملعب؟",                  answers: ["6 لاعبين", "5 لاعبين", "7 لاعبين", "4 لاعبين"],            correct: 1 },
    { id: 3,  question: "في أي رياضة يُستخدم مصطلح 'الإرسال الساحق'؟",                  answers: ["كرة القدم", "كرة الطائرة", "كرة اليد", "التنس"],            correct: 1 },
    { id: 4,  question: "ما هو طول ملعب كرة القدم القانوني؟",                           answers: ["90 متر", "100-110 متر", "120 متر", "80 متر"],               correct: 1 },
    { id: 5,  question: "كم يبلغ ارتفاع شبكة كرة الطائرة للرجال؟",                      answers: ["2.24 متر", "2.43 متر", "2.50 متر", "2.30 متر"],            correct: 1 },
    { id: 6,  question: "ما هي الرياضة التي يُطلق عليها 'اللعبة الملكية'؟",              answers: ["كرة القدم", "الغولف", "الشطرنج", "البولو"],                 correct: 2 },
    { id: 7,  question: "كم عدد اللاعبين في فريق كرة الطائرة؟",                         answers: ["5 لاعبين", "7 لاعبين", "6 لاعبين", "8 لاعبين"],            correct: 2 },
    { id: 8,  question: "في أي دولة نشأت رياضة الجودو؟",                               answers: ["الصين", "كوريا", "اليابان", "تايلاند"],                     correct: 2 },
    { id: 9,  question: "ما هو عدد أشواط مباراة كرة السلة؟",                            answers: ["شوطين", "3 أشواط", "4 أشواط", "5 أشواط"],                  correct: 2 },
    { id: 10, question: "ما هي المسافة التي يقطعها عداء الماراثون؟",                     answers: ["40 كم", "42.195 كم", "45 كم", "38 كم"],                    correct: 1 },
    { id: 11, question: "كم تبلغ مدة الشوط الواحد في كرة اليد؟",                        answers: ["25 دقيقة", "30 دقيقة", "35 دقيقة", "20 دقيقة"],            correct: 1 },
    { id: 12, question: "ما هي الرياضة التي يُستخدم فيها مضرب الريشة؟",                 answers: ["التنس", "البادمنتون", "الاسكواش", "تنس الطاولة"],           correct: 1 },
    { id: 13, question: "كم عدد اللاعبين في فريق كرة الماء؟",                           answers: ["6 لاعبين", "7 لاعبين", "8 لاعبين", "5 لاعبين"],            correct: 1 },
    { id: 14, question: "ما هو الوزن القانوني لكرة القدم؟",                              answers: ["350-390 غرام", "410-450 غرام", "500-550 غرام", "300-340 غرام"], correct: 1 },
    { id: 15, question: "في أي عام أُقيمت أول دورة أولمبية حديثة؟",                     answers: ["1892", "1896", "1900", "1888"],                             correct: 1 },
    { id: 16, question: "ما هي أسرع رياضة كرة في العالم؟",                              answers: ["التنس", "الكريكيت", "البادمنتون", "الغولف"],                correct: 2 },
    { id: 17, question: "كم يبلغ عرض مرمى كرة القدم؟",                                 answers: ["7.32 متر", "8 متر", "6.5 متر", "7 متر"],                   correct: 0 },
    { id: 18, question: "ما هو عدد الحكام في مباراة كرة القدم؟",                         answers: ["3 حكام", "4 حكام", "5 حكام", "2 حكام"],                    correct: 1 },
    { id: 19, question: "ما اسم الرياضة التي تُمارس على الجليد بالمكنسة؟",               answers: ["هوكي الجليد", "التزلج", "الكيرلنغ", "البياثلون"],           correct: 2 },
    { id: 20, question: "كم عدد نقاط الفوز في مجموعة التنس (تاي بريك)؟",                answers: ["5 نقاط", "6 نقاط", "7 نقاط", "10 نقاط"],                   correct: 2 }
];

// ====== Game State ======
let gameState = {
    team1: { name: 'الفريق الأول', score: 0, logo: '' },
    team2: { name: 'الفريق الثاني', score: 0, logo: '' },
    questions: [],
    usedQuestions: [],
    currentQuestion: null,
    currentTeam: null,
    timerDuration: 30,
    timerRemaining: 30,
    timerInterval: null,
    totalQuestions: 20,
    answeredCount: 0
};

// ====== Golden Questions State ======
let goldenQuestions = [];
let currentGoldenQuestion = null;
let currentGoldenTeam = null;
let goldenTimerInterval = null;
let goldenTimerRemaining = 30;

// ====== Wheel State ======
let wheelAngle = 0;
let wheelSpinning = false;

let sounds = new SoundEffects();
let confetti = null;

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', () => {
    // Password gate
    if (sessionStorage.getItem('auth_sscf') !== '1') {
        const gate = document.getElementById('password-gate');
        if (gate) gate.style.display = 'flex';
        return;
    }
    initApp();
});

function initApp() {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) confetti = new ConfettiSystem(canvas);
    loadGameData();
    renderGrid();
    renderGoldenGrid();
    updateScoreboard();
    updateTurnIndicator();
    createParticles();
    document.addEventListener('click', () => sounds.init(), { once: true });
}

// ====== Password Gate ======
function checkGatePassword() {
    const input = document.getElementById('gate-password');
    if (!input) return;
    if (input.value === 'sscf1069') {
        sessionStorage.setItem('auth_sscf', '1');
        const gate = document.getElementById('password-gate');
        if (gate) gate.style.display = 'none';
        initApp();
    } else {
        input.value = '';
        input.classList.add('shake');
        input.placeholder = 'كلمة المرور غير صحيحة!';
        setTimeout(() => {
            input.classList.remove('shake');
            input.placeholder = 'أدخل كلمة المرور';
        }, 1000);
    }
}

function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 20 + 10;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.background = Math.random() > 0.5 ? 'var(--primary)' : 'var(--gold)';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(particle);
    }
}

// ====== Data Management ======
function loadGameData() {
    const savedTeams = localStorage.getItem(KEY('quiz_teams'));
    if (savedTeams) {
        const teams = JSON.parse(savedTeams);
        gameState.team1.name = teams.team1 || 'الفريق الأول';
        gameState.team2.name = teams.team2 || 'الفريق الثاني';
    }

    const savedLogos = localStorage.getItem(KEY('quiz_logos'));
    if (savedLogos) {
        const logos = JSON.parse(savedLogos);
        gameState.team1.logo = logos.team1 || '';
        gameState.team2.logo = logos.team2 || '';
    }

    const savedQuestions = localStorage.getItem(KEY('quiz_questions'));
    if (savedQuestions) {
        gameState.questions = JSON.parse(savedQuestions);
    } else {
        gameState.questions = [...defaultQuestions];
    }

    gameState.totalQuestions = gameState.questions.length;

    const savedTimer = localStorage.getItem(KEY('quiz_timer'));
    if (savedTimer) {
        gameState.timerDuration = parseInt(savedTimer);
    }

    const savedProgress = localStorage.getItem(KEY('quiz_progress'));
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        gameState.team1.score = progress.team1Score || 0;
        gameState.team2.score = progress.team2Score || 0;
        gameState.usedQuestions = progress.usedQuestions || [];
        gameState.answeredCount = progress.answeredCount || 0;
    }

    // Load golden questions (max 4)
    const savedGolden = localStorage.getItem(KEY('quiz_golden'));
    if (savedGolden) {
        const parsed = JSON.parse(savedGolden);
        goldenQuestions = Array.isArray(parsed) ? parsed.slice(0, 4) : [];
    } else {
        goldenQuestions = [];
    }
}

function saveProgress() {
    localStorage.setItem(KEY('quiz_progress'), JSON.stringify({
        team1Score: gameState.team1.score,
        team2Score: gameState.team2.score,
        usedQuestions: gameState.usedQuestions,
        answeredCount: gameState.answeredCount
    }));
}

// ====== Render Grid ======
function renderGrid() {
    const grid = document.getElementById('numbers-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 1; i <= gameState.totalQuestions; i++) {
        const cell = document.createElement('div');
        cell.className = 'number-cell';
        cell.setAttribute('data-number', i);
        cell.textContent = i;

        if (gameState.usedQuestions.includes(i)) {
            cell.classList.add('used');
        } else {
            cell.addEventListener('click', () => selectNumber(i));
        }

        grid.appendChild(cell);
    }
}

// ====== Golden Questions Grid ======
function renderGoldenGrid() {
    const section = document.getElementById('golden-section');
    const grid = document.getElementById('golden-grid');
    if (!grid) return;

    if (!goldenQuestions || goldenQuestions.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (section) section.style.display = '';
    grid.innerHTML = '';

    goldenQuestions.forEach(q => {
        const cell = document.createElement('div');
        cell.className = 'number-cell golden-cell';
        cell.setAttribute('data-golden-id', q.id);
        cell.textContent = q.id.replace('g', '★');
        cell.addEventListener('click', () => selectGoldenQuestion(q.id));
        grid.appendChild(cell);
    });
}

function selectGoldenQuestion(id) {
    const q = goldenQuestions.find(gq => gq.id === id);
    if (!q) return;

    sounds.playNumberSelect();
    currentGoldenQuestion = q;

    // Reuse team-select modal — we store the pending type so we know
    // to open the golden modal after team selection
    gameState._pendingGolden = true;
    showTeamSelectModal();
}

// Called when team is selected; routes to golden or regular question
function selectAnsweringTeam(teamNum) {
    gameState.currentTeam = teamNum;
    hideTeamSelectModal();

    document.getElementById('team1-board').classList.toggle('active-team', teamNum === 1);
    document.getElementById('team2-board').classList.toggle('active-team', teamNum === 2);

    if (gameState._pendingGolden) {
        gameState._pendingGolden = false;
        currentGoldenTeam = teamNum;
        setTimeout(() => showGoldenQuestion(), 300);
    } else {
        setTimeout(() => showQuestion(), 300);
    }
}

function showGoldenQuestion() {
    const q = currentGoldenQuestion;
    if (!q) return;

    const modal = document.getElementById('golden-question-modal');
    if (!modal) return;

    const textEl = modal.querySelector('#golden-question-text') || modal.querySelector('.question-text');
    if (textEl) textEl.textContent = q.question;

    const badgeEl = modal.querySelector('#golden-question-badge') || modal.querySelector('.question-badge');
    if (badgeEl) badgeEl.textContent = `سؤال ذهبي ${q.id.replace('g', '')}`;

    const resultEl = modal.querySelector('#golden-result') || modal.querySelector('.question-result');
    if (resultEl) { resultEl.className = 'question-result'; resultEl.style.display = 'none'; }

    modal.classList.add('active');
    startGoldenTimer();
}

function judgeGolden(isCorrect) {
    stopGoldenTimer();

    const modal = document.getElementById('golden-question-modal');
    const resultEl = modal ? (modal.querySelector('#golden-result') || modal.querySelector('.question-result')) : null;

    if (isCorrect) {
        sounds.playCorrect();
        sounds.playApplause();
        if (currentGoldenTeam === 1) gameState.team1.score++;
        else gameState.team2.score++;
        animateScore(currentGoldenTeam);
        updateScoreboard();

        if (resultEl) {
            resultEl.className = 'question-result show correct';
            resultEl.style.display = '';
            const teamName = currentGoldenTeam === 1 ? gameState.team1.name : gameState.team2.name;
            resultEl.innerHTML = `<div class="result-icon">✅</div><div class="result-text">إجابة صحيحة! +1 نقطة لـ ${teamName}</div>`;
        }
    } else {
        sounds.playWrong();
        if (resultEl) {
            resultEl.className = 'question-result show wrong';
            resultEl.style.display = '';
            resultEl.innerHTML = `<div class="result-icon">❌</div><div class="result-text">إجابة خاطئة!</div>`;
        }
    }

    // Remove the golden question cell
    if (currentGoldenQuestion) {
        const cell = document.querySelector(`.golden-cell[data-golden-id="${currentGoldenQuestion.id}"]`);
        if (cell) {
            cell.classList.add('disappearing');
            setTimeout(() => cell.classList.add('used'), 800);
        }
        goldenQuestions = goldenQuestions.filter(gq => gq.id !== currentGoldenQuestion.id);
    }

    document.getElementById('team1-board').classList.remove('active-team');
    document.getElementById('team2-board').classList.remove('active-team');

    setTimeout(() => {
        if (modal) modal.classList.remove('active');
        currentGoldenQuestion = null;
        currentGoldenTeam = null;
        saveProgress();
    }, 3000);
}

// ====== Golden Timer ======
function startGoldenTimer() {
    goldenTimerRemaining = gameState.timerDuration;
    updateGoldenTimerDisplay();

    goldenTimerInterval = setInterval(() => {
        goldenTimerRemaining--;
        updateGoldenTimerDisplay();

        if (goldenTimerRemaining <= 5 && goldenTimerRemaining > 0) {
            sounds.playTimerWarning();
        }

        if (goldenTimerRemaining <= 0) {
            clearInterval(goldenTimerInterval);
            goldenTimerInterval = null;
            sounds.playTimeout();
            handleGoldenTimeout();
        }
    }, 1000);
}

function stopGoldenTimer() {
    if (goldenTimerInterval) {
        clearInterval(goldenTimerInterval);
        goldenTimerInterval = null;
    }
}

function updateGoldenTimerDisplay() {
    const textEl = document.getElementById('golden-timer-text');
    const progressEl = document.getElementById('golden-timer-progress');

    if (textEl) textEl.textContent = goldenTimerRemaining;

    if (progressEl) {
        const pct = (goldenTimerRemaining / gameState.timerDuration) * 100;
        // Support both SVG strokeDashoffset and HTML width bar
        if (progressEl.tagName === 'circle' || progressEl.tagName === 'CIRCLE') {
            const circumference = 2 * Math.PI * 54;
            progressEl.style.strokeDashoffset = ((1 - pct / 100) * circumference).toString();
        } else {
            progressEl.style.width = pct + '%';
        }
        progressEl.classList.toggle('warning', goldenTimerRemaining <= 10 && goldenTimerRemaining > 5);
        progressEl.classList.toggle('danger', goldenTimerRemaining <= 5);
    }
}

function handleGoldenTimeout() {
    const modal = document.getElementById('golden-question-modal');
    const resultEl = modal ? (modal.querySelector('#golden-result') || modal.querySelector('.question-result')) : null;

    if (resultEl) {
        resultEl.className = 'question-result show timeout';
        resultEl.style.display = '';
        resultEl.innerHTML = `<div class="result-icon">⏰</div><div class="result-text">انتهى الوقت!</div>`;
    }

    document.getElementById('team1-board').classList.remove('active-team');
    document.getElementById('team2-board').classList.remove('active-team');

    if (currentGoldenQuestion) {
        const cell = document.querySelector(`.golden-cell[data-golden-id="${currentGoldenQuestion.id}"]`);
        if (cell) {
            cell.classList.add('disappearing');
            setTimeout(() => cell.classList.add('used'), 800);
        }
        goldenQuestions = goldenQuestions.filter(gq => gq.id !== currentGoldenQuestion.id);
    }

    setTimeout(() => {
        if (modal) modal.classList.remove('active');
        currentGoldenQuestion = null;
        currentGoldenTeam = null;
    }, 3000);
}

// ====== Spinning Wheel ======
function drawWheel(angle) {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) - 15;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer shadow ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fill();

    // Team 1 — upper half at angle=0, blue #1565c0
    // Arc from (angle + π) to (angle + 2π) sweeps through the top of the wheel
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle + Math.PI, angle + 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#1565c0';
    ctx.fill();

    // Team 2 — lower half at angle=0, red #c62828
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#c62828';
    ctx.fill();

    // Gold border ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Dividing line between halves
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.lineTo(cx - radius * Math.cos(angle), cy - radius * Math.sin(angle));
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Center hub
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Team name labels
    ctx.save();
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;

    const labelR = radius * 0.58;
    // Team 1 center = angle + π + π/2 = angle + 3π/2
    const t1Angle = angle + 3 * Math.PI / 2;
    ctx.fillText(gameState.team1.name, cx + labelR * Math.cos(t1Angle), cy + labelR * Math.sin(t1Angle));

    // Team 2 center = angle + π/2
    const t2Angle = angle + Math.PI / 2;
    ctx.fillText(gameState.team2.name, cx + labelR * Math.cos(t2Angle), cy + labelR * Math.sin(t2Angle));
    ctx.restore();

    // Gold indicator triangle pointing down from above the wheel
    const tipY = cy - radius - 4;
    ctx.beginPath();
    ctx.moveTo(cx, tipY);
    ctx.lineTo(cx - 12, tipY - 18);
    ctx.lineTo(cx + 12, tipY - 18);
    ctx.closePath();
    ctx.fillStyle = '#d4af37';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function spinWheel() {
    if (wheelSpinning) return;
    wheelSpinning = true;

    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) spinBtn.disabled = true;

    const startAngle = wheelAngle;
    // 8–12 full rotations plus a random offset
    const totalRotation = (8 + Math.random() * 4) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const targetAngle = startAngle + totalRotation;
    const duration = 3000;
    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        wheelAngle = startAngle + totalRotation * eased;
        drawWheel(wheelAngle);

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            wheelAngle = targetAngle;
            wheelSpinning = false;
            if (spinBtn) spinBtn.disabled = false;

            // The indicator is at the canvas top (direction 3π/2 from center).
            // Normalize to wheel-local frame: 3π/2 - wheelAngle (mod 2π).
            // Team 1 occupies [π, 2π) in wheel-local frame.
            const localTop = ((3 * Math.PI / 2 - wheelAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
            const winner = localTop >= Math.PI ? 1 : 2;
            showSpinResult(winner);
        }
    }

    requestAnimationFrame(animate);
}

function showSpinWheelModal() {
    const modal = document.getElementById('spin-wheel-modal');
    if (!modal) return;

    // Hide any previous result
    const resultEl = document.getElementById('spin-result');
    if (resultEl) resultEl.style.display = 'none';

    modal.classList.add('active');

    // Draw initial wheel after the canvas is visible
    setTimeout(() => drawWheel(wheelAngle), 50);
}

function closeSpinModal() {
    const modal = document.getElementById('spin-wheel-modal');
    if (modal) modal.classList.remove('active');
}

function showSpinResult(teamNum) {
    const resultEl = document.getElementById('spin-result');
    if (!resultEl) return;

    const teamName = teamNum === 1 ? gameState.team1.name : gameState.team2.name;
    resultEl.innerHTML = `<div class="result-icon">🎉</div><div class="result-text">الفريق المختار: <strong>${teamName}</strong></div>`;
    resultEl.style.display = '';
    resultEl.className = 'question-result show correct';

    sounds.playApplause();
}

// ====== Update UI ======
function updateScoreboard() {
    document.getElementById('team1-name').textContent = gameState.team1.name;
    document.getElementById('team2-name').textContent = gameState.team2.name;
    document.getElementById('team1-score').textContent = gameState.team1.score;
    document.getElementById('team2-score').textContent = gameState.team2.score;

    const selName1 = document.getElementById('team-select-name1');
    const selName2 = document.getElementById('team-select-name2');
    if (selName1) selName1.textContent = gameState.team1.name;
    if (selName2) selName2.textContent = gameState.team2.name;

    updateTeamLogos();
}

function updateTeamLogos() {
    setLogoDisplay('team1-logo', 'team1-logo-fallback', gameState.team1.logo);
    setLogoDisplay('team2-logo', 'team2-logo-fallback', gameState.team2.logo);
    setLogoDisplay('team-select-logo-img1', 'team-select-fallback1', gameState.team1.logo);
    setLogoDisplay('team-select-logo-img2', 'team-select-fallback2', gameState.team2.logo);
}

function setLogoDisplay(imgId, fallbackId, logoSrc) {
    const img = document.getElementById(imgId);
    const fallback = document.getElementById(fallbackId);
    if (!img || !fallback) return;

    if (logoSrc) {
        img.src = logoSrc;
        img.style.display = 'block';
        fallback.style.display = 'none';
    } else {
        img.style.display = 'none';
        fallback.style.display = 'flex';
    }
}

function updateTurnIndicator() {
    const text = document.getElementById('turn-text');
    if (text) text.textContent = `اختر رقماً للسؤال التالي`;
}

function animateScore(teamNum) {
    const scoreEl = document.getElementById(`team${teamNum}-score`);
    if (!scoreEl) return;
    scoreEl.classList.add('animate');
    setTimeout(() => scoreEl.classList.remove('animate'), 600);
}

// ====== Number Selection ======
function selectNumber(num) {
    if (gameState.usedQuestions.includes(num)) return;

    sounds.playNumberSelect();
    gameState.currentQuestion = gameState.questions.find(q => q.id === num);

    if (!gameState.currentQuestion) {
        alert('لم يتم العثور على سؤال لهذا الرقم!');
        return;
    }

    gameState._pendingGolden = false;
    showTeamSelectModal();
}

// ====== Team Selection ======
function showTeamSelectModal() {
    const modal = document.getElementById('team-select-modal');
    if (modal) modal.classList.add('active');
}

function hideTeamSelectModal() {
    const modal = document.getElementById('team-select-modal');
    if (modal) modal.classList.remove('active');
}

// ====== Question Display ======
function showQuestion() {
    const q = gameState.currentQuestion;
    if (!q) return;

    const modal = document.getElementById('question-modal');
    const questionText = document.getElementById('question-text');
    const badge = document.getElementById('question-number-badge');
    const answersContainer = document.getElementById('answers-container');
    const resultDiv = document.getElementById('question-result');

    badge.textContent = `سؤال ${q.id}`;
    questionText.textContent = q.question;
    resultDiv.className = 'question-result';
    resultDiv.style.display = 'none';

    const letters = ['أ', 'ب', 'ج', 'د'];
    answersContainer.innerHTML = '';
    q.answers.forEach((answer, idx) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `
            <span class="answer-letter">${letters[idx]}</span>
            <span class="answer-text">${answer}</span>
        `;
        btn.addEventListener('click', () => checkAnswer(idx));
        answersContainer.appendChild(btn);
    });

    modal.classList.add('active');
    startTimer();
}

function hideQuestionModal() {
    const modal = document.getElementById('question-modal');
    if (modal) modal.classList.remove('active');
    stopTimer();

    document.getElementById('team1-board').classList.remove('active-team');
    document.getElementById('team2-board').classList.remove('active-team');
}

// ====== Timer ======
function startTimer() {
    gameState.timerRemaining = gameState.timerDuration;
    updateTimerDisplay();

    const progressEl = document.getElementById('timer-progress');
    if (progressEl) {
        progressEl.style.strokeDashoffset = 0;
        progressEl.classList.remove('warning', 'danger');
    }

    const timerTextEl = document.getElementById('timer-text');
    if (timerTextEl) timerTextEl.classList.remove('warning', 'danger');

    gameState.timerInterval = setInterval(() => {
        gameState.timerRemaining--;
        updateTimerDisplay();

        if (gameState.timerRemaining <= 5 && gameState.timerRemaining > 0) {
            sounds.playTimerWarning();
        }

        if (gameState.timerRemaining <= 0) {
            clearInterval(gameState.timerInterval);
            sounds.playTimeout();
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function updateTimerDisplay() {
    const timerText = document.getElementById('timer-text');
    const progressEl = document.getElementById('timer-progress');
    const circumference = 2 * Math.PI * 54;

    if (timerText) timerText.textContent = gameState.timerRemaining;

    if (progressEl) {
        const progress = (1 - gameState.timerRemaining / gameState.timerDuration) * circumference;
        progressEl.style.strokeDashoffset = progress;

        timerText.classList.remove('warning', 'danger');
        progressEl.classList.remove('warning', 'danger');

        if (gameState.timerRemaining <= 5) {
            timerText.classList.add('danger');
            progressEl.classList.add('danger');
        } else if (gameState.timerRemaining <= 10) {
            timerText.classList.add('warning');
            progressEl.classList.add('warning');
        }
    }
}

// ====== Answer Checking ======
function checkAnswer(selectedIdx) {
    stopTimer();

    const q = gameState.currentQuestion;
    const answerBtns = document.querySelectorAll('.answer-btn');
    const resultDiv = document.getElementById('question-result');

    answerBtns.forEach(btn => btn.classList.add('disabled'));

    const isCorrect = selectedIdx === q.correct;

    if (isCorrect) {
        answerBtns[selectedIdx].classList.add('correct');
        sounds.playCorrect();
        sounds.playApplause();

        if (gameState.currentTeam === 1) gameState.team1.score++;
        else gameState.team2.score++;

        animateScore(gameState.currentTeam);
        updateScoreboard();

        resultDiv.className = 'question-result show correct';
        resultDiv.style.display = '';
        resultDiv.innerHTML = `
            <div class="result-icon">✅</div>
            <div class="result-text">إجابة صحيحة! +1 نقطة لـ ${gameState.currentTeam === 1 ? gameState.team1.name : gameState.team2.name}</div>
        `;
    } else {
        answerBtns[selectedIdx].classList.add('wrong');
        answerBtns[q.correct].classList.add('show-correct');
        sounds.playWrong();

        resultDiv.className = 'question-result show wrong';
        resultDiv.style.display = '';
        resultDiv.innerHTML = `
            <div class="result-icon">❌</div>
            <div class="result-text">إجابة خاطئة! الإجابة الصحيحة: ${q.answers[q.correct]}</div>
        `;
    }

    markQuestionUsed(q.id);

    setTimeout(() => {
        hideQuestionModal();
        checkGameEnd();
    }, 3000);
}

function handleTimeout() {
    const q = gameState.currentQuestion;
    const answerBtns = document.querySelectorAll('.answer-btn');
    const resultDiv = document.getElementById('question-result');

    answerBtns.forEach(btn => btn.classList.add('disabled'));
    answerBtns[q.correct].classList.add('show-correct');

    resultDiv.className = 'question-result show timeout';
    resultDiv.style.display = '';
    resultDiv.innerHTML = `
        <div class="result-icon">⏰</div>
        <div class="result-text">انتهى الوقت! الإجابة الصحيحة: ${q.answers[q.correct]}</div>
    `;

    markQuestionUsed(q.id);

    setTimeout(() => {
        hideQuestionModal();
        checkGameEnd();
    }, 3000);
}

function markQuestionUsed(id) {
    gameState.usedQuestions.push(id);
    gameState.answeredCount++;

    const cell = document.querySelector(`.number-cell[data-number="${id}"]`);
    if (cell) {
        cell.classList.add('disappearing');
        setTimeout(() => {
            cell.classList.remove('disappearing');
            cell.classList.add('used');
        }, 800);
    }

    saveProgress();
}

// ====== Game End ======
function checkGameEnd() {
    if (gameState.answeredCount >= gameState.totalQuestions) {
        setTimeout(() => showWinner(), 500);
    }
}

function showWinner() {
    const modal = document.getElementById('winner-modal');
    const nameEl = document.getElementById('winner-team-name');
    const scoreEl = document.getElementById('winner-score');
    const winnerLogoContainer = document.getElementById('winner-logo-container');
    const winnerLogoImg = document.getElementById('winner-logo-img');

    let winnerName, winnerScore, winnerLogo = '';

    if (gameState.team1.score > gameState.team2.score) {
        winnerName = gameState.team1.name;
        winnerScore = gameState.team1.score;
        winnerLogo = gameState.team1.logo;
    } else if (gameState.team2.score > gameState.team1.score) {
        winnerName = gameState.team2.name;
        winnerScore = gameState.team2.score;
        winnerLogo = gameState.team2.logo;
    } else {
        winnerName = 'تعادل! 🤝';
        winnerScore = gameState.team1.score;
    }

    if (winnerLogo && winnerLogoImg && winnerLogoContainer) {
        winnerLogoImg.src = winnerLogo;
        winnerLogoContainer.style.display = 'block';
    } else if (winnerLogoContainer) {
        winnerLogoContainer.style.display = 'none';
    }

    if (nameEl) nameEl.textContent = winnerName;
    if (scoreEl) scoreEl.textContent = `${winnerScore} نقاط`;

    if (modal) modal.classList.add('active');

    confetti.start();
    sounds.playApplause();
    sounds.playCelebrationFanfare();
    setTimeout(() => sounds.playCelebration(), 3500);
}

function restartCompetition() {
    gameState.team1.score = 0;
    gameState.team2.score = 0;
    gameState.usedQuestions = [];
    gameState.answeredCount = 0;
    gameState.currentQuestion = null;
    gameState.currentTeam = null;

    localStorage.removeItem(KEY('quiz_progress'));

    confetti.stop();

    const winnerModal = document.getElementById('winner-modal');
    if (winnerModal) winnerModal.classList.remove('active');

    renderGrid();
    updateScoreboard();
    updateTurnIndicator();
}

// ====== Listen for storage changes (from admin) ======
window.addEventListener('storage', (e) => {
    const watchedKeys = [
        KEY('quiz_teams'),
        KEY('quiz_questions'),
        KEY('quiz_timer'),
        KEY('quiz_logos'),
        KEY('quiz_golden')
    ];
    if (watchedKeys.includes(e.key)) {
        loadGameData();
        renderGrid();
        renderGoldenGrid();
        updateScoreboard();
        updateTurnIndicator();
    }
});

// Periodic sync for name/logo changes from admin panel
setInterval(() => {
    const savedTeams = localStorage.getItem(KEY('quiz_teams'));
    if (savedTeams) {
        const teams = JSON.parse(savedTeams);
        if (teams.team1 !== gameState.team1.name || teams.team2 !== gameState.team2.name) {
            gameState.team1.name = teams.team1;
            gameState.team2.name = teams.team2;
            updateScoreboard();
        }
    }

    const savedLogos = localStorage.getItem(KEY('quiz_logos'));
    if (savedLogos) {
        const logos = JSON.parse(savedLogos);
        if (logos.team1 !== gameState.team1.logo || logos.team2 !== gameState.team2.logo) {
            gameState.team1.logo = logos.team1 || '';
            gameState.team2.logo = logos.team2 || '';
            updateTeamLogos();
        }
    }
}, 2000);
