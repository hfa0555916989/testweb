/**
 * لوحة التحكم - مسابقة الثقافة الرياضية المدرسية
 */

// ====== Default Questions ======
const defaultQuestions = [
    { id: 1,  question: "ما هي المدة الزمنية لمباراة كرة القدم؟",                      answers: ["60 دقيقة", "90 دقيقة", "120 دقيقة", "45 دقيقة"],                correct: 1 },
    { id: 2,  question: "كم عدد لاعبي فريق كرة السلة على أرض الملعب؟",                  answers: ["6 لاعبين", "5 لاعبين", "7 لاعبين", "4 لاعبين"],               correct: 1 },
    { id: 3,  question: "في أي رياضة يُستخدم مصطلح 'الإرسال الساحق'؟",                  answers: ["كرة القدم", "كرة الطائرة", "كرة اليد", "التنس"],               correct: 1 },
    { id: 4,  question: "ما هو طول ملعب كرة القدم القانوني؟",                            answers: ["90 متر", "100-110 متر", "120 متر", "80 متر"],                  correct: 1 },
    { id: 5,  question: "كم يبلغ ارتفاع شبكة كرة الطائرة للرجال؟",                      answers: ["2.24 متر", "2.43 متر", "2.50 متر", "2.30 متر"],               correct: 1 },
    { id: 6,  question: "ما هي الرياضة التي يُطلق عليها 'اللعبة الملكية'؟",              answers: ["كرة القدم", "الغولف", "الشطرنج", "البولو"],                    correct: 2 },
    { id: 7,  question: "كم عدد اللاعبين في فريق كرة الطائرة؟",                         answers: ["5 لاعبين", "7 لاعبين", "6 لاعبين", "8 لاعبين"],               correct: 2 },
    { id: 8,  question: "في أي دولة نشأت رياضة الجودو؟",                                answers: ["الصين", "كوريا", "اليابان", "تايلاند"],                        correct: 2 },
    { id: 9,  question: "ما هو عدد أشواط مباراة كرة السلة؟",                            answers: ["شوطين", "3 أشواط", "4 أشواط", "5 أشواط"],                     correct: 2 },
    { id: 10, question: "ما هي المسافة التي يقطعها عداء الماراثون؟",                     answers: ["40 كم", "42.195 كم", "45 كم", "38 كم"],                       correct: 1 },
    { id: 11, question: "كم تبلغ مدة الشوط الواحد في كرة اليد؟",                        answers: ["25 دقيقة", "30 دقيقة", "35 دقيقة", "20 دقيقة"],               correct: 1 },
    { id: 12, question: "ما هي الرياضة التي يُستخدم فيها مضرب الريشة؟",                 answers: ["التنس", "البادمنتون", "الاسكواش", "تنس الطاولة"],              correct: 1 },
    { id: 13, question: "كم عدد اللاعبين في فريق كرة الماء؟",                           answers: ["6 لاعبين", "7 لاعبين", "8 لاعبين", "5 لاعبين"],               correct: 1 },
    { id: 14, question: "ما هو الوزن القانوني لكرة القدم؟",                              answers: ["350-390 غرام", "410-450 غرام", "500-550 غرام", "300-340 غرام"], correct: 1 },
    { id: 15, question: "في أي عام أُقيمت أول دورة أولمبية حديثة؟",                     answers: ["1892", "1896", "1900", "1888"],                                correct: 1 },
    { id: 16, question: "ما هي أسرع رياضة كرة في العالم؟",                              answers: ["التنس", "الكريكيت", "البادمنتون", "الغولف"],                   correct: 2 },
    { id: 17, question: "كم يبلغ عرض مرمى كرة القدم؟",                                  answers: ["7.32 متر", "8 متر", "6.5 متر", "7 متر"],                      correct: 0 },
    { id: 18, question: "ما هو عدد الحكام في مباراة كرة القدم؟",                         answers: ["3 حكام", "4 حكام", "5 حكام", "2 حكام"],                       correct: 1 },
    { id: 19, question: "ما اسم الرياضة التي تُمارس على الجليد بالمكنسة؟",               answers: ["هوكي الجليد", "التزلج", "الكيرلنغ", "البياثلون"],              correct: 2 },
    { id: 20, question: "كم عدد نقاط الفوز في مجموعة التنس (تاي بريك)؟",                answers: ["5 نقاط", "6 نقاط", "7 نقاط", "10 نقاط"],                      correct: 2 }
];

let questions = [];

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('auth_sscf') !== '1') return; // gate not passed yet
    initAdmin();
});

function initAdmin() {
    loadTeams();
    loadTeamsB();
    loadTimer();
    loadQuestions();
    renderQuestionsList();
    loadGoldenQuestions();
    updateCorrectLabels();
    setupDragDrop();
}

// ====== Password Gate ======
function checkGatePassword() {
    const input = document.getElementById('gate-password');
    if (!input) return;

    if (input.value === 'sscf1069') {
        sessionStorage.setItem('auth_sscf', '1');
        const gate = document.getElementById('password-gate');
        const content = document.getElementById('admin-content');
        if (gate) gate.style.display = 'none';
        if (content) content.style.display = '';
        initAdmin();
    } else {
        input.value = '';
        input.style.borderColor = '#e53935';
        input.placeholder = 'كلمة المرور غير صحيحة!';
        setTimeout(() => {
            input.style.borderColor = '';
            input.placeholder = 'أدخل كلمة المرور';
        }, 1200);
    }
}

// ====== Alert System ======
function showAlert(type, message) {
    const alertEl = document.getElementById(`alert-${type}`);
    const textEl = document.getElementById(`alert-${type}-text`);
    if (!alertEl || !textEl) return;
    textEl.textContent = message;
    alertEl.classList.add('show');
    setTimeout(() => alertEl.classList.remove('show'), 3000);
}

// ====== Team Name Helpers ======
const teamNames = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع'];

// ====== Group A — Teams ======
let teamLogos = { team1: '', team2: '' };

function loadTeams() {
    const saved = localStorage.getItem('quiz_teams');
    if (saved) {
        const teams = JSON.parse(saved);
        const el1 = document.getElementById('team1-name-input');
        const el2 = document.getElementById('team2-name-input');
        if (el1) el1.value = teams.team1 || '';
        if (el2) el2.value = teams.team2 || '';
    }

    const savedLogos = localStorage.getItem('quiz_logos');
    if (savedLogos) {
        teamLogos = { team1: '', team2: '', ...JSON.parse(savedLogos) };
        if (teamLogos.team1) showLogoPreview(1, teamLogos.team1);
        if (teamLogos.team2) showLogoPreview(2, teamLogos.team2);
    }
}

function saveTeams() {
    const team1 = (document.getElementById('team1-name-input').value || '').trim();
    const team2 = (document.getElementById('team2-name-input').value || '').trim();

    if (!team1 || !team2) {
        showAlert('error', 'يرجى إدخال أسماء الفريقين');
        return;
    }

    localStorage.setItem('quiz_teams', JSON.stringify({ team1, team2 }));
    localStorage.setItem('quiz_logos', JSON.stringify(teamLogos));
    showAlert('success', 'تم حفظ إعدادات المجموعة أ بنجاح!');
}

// ====== Group B — Teams ======
let teamLogosB = { team3: '', team4: '' };

function loadTeamsB() {
    const saved = localStorage.getItem('quiz_teams_b');
    if (saved) {
        const teams = JSON.parse(saved);
        const el3 = document.getElementById('team3-name-input');
        const el4 = document.getElementById('team4-name-input');
        if (el3) el3.value = teams.team1 || '';
        if (el4) el4.value = teams.team2 || '';
    }

    const savedLogos = localStorage.getItem('quiz_logos_b');
    if (savedLogos) {
        const logos = JSON.parse(savedLogos);
        teamLogosB.team3 = logos.team1 || '';
        teamLogosB.team4 = logos.team2 || '';
        if (teamLogosB.team3) showLogoPreview(3, teamLogosB.team3);
        if (teamLogosB.team4) showLogoPreview(4, teamLogosB.team4);
    }
}

function saveTeamsB() {
    const el3 = document.getElementById('team3-name-input');
    const el4 = document.getElementById('team4-name-input');
    const team3 = (el3 ? el3.value : '').trim();
    const team4 = (el4 ? el4.value : '').trim();

    if (!team3 || !team4) {
        showAlert('error', 'يرجى إدخال أسماء فريقي المجموعة ب');
        return;
    }

    // Stored with team1/team2 keys so group-b.html reuses the same loading logic
    localStorage.setItem('quiz_teams_b', JSON.stringify({ team1: team3, team2: team4 }));
    localStorage.setItem('quiz_logos_b', JSON.stringify({
        team1: teamLogosB.team3 || '',
        team2: teamLogosB.team4 || ''
    }));
    showAlert('success', 'تم حفظ إعدادات المجموعة ب بنجاح!');
}

// ====== Logo Management (supports teams 1–4) ======
function handleLogoUpload(teamNum, event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showAlert('error', 'يرجى اختيار ملف صورة صالح');
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showAlert('error', 'حجم الصورة يجب أن لا يتجاوز 2 ميجابايت');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        resizeImage(e.target.result, 500, function(resizedData) {
            if (teamNum <= 2) {
                teamLogos[`team${teamNum}`] = resizedData;
            } else {
                teamLogosB[`team${teamNum}`] = resizedData;
            }
            showLogoPreview(teamNum, resizedData);
            const urlInput = document.getElementById(`logo-url${teamNum}`);
            if (urlInput) urlInput.value = '';
            showAlert('success', `تم تحميل شعار الفريق ${teamNames[teamNum]} — اضغط حفظ للتطبيق`);
        });
    };
    reader.readAsDataURL(file);
}

function handleLogoUrl(teamNum) {
    const urlInput = document.getElementById(`logo-url${teamNum}`);
    const url = urlInput ? urlInput.value.trim() : '';
    if (!url) return;

    if (teamNum <= 2) {
        teamLogos[`team${teamNum}`] = url;
    } else {
        teamLogosB[`team${teamNum}`] = url;
    }
    showLogoPreview(teamNum, url);
}

function removeLogo(teamNum) {
    if (teamNum <= 2) {
        teamLogos[`team${teamNum}`] = '';
    } else {
        teamLogosB[`team${teamNum}`] = '';
    }

    const preview     = document.getElementById(`logo-preview${teamNum}`);
    const placeholder = document.getElementById(`logo-placeholder${teamNum}`);
    const removeBtn   = document.getElementById(`remove-logo${teamNum}`);
    const urlInput    = document.getElementById(`logo-url${teamNum}`);
    const fileInput   = document.getElementById(`logo-file${teamNum}`);

    if (preview)     { preview.style.display = 'none'; preview.src = ''; }
    if (placeholder) placeholder.style.display = 'flex';
    if (removeBtn)   removeBtn.style.display = 'none';
    if (urlInput)    urlInput.value = '';
    if (fileInput)   fileInput.value = '';

    showAlert('success', `تم حذف شعار الفريق ${teamNames[teamNum]} — اضغط حفظ للتطبيق`);
}

function showLogoPreview(teamNum, src) {
    const preview     = document.getElementById(`logo-preview${teamNum}`);
    const placeholder = document.getElementById(`logo-placeholder${teamNum}`);
    const removeBtn   = document.getElementById(`remove-logo${teamNum}`);

    if (!preview) return;
    preview.src = src;
    preview.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
    if (removeBtn)   removeBtn.style.display = 'inline-flex';
}

function resizeImage(dataUrl, maxSize, callback) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;

        if (w > maxSize || h > maxSize) {
            if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
            else       { w = Math.round(w * maxSize / h); h = maxSize; }
        }

        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
}

// ====== Drag & Drop (teams 1–4) ======
function setupDragDrop() {
    [1, 2, 3, 4].forEach(teamNum => {
        const area = document.getElementById(`logo-upload-area${teamNum}`);
        if (!area) return;

        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });

        area.addEventListener('dragleave', () => {
            area.classList.remove('dragover');
        });

        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleLogoUpload(teamNum, { target: { files: e.dataTransfer.files } });
            }
        });
    });
}

// ====== Timer ======
function loadTimer() {
    const saved = localStorage.getItem('quiz_timer');
    if (saved) {
        const el = document.getElementById('timer-input');
        if (el) el.value = saved;
    }
}

function saveTimer() {
    const el = document.getElementById('timer-input');
    const timer = parseInt(el ? el.value : '30');
    if (isNaN(timer) || timer < 5 || timer > 120) {
        showAlert('error', 'يجب أن تكون المدة بين 5 و 120 ثانية');
        return;
    }
    localStorage.setItem('quiz_timer', timer.toString());
    showAlert('success', `تم حفظ مدة المؤقت: ${timer} ثانية`);
}

// ====== Questions (Group A) ======
function loadQuestions() {
    const saved = localStorage.getItem('quiz_questions');
    if (saved) {
        questions = JSON.parse(saved);
    } else {
        questions = [...defaultQuestions];
        localStorage.setItem('quiz_questions', JSON.stringify(questions));
    }
}

function saveQuestions() {
    localStorage.setItem('quiz_questions', JSON.stringify(questions));
}

function addQuestion() {
    const numberEl   = document.getElementById('q-number');
    const textEl     = document.getElementById('q-text');
    const checkedRadio = document.querySelector('input[name="correct-answer"]:checked');

    const number  = parseInt(numberEl ? numberEl.value : '');
    const text    = (textEl ? textEl.value : '').trim();
    const answers = [0, 1, 2, 3].map(i => {
        const el = document.getElementById(`q-answer-${i}`);
        return el ? el.value.trim() : '';
    });
    const correct = checkedRadio ? parseInt(checkedRadio.value) : 0;

    if (!number || number < 1) { showAlert('error', 'يرجى إدخال رقم صحيح للسؤال'); return; }
    if (!text)                  { showAlert('error', 'يرجى إدخال نص السؤال'); return; }
    if (answers.some(a => !a)) { showAlert('error', 'يرجى إدخال جميع الخيارات'); return; }

    const questionObj = { id: number, question: text, answers, correct };
    const existingIdx = questions.findIndex(q => q.id === number);

    if (existingIdx !== -1) {
        questions[existingIdx] = questionObj;
        showAlert('success', `تم تحديث السؤال رقم ${number}`);
    } else {
        questions.push(questionObj);
        questions.sort((a, b) => a.id - b.id);
        showAlert('success', `تم إضافة السؤال رقم ${number}`);
    }

    saveQuestions();
    renderQuestionsList();

    // Clear form
    if (numberEl) numberEl.value = '';
    if (textEl)   textEl.value = '';
    [0, 1, 2, 3].forEach(i => {
        const el = document.getElementById(`q-answer-${i}`);
        if (el) el.value = '';
    });
}

function deleteQuestion(id) {
    if (!confirm(`هل تريد حذف السؤال رقم ${id}؟`)) return;
    questions = questions.filter(q => q.id !== id);
    saveQuestions();
    renderQuestionsList();
    showAlert('success', `تم حذف السؤال رقم ${id}`);
}

function editQuestion(id) {
    const q = questions.find(q => q.id === id);
    if (!q) return;

    const numberEl = document.getElementById('q-number');
    const textEl   = document.getElementById('q-text');
    if (numberEl) numberEl.value = q.id;
    if (textEl)   textEl.value  = q.question;
    [0, 1, 2, 3].forEach(i => {
        const el = document.getElementById(`q-answer-${i}`);
        if (el) el.value = q.answers[i] || '';
    });

    document.querySelectorAll('input[name="correct-answer"]').forEach(radio => {
        radio.checked = parseInt(radio.value) === q.correct;
    });
    updateCorrectLabels();

    // Scroll to the add-question card by id
    const card = document.getElementById('add-question-card');
    if (card) card.scrollIntoView({ behavior: 'smooth' });

    showAlert('success', `جاري تعديل السؤال رقم ${id} — عدّل ثم اضغط "إضافة السؤال" للحفظ`);
}

function renderQuestionsList() {
    const list  = document.getElementById('questions-list');
    const count = document.getElementById('questions-count');
    if (!list) return;

    if (count) count.textContent = questions.length;

    if (questions.length === 0) {
        list.innerHTML = '<li style="text-align:center; padding:30px; color:#999; font-weight:600;">لا توجد أسئلة حالياً</li>';
        return;
    }

    const letters = ['أ', 'ب', 'ج', 'د'];

    list.innerHTML = questions.map(q => `
        <li class="question-item">
            <div class="q-number">${q.id}</div>
            <div class="q-text">
                <div style="font-weight:800; margin-bottom:4px;">${q.question}</div>
                <div style="font-size:0.85rem; color:#666;">
                    ${q.answers.map((a, i) => `
                        <span style="margin-inline-start:10px; ${i === q.correct ? 'color:var(--correct); font-weight:800;' : ''}">
                            ${letters[i]}) ${a} ${i === q.correct ? '✓' : ''}
                        </span>`).join('')}
                </div>
            </div>
            <div class="q-actions">
                <button class="btn btn-primary btn-sm" onclick="editQuestion(${q.id})" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteQuestion(${q.id})" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');
}

// ====== Golden Questions ======
function loadGoldenQuestions() {
    const saved = localStorage.getItem('quiz_golden');
    if (!saved) return;

    const list = JSON.parse(saved);
    list.forEach(q => {
        const num = q.id.replace('g', '');
        const ta = document.getElementById(`golden-q-${num}`);
        if (ta) ta.value = q.question || '';
    });
}

function saveGoldenQuestions() {
    const goldenList = [];
    for (let i = 1; i <= 4; i++) {
        const ta   = document.getElementById(`golden-q-${i}`);
        const text = ta ? ta.value.trim() : '';
        if (text) goldenList.push({ id: `g${i}`, question: text });
    }

    localStorage.setItem('quiz_golden', JSON.stringify(goldenList));
    showAlert('success', goldenList.length > 0
        ? `تم حفظ ${goldenList.length} سؤال ذهبي بنجاح`
        : 'تم مسح الأسئلة الذهبية');
}

function renderGoldenQuestions() {
    // Repopulate textareas from localStorage
    loadGoldenQuestions();
}

// ====== Game Controls ======
function resetGame() {
    if (!confirm('هل تريد إعادة تعيين المسابقة بالكامل؟ سيتم مسح النقاط وتقدم المسابقة.')) return;
    localStorage.removeItem('quiz_progress');
    localStorage.removeItem('quiz_progress_b');
    showAlert('success', 'تم إعادة تعيين المسابقة!');
}

function resetScores() {
    if (!confirm('هل تريد إعادة تعيين النقاط فقط؟')) return;
    ['quiz_progress', 'quiz_progress_b'].forEach(key => {
        const raw = localStorage.getItem(key);
        if (raw) {
            const p = JSON.parse(raw);
            p.team1Score = 0;
            p.team2Score = 0;
            localStorage.setItem(key, JSON.stringify(p));
        }
    });
    showAlert('success', 'تم إعادة تعيين النقاط!');
}

function resetQuestions() {
    if (!confirm('هل تريد حذف جميع الأسئلة؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    questions = [];
    saveQuestions();
    renderQuestionsList();
    showAlert('success', 'تم حذف جميع الأسئلة');
}

function loadDefaultQuestions() {
    if (!confirm('هل تريد تحميل الأسئلة الافتراضية؟ سيتم استبدال الأسئلة الحالية.')) return;
    questions = [...defaultQuestions];
    saveQuestions();
    renderQuestionsList();
    showAlert('success', 'تم تحميل 20 سؤال افتراضي');
}

// ====== Correct-answer label highlight ======
function updateCorrectLabels() {
    document.querySelectorAll('.answer-option-item').forEach(item => {
        const radio = item.querySelector('input[type="radio"]');
        const label = item.querySelector('.correct-label');
        if (label) label.style.visibility = radio && radio.checked ? 'visible' : 'hidden';
    });
}

document.querySelectorAll('input[name="correct-answer"]').forEach(radio => {
    radio.addEventListener('change', updateCorrectLabels);
});
