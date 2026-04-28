/**
 * مسابقة الثقافة الرياضية المدرسية
 * نظام المسابقات المتطور
 */

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
    {
        id: 1,
        question: "ما هي المدة الزمنية لمباراة كرة القدم؟",
        answers: ["60 دقيقة", "90 دقيقة", "120 دقيقة", "45 دقيقة"],
        correct: 1
    },
    {
        id: 2,
        question: "كم عدد لاعبي فريق كرة السلة على أرض الملعب؟",
        answers: ["6 لاعبين", "5 لاعبين", "7 لاعبين", "4 لاعبين"],
        correct: 1
    },
    {
        id: 3,
        question: "في أي رياضة يُستخدم مصطلح 'الإرسال الساحق'؟",
        answers: ["كرة القدم", "كرة الطائرة", "كرة اليد", "التنس"],
        correct: 1
    },
    {
        id: 4,
        question: "ما هو طول ملعب كرة القدم القانوني؟",
        answers: ["90 متر", "100-110 متر", "120 متر", "80 متر"],
        correct: 1
    },
    {
        id: 5,
        question: "كم يبلغ ارتفاع شبكة كرة الطائرة للرجال؟",
        answers: ["2.24 متر", "2.43 متر", "2.50 متر", "2.30 متر"],
        correct: 1
    },
    {
        id: 6,
        question: "ما هي الرياضة التي يُطلق عليها 'اللعبة الملكية'؟",
        answers: ["كرة القدم", "الغولف", "الشطرنج", "البولو"],
        correct: 2
    },
    {
        id: 7,
        question: "كم عدد اللاعبين في فريق كرة الطائرة؟",
        answers: ["5 لاعبين", "7 لاعبين", "6 لاعبين", "8 لاعبين"],
        correct: 2
    },
    {
        id: 8,
        question: "في أي دولة نشأت رياضة الجودو؟",
        answers: ["الصين", "كوريا", "اليابان", "تايلاند"],
        correct: 2
    },
    {
        id: 9,
        question: "ما هو عدد أشواط مباراة كرة السلة؟",
        answers: ["شوطين", "3 أشواط", "4 أشواط", "5 أشواط"],
        correct: 2
    },
    {
        id: 10,
        question: "ما هي المسافة التي يقطعها عداء الماراثون؟",
        answers: ["40 كم", "42.195 كم", "45 كم", "38 كم"],
        correct: 1
    },
    {
        id: 11,
        question: "كم تبلغ مدة الشوط الواحد في كرة اليد؟",
        answers: ["25 دقيقة", "30 دقيقة", "35 دقيقة", "20 دقيقة"],
        correct: 1
    },
    {
        id: 12,
        question: "ما هي الرياضة التي يُستخدم فيها مضرب الريشة؟",
        answers: ["التنس", "البادمنتون", "الاسكواش", "تنس الطاولة"],
        correct: 1
    },
    {
        id: 13,
        question: "كم عدد اللاعبين في فريق كرة الماء؟",
        answers: ["6 لاعبين", "7 لاعبين", "8 لاعبين", "5 لاعبين"],
        correct: 1
    },
    {
        id: 14,
        question: "ما هو الوزن القانوني لكرة القدم؟",
        answers: ["350-390 غرام", "410-450 غرام", "500-550 غرام", "300-340 غرام"],
        correct: 1
    },
    {
        id: 15,
        question: "في أي عام أُقيمت أول دورة أولمبية حديثة؟",
        answers: ["1892", "1896", "1900", "1888"],
        correct: 1
    },
    {
        id: 16,
        question: "ما هي أسرع رياضة كرة في العالم؟",
        answers: ["التنس", "الكريكيت", "البادمنتون", "الغولف"],
        correct: 2
    },
    {
        id: 17,
        question: "كم يبلغ عرض مرمى كرة القدم؟",
        answers: ["7.32 متر", "8 متر", "6.5 متر", "7 متر"],
        correct: 0
    },
    {
        id: 18,
        question: "ما هو عدد الحكام في مباراة كرة القدم؟",
        answers: ["3 حكام", "4 حكام", "5 حكام", "2 حكام"],
        correct: 1
    },
    {
        id: 19,
        question: "ما اسم الرياضة التي تُمارس على الجليد بالمكنسة؟",
        answers: ["هوكي الجليد", "التزلج", "الكيرلنغ", "البياثلون"],
        correct: 2
    },
    {
        id: 20,
        question: "كم عدد نقاط الفوز في مجموعة التنس (تاي بريك)؟",
        answers: ["5 نقاط", "6 نقاط", "7 نقاط", "10 نقاط"],
        correct: 2
    }
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

let sounds = new SoundEffects();
let confetti = null;

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', () => {
    confetti = new ConfettiSystem(document.getElementById('confetti-canvas'));
    loadGameData();
    renderGrid();
    updateScoreboard();
    updateTurnIndicator();
    createParticles();
    
    // Initialize audio on first interaction
    document.addEventListener('click', () => sounds.init(), { once: true });
});

function createParticles() {
    const container = document.getElementById('particles-container');
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
    // Load teams
    const savedTeams = localStorage.getItem('quiz_teams');
    if (savedTeams) {
        const teams = JSON.parse(savedTeams);
        gameState.team1.name = teams.team1 || 'الفريق الأول';
        gameState.team2.name = teams.team2 || 'الفريق الثاني';
    }
    
    // Load logos
    const savedLogos = localStorage.getItem('quiz_logos');
    if (savedLogos) {
        const logos = JSON.parse(savedLogos);
        gameState.team1.logo = logos.team1 || '';
        gameState.team2.logo = logos.team2 || '';
    }
    
    // Load questions
    const savedQuestions = localStorage.getItem('quiz_questions');
    if (savedQuestions) {
        gameState.questions = JSON.parse(savedQuestions);
    } else {
        gameState.questions = [...defaultQuestions];
    }
    
    gameState.totalQuestions = gameState.questions.length;
    
    // Load timer
    const savedTimer = localStorage.getItem('quiz_timer');
    if (savedTimer) {
        gameState.timerDuration = parseInt(savedTimer);
    }
    
    // Load game progress
    const savedProgress = localStorage.getItem('quiz_progress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        gameState.team1.score = progress.team1Score || 0;
        gameState.team2.score = progress.team2Score || 0;
        gameState.usedQuestions = progress.usedQuestions || [];
        gameState.answeredCount = progress.answeredCount || 0;
    }
}

function saveProgress() {
    localStorage.setItem('quiz_progress', JSON.stringify({
        team1Score: gameState.team1.score,
        team2Score: gameState.team2.score,
        usedQuestions: gameState.usedQuestions,
        answeredCount: gameState.answeredCount
    }));
}

// ====== Render Grid ======
function renderGrid() {
    const grid = document.getElementById('numbers-grid');
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

// ====== Update UI ======
function updateScoreboard() {
    document.getElementById('team1-name').textContent = gameState.team1.name;
    document.getElementById('team2-name').textContent = gameState.team2.name;
    document.getElementById('team1-score').textContent = gameState.team1.score;
    document.getElementById('team2-score').textContent = gameState.team2.score;
    
    // Update team select modal names
    const selName1 = document.getElementById('team-select-name1');
    const selName2 = document.getElementById('team-select-name2');
    if (selName1) selName1.textContent = gameState.team1.name;
    if (selName2) selName2.textContent = gameState.team2.name;
    
    // Update logos
    updateTeamLogos();
}

function updateTeamLogos() {
    // Scoreboard logos
    setLogoDisplay('team1-logo', 'team1-logo-fallback', gameState.team1.logo);
    setLogoDisplay('team2-logo', 'team2-logo-fallback', gameState.team2.logo);
    
    // Team select modal logos
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
    const indicator = document.getElementById('turn-indicator');
    const text = document.getElementById('turn-text');
    text.textContent = `اختر رقماً للسؤال التالي`;
}

function animateScore(teamNum) {
    const scoreEl = document.getElementById(`team${teamNum}-score`);
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
    
    // Show team selection modal
    showTeamSelectModal();
}

// ====== Team Selection ======
function showTeamSelectModal() {
    const modal = document.getElementById('team-select-modal');
    modal.classList.add('active');
}

function hideTeamSelectModal() {
    const modal = document.getElementById('team-select-modal');
    modal.classList.remove('active');
}

function selectAnsweringTeam(teamNum) {
    gameState.currentTeam = teamNum;
    hideTeamSelectModal();
    
    // Highlight active team
    document.getElementById('team1-board').classList.toggle('active-team', teamNum === 1);
    document.getElementById('team2-board').classList.toggle('active-team', teamNum === 2);
    
    // Show question
    setTimeout(() => showQuestion(), 300);
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
    
    // Render answers
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
    
    // Start timer
    startTimer();
}

function hideQuestionModal() {
    const modal = document.getElementById('question-modal');
    modal.classList.remove('active');
    stopTimer();
    
    // Remove active team highlight
    document.getElementById('team1-board').classList.remove('active-team');
    document.getElementById('team2-board').classList.remove('active-team');
}

// ====== Timer ======
function startTimer() {
    gameState.timerRemaining = gameState.timerDuration;
    updateTimerDisplay();
    
    const circumference = 2 * Math.PI * 54; // 339.292
    const progressEl = document.getElementById('timer-progress');
    progressEl.style.strokeDashoffset = 0;
    progressEl.classList.remove('warning', 'danger');
    
    const timerTextEl = document.getElementById('timer-text');
    timerTextEl.classList.remove('warning', 'danger');
    
    gameState.timerInterval = setInterval(() => {
        gameState.timerRemaining--;
        updateTimerDisplay();
        
        // Timer sound effects
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
    
    timerText.textContent = gameState.timerRemaining;
    
    const progress = (1 - gameState.timerRemaining / gameState.timerDuration) * circumference;
    progressEl.style.strokeDashoffset = progress;
    
    // Color changes
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

// ====== Answer Checking ======
function checkAnswer(selectedIdx) {
    stopTimer();
    
    const q = gameState.currentQuestion;
    const answerBtns = document.querySelectorAll('.answer-btn');
    const resultDiv = document.getElementById('question-result');
    
    // Disable all buttons
    answerBtns.forEach(btn => btn.classList.add('disabled'));
    
    const isCorrect = selectedIdx === q.correct;
    
    if (isCorrect) {
        // Correct answer
        answerBtns[selectedIdx].classList.add('correct');
        sounds.playCorrect();
        
        // Add score
        if (gameState.currentTeam === 1) {
            gameState.team1.score++;
        } else {
            gameState.team2.score++;
        }
        animateScore(gameState.currentTeam);
        updateScoreboard();
        
        resultDiv.className = 'question-result show correct';
        resultDiv.innerHTML = `
            <div class="result-icon">✅</div>
            <div class="result-text">إجابة صحيحة! +1 نقطة لـ ${gameState.currentTeam === 1 ? gameState.team1.name : gameState.team2.name}</div>
        `;
    } else {
        // Wrong answer
        answerBtns[selectedIdx].classList.add('wrong');
        answerBtns[q.correct].classList.add('show-correct');
        sounds.playWrong();
        
        resultDiv.className = 'question-result show wrong';
        resultDiv.innerHTML = `
            <div class="result-icon">❌</div>
            <div class="result-text">إجابة خاطئة! الإجابة الصحيحة: ${q.answers[q.correct]}</div>
        `;
    }
    
    // Mark question as used
    markQuestionUsed(q.id);
    
    // Auto close after delay
    setTimeout(() => {
        hideQuestionModal();
        checkGameEnd();
    }, 3000);
}

function handleTimeout() {
    const q = gameState.currentQuestion;
    const answerBtns = document.querySelectorAll('.answer-btn');
    const resultDiv = document.getElementById('question-result');
    
    // Disable all buttons
    answerBtns.forEach(btn => btn.classList.add('disabled'));
    
    // Show correct answer
    answerBtns[q.correct].classList.add('show-correct');
    
    resultDiv.className = 'question-result show timeout';
    resultDiv.innerHTML = `
        <div class="result-icon">⏰</div>
        <div class="result-text">انتهى الوقت! الإجابة الصحيحة: ${q.answers[q.correct]}</div>
    `;
    
    // Mark question as used
    markQuestionUsed(q.id);
    
    // Auto close
    setTimeout(() => {
        hideQuestionModal();
        checkGameEnd();
    }, 3000);
}

function markQuestionUsed(id) {
    gameState.usedQuestions.push(id);
    gameState.answeredCount++;
    
    // Animate the cell disappearing
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
    
    // Show winner logo
    if (winnerLogo) {
        winnerLogoImg.src = winnerLogo;
        winnerLogoContainer.style.display = 'block';
    } else {
        winnerLogoContainer.style.display = 'none';
    }
    
    nameEl.textContent = winnerName;
    scoreEl.textContent = `${winnerScore} نقاط`;
    
    modal.classList.add('active');
    
    // Start confetti
    confetti.start();
    
    // Play celebration sound
    sounds.playCelebration();
    
    // Keep celebration going
    setTimeout(() => sounds.playCelebration(), 3500);
}

function restartCompetition() {
    // Reset game state
    gameState.team1.score = 0;
    gameState.team2.score = 0;
    gameState.usedQuestions = [];
    gameState.answeredCount = 0;
    gameState.currentQuestion = null;
    gameState.currentTeam = null;
    
    // Clear saved progress
    localStorage.removeItem('quiz_progress');
    
    // Stop confetti
    confetti.stop();
    
    // Hide winner modal
    document.getElementById('winner-modal').classList.remove('active');
    
    // Re-render
    renderGrid();
    updateScoreboard();
    updateTurnIndicator();
}

// ====== Listen for storage changes (from admin) ======
window.addEventListener('storage', (e) => {
    if (e.key === 'quiz_teams' || e.key === 'quiz_questions' || e.key === 'quiz_timer' || e.key === 'quiz_logos') {
        loadGameData();
        renderGrid();
        updateScoreboard();
        updateTurnIndicator();
    }
});

// Also check periodically for changes
setInterval(() => {
    const savedTeams = localStorage.getItem('quiz_teams');
    if (savedTeams) {
        const teams = JSON.parse(savedTeams);
        if (teams.team1 !== gameState.team1.name || teams.team2 !== gameState.team2.name) {
            gameState.team1.name = teams.team1;
            gameState.team2.name = teams.team2;
            updateScoreboard();
        }
    }
    // Check logo changes
    const savedLogos = localStorage.getItem('quiz_logos');
    if (savedLogos) {
        const logos = JSON.parse(savedLogos);
        if (logos.team1 !== gameState.team1.logo || logos.team2 !== gameState.team2.logo) {
            gameState.team1.logo = logos.team1 || '';
            gameState.team2.logo = logos.team2 || '';
            updateTeamLogos();
        }
    }
}, 2000);
