/**
 * لوحة التحكم - مسابقة الثقافة الرياضية المدرسية
 */

// ====== Default Questions (same as in script.js) ======
const defaultQuestions = [
    { id: 1, question: "ما هي المدة الزمنية لمباراة كرة القدم؟", answers: ["60 دقيقة", "90 دقيقة", "120 دقيقة", "45 دقيقة"], correct: 1 },
    { id: 2, question: "كم عدد لاعبي فريق كرة السلة على أرض الملعب؟", answers: ["6 لاعبين", "5 لاعبين", "7 لاعبين", "4 لاعبين"], correct: 1 },
    { id: 3, question: "في أي رياضة يُستخدم مصطلح 'الإرسال الساحق'؟", answers: ["كرة القدم", "كرة الطائرة", "كرة اليد", "التنس"], correct: 1 },
    { id: 4, question: "ما هو طول ملعب كرة القدم القانوني؟", answers: ["90 متر", "100-110 متر", "120 متر", "80 متر"], correct: 1 },
    { id: 5, question: "كم يبلغ ارتفاع شبكة كرة الطائرة للرجال؟", answers: ["2.24 متر", "2.43 متر", "2.50 متر", "2.30 متر"], correct: 1 },
    { id: 6, question: "ما هي الرياضة التي يُطلق عليها 'اللعبة الملكية'؟", answers: ["كرة القدم", "الغولف", "الشطرنج", "البولو"], correct: 2 },
    { id: 7, question: "كم عدد اللاعبين في فريق كرة الطائرة؟", answers: ["5 لاعبين", "7 لاعبين", "6 لاعبين", "8 لاعبين"], correct: 2 },
    { id: 8, question: "في أي دولة نشأت رياضة الجودو؟", answers: ["الصين", "كوريا", "اليابان", "تايلاند"], correct: 2 },
    { id: 9, question: "ما هو عدد أشواط مباراة كرة السلة؟", answers: ["شوطين", "3 أشواط", "4 أشواط", "5 أشواط"], correct: 2 },
    { id: 10, question: "ما هي المسافة التي يقطعها عداء الماراثون؟", answers: ["40 كم", "42.195 كم", "45 كم", "38 كم"], correct: 1 },
    { id: 11, question: "كم تبلغ مدة الشوط الواحد في كرة اليد؟", answers: ["25 دقيقة", "30 دقيقة", "35 دقيقة", "20 دقيقة"], correct: 1 },
    { id: 12, question: "ما هي الرياضة التي يُستخدم فيها مضرب الريشة؟", answers: ["التنس", "البادمنتون", "الاسكواش", "تنس الطاولة"], correct: 1 },
    { id: 13, question: "كم عدد اللاعبين في فريق كرة الماء؟", answers: ["6 لاعبين", "7 لاعبين", "8 لاعبين", "5 لاعبين"], correct: 1 },
    { id: 14, question: "ما هو الوزن القانوني لكرة القدم؟", answers: ["350-390 غرام", "410-450 غرام", "500-550 غرام", "300-340 غرام"], correct: 1 },
    { id: 15, question: "في أي عام أُقيمت أول دورة أولمبية حديثة؟", answers: ["1892", "1896", "1900", "1888"], correct: 1 },
    { id: 16, question: "ما هي أسرع رياضة كرة في العالم؟", answers: ["التنس", "الكريكيت", "البادمنتون", "الغولف"], correct: 2 },
    { id: 17, question: "كم يبلغ عرض مرمى كرة القدم؟", answers: ["7.32 متر", "8 متر", "6.5 متر", "7 متر"], correct: 0 },
    { id: 18, question: "ما هو عدد الحكام في مباراة كرة القدم؟", answers: ["3 حكام", "4 حكام", "5 حكام", "2 حكام"], correct: 1 },
    { id: 19, question: "ما اسم الرياضة التي تُمارس على الجليد بالمكنسة؟", answers: ["هوكي الجليد", "التزلج", "الكيرلنغ", "البياثلون"], correct: 2 },
    { id: 20, question: "كم عدد نقاط الفوز في مجموعة التنس (تاي بريك)؟", answers: ["5 نقاط", "6 نقاط", "7 نقاط", "10 نقاط"], correct: 2 }
];

let questions = [];

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', () => {
    loadTeams();
    loadTimer();
    loadQuestions();
    renderQuestionsList();
    updateCorrectLabels();
});

// ====== Alert System ======
function showAlert(type, message) {
    const alert = document.getElementById(`alert-${type}`);
    const text = document.getElementById(`alert-${type}-text`);
    text.textContent = message;
    alert.classList.add('show');
    setTimeout(() => alert.classList.remove('show'), 3000);
}

// ====== Teams ======
let teamLogos = { team1: '', team2: '' };

function loadTeams() {
    const saved = localStorage.getItem('quiz_teams');
    if (saved) {
        const teams = JSON.parse(saved);
        document.getElementById('team1-name-input').value = teams.team1 || '';
        document.getElementById('team2-name-input').value = teams.team2 || '';
    }
    
    // Load logos
    const savedLogos = localStorage.getItem('quiz_logos');
    if (savedLogos) {
        teamLogos = JSON.parse(savedLogos);
        if (teamLogos.team1) showLogoPreview(1, teamLogos.team1);
        if (teamLogos.team2) showLogoPreview(2, teamLogos.team2);
    }
}

function saveTeams() {
    const team1 = document.getElementById('team1-name-input').value.trim();
    const team2 = document.getElementById('team2-name-input').value.trim();
    
    if (!team1 || !team2) {
        showAlert('error', 'يرجى إدخال أسماء الفريقين');
        return;
    }
    
    localStorage.setItem('quiz_teams', JSON.stringify({ team1, team2 }));
    
    // Save logos
    localStorage.setItem('quiz_logos', JSON.stringify(teamLogos));
    
    showAlert('success', 'تم حفظ إعدادات الفرق بنجاح!');
}

// ====== Logo Management ======
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
        // Resize image to save localStorage space
        resizeImage(e.target.result, 200, function(resizedData) {
            teamLogos[`team${teamNum}`] = resizedData;
            showLogoPreview(teamNum, resizedData);
            // Clear URL input
            document.getElementById(`logo-url${teamNum}`).value = '';
            showAlert('success', `تم تحميل شعار الفريق ${teamNum === 1 ? 'الأول' : 'الثاني'} - اضغط "حفظ إعدادات الفرق" للتطبيق`);
        });
    };
    reader.readAsDataURL(file);
}

function handleLogoUrl(teamNum) {
    const url = document.getElementById(`logo-url${teamNum}`).value.trim();
    if (url) {
        teamLogos[`team${teamNum}`] = url;
        showLogoPreview(teamNum, url);
    }
}

function removeLogo(teamNum) {
    teamLogos[`team${teamNum}`] = '';
    
    const preview = document.getElementById(`logo-preview${teamNum}`);
    const placeholder = document.getElementById(`logo-placeholder${teamNum}`);
    const removeBtn = document.getElementById(`remove-logo${teamNum}`);
    const urlInput = document.getElementById(`logo-url${teamNum}`);
    const fileInput = document.getElementById(`logo-file${teamNum}`);
    
    preview.style.display = 'none';
    preview.src = '';
    placeholder.style.display = 'flex';
    removeBtn.style.display = 'none';
    urlInput.value = '';
    fileInput.value = '';
    
    showAlert('success', `تم حذف شعار الفريق ${teamNum === 1 ? 'الأول' : 'الثاني'} - اضغط "حفظ إعدادات الفرق" للتطبيق`);
}

function showLogoPreview(teamNum, src) {
    const preview = document.getElementById(`logo-preview${teamNum}`);
    const placeholder = document.getElementById(`logo-placeholder${teamNum}`);
    const removeBtn = document.getElementById(`remove-logo${teamNum}`);
    
    preview.src = src;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    removeBtn.style.display = 'inline-flex';
}

function resizeImage(dataUrl, maxSize, callback) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        
        if (w > maxSize || h > maxSize) {
            if (w > h) {
                h = Math.round(h * maxSize / w);
                w = maxSize;
            } else {
                w = Math.round(w * maxSize / h);
                h = maxSize;
            }
        }
        
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
}

// Drag and drop support
document.addEventListener('DOMContentLoaded', () => {
    [1, 2].forEach(teamNum => {
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
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fakeEvent = { target: { files: files } };
                handleLogoUpload(teamNum, fakeEvent);
            }
        });
    });
});

// ====== Timer ======
function loadTimer() {
    const saved = localStorage.getItem('quiz_timer');
    if (saved) {
        document.getElementById('timer-input').value = saved;
    }
}

function saveTimer() {
    const timer = parseInt(document.getElementById('timer-input').value);
    if (timer < 5 || timer > 120) {
        showAlert('error', 'يجب أن تكون المدة بين 5 و 120 ثانية');
        return;
    }
    localStorage.setItem('quiz_timer', timer.toString());
    showAlert('success', `تم حفظ مدة المؤقت: ${timer} ثانية`);
}

// ====== Questions ======
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
    const number = parseInt(document.getElementById('q-number').value);
    const text = document.getElementById('q-text').value.trim();
    const answers = [
        document.getElementById('q-answer-0').value.trim(),
        document.getElementById('q-answer-1').value.trim(),
        document.getElementById('q-answer-2').value.trim(),
        document.getElementById('q-answer-3').value.trim()
    ];
    const correct = parseInt(document.querySelector('input[name="correct-answer"]:checked').value);
    
    // Validation
    if (!number || number < 1) {
        showAlert('error', 'يرجى إدخال رقم صحيح للسؤال');
        return;
    }
    if (!text) {
        showAlert('error', 'يرجى إدخال نص السؤال');
        return;
    }
    if (answers.some(a => !a)) {
        showAlert('error', 'يرجى إدخال جميع الخيارات');
        return;
    }
    
    // Check if number exists and update it
    const existingIdx = questions.findIndex(q => q.id === number);
    const questionObj = {
        id: number,
        question: text,
        answers: answers,
        correct: correct
    };
    
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
    document.getElementById('q-number').value = '';
    document.getElementById('q-text').value = '';
    document.getElementById('q-answer-0').value = '';
    document.getElementById('q-answer-1').value = '';
    document.getElementById('q-answer-2').value = '';
    document.getElementById('q-answer-3').value = '';
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
    
    document.getElementById('q-number').value = q.id;
    document.getElementById('q-text').value = q.question;
    document.getElementById('q-answer-0').value = q.answers[0];
    document.getElementById('q-answer-1').value = q.answers[1];
    document.getElementById('q-answer-2').value = q.answers[2];
    document.getElementById('q-answer-3').value = q.answers[3];
    
    // Set correct answer radio
    document.querySelectorAll('input[name="correct-answer"]').forEach(radio => {
        radio.checked = parseInt(radio.value) === q.correct;
    });
    updateCorrectLabels();
    
    // Scroll to form
    document.querySelector('.admin-card:nth-child(5)').scrollIntoView({ behavior: 'smooth' });
    showAlert('success', `جاري تعديل السؤال رقم ${id} - عدّل وأضغط "إضافة السؤال" للحفظ`);
}

function renderQuestionsList() {
    const list = document.getElementById('questions-list');
    const count = document.getElementById('questions-count');
    
    count.textContent = questions.length;
    
    if (questions.length === 0) {
        list.innerHTML = '<li style="text-align: center; padding: 30px; color: #999; font-weight: 600;">لا توجد أسئلة حالياً</li>';
        return;
    }
    
    const letters = ['أ', 'ب', 'ج', 'د'];
    
    list.innerHTML = questions.map(q => `
        <li class="question-item">
            <div class="q-number">${q.id}</div>
            <div class="q-text">
                <div style="font-weight: 800; margin-bottom: 4px;">${q.question}</div>
                <div style="font-size: 0.85rem; color: #666;">
                    ${q.answers.map((a, i) => `<span style="margin-left: 10px; ${i === q.correct ? 'color: var(--correct); font-weight: 800;' : ''}">${letters[i]}) ${a} ${i === q.correct ? '✓' : ''}</span>`).join('')}
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

// ====== Game Controls ======
function resetGame() {
    if (!confirm('هل تريد إعادة تعيين المسابقة بالكامل؟ سيتم مسح النقاط وتقدم المسابقة.')) return;
    localStorage.removeItem('quiz_progress');
    showAlert('success', 'تم إعادة تعيين المسابقة!');
}

function resetScores() {
    if (!confirm('هل تريد إعادة تعيين النقاط فقط؟')) return;
    const progress = JSON.parse(localStorage.getItem('quiz_progress') || '{}');
    progress.team1Score = 0;
    progress.team2Score = 0;
    localStorage.setItem('quiz_progress', JSON.stringify(progress));
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

// ====== Correct label visual update ======
function updateCorrectLabels() {
    document.querySelectorAll('.answer-option-item').forEach(item => {
        const radio = item.querySelector('input[type="radio"]');
        const label = item.querySelector('.correct-label');
        if (label) {
            label.style.visibility = radio.checked ? 'visible' : 'hidden';
        }
    });
}

document.querySelectorAll('input[name="correct-answer"]').forEach(radio => {
    radio.addEventListener('change', updateCorrectLabels);
});
