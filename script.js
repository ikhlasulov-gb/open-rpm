(function() {
    const CONFIG = {
        totalTime: 20 * 60,
        imageExt: '.webp',
        imagePath: 'img/',
    };

    const NORMATIVE_DISTRIBUTION = {
        0:  [0, 0, 0, 0, 0],
        15: [8, 4, 2, 1, 0],
        16: [8, 4, 2, 1, 0],
        17: [8, 5, 2, 1, 1],
        18: [8, 5, 2, 2, 1],
        19: [8, 6, 3, 2, 0],
        20: [8, 6, 4, 2, 0],
        21: [8, 6, 4, 2, 1],
        22: [9, 6, 4, 2, 1],
        23: [9, 7, 4, 3, 1],
        24: [9, 7, 4, 3, 1],
        25: [10, 7, 4, 3, 1],
        26: [10, 7, 5, 3, 1],
        27: [10, 7, 5, 4, 1],
        28: [10, 7, 6, 4, 1],
        29: [10, 7, 6, 4, 1],
        30: [10, 7, 7, 5, 1],
        31: [10, 8, 7, 5, 1],
        32: [10, 8, 7, 5, 2],
        33: [11, 8, 7, 5, 2],
        34: [11, 8, 7, 5, 2],
        35: [11, 8, 7, 6, 2],
        36: [11, 8, 7, 6, 2],
        37: [11, 9, 8, 7, 2],
        38: [11, 9, 8, 8, 2],
        39: [11, 10, 8, 8, 2],
        40: [11, 10, 8, 8, 3],
        41: [11, 10, 9, 8, 3],
        42: [11, 10, 9, 8, 3],
        43: [11, 10, 9, 9, 3],
        44: [12, 10, 9, 9, 4],
        45: [12, 10, 9, 9, 5],
        46: [12, 10, 9, 10, 5],
        47: [12, 10, 9, 10, 6],
        48: [12, 11, 10, 10, 6],
        49: [12, 11, 10, 10, 6],
        50: [12, 11, 11, 10, 7],
        51: [12, 11, 11, 11, 7],
        52: [12, 11, 11, 11, 7],
        53: [12, 12, 12, 9, 8],
        54: [12, 12, 12, 10, 8],
        55: [12, 12, 12, 11, 9],
        56: [12, 12, 12, 11, 9],
        57: [12, 12, 12, 12, 10],
        58: [12, 12, 12, 12, 10],
        59: [12, 12, 12, 12, 11],
        60: [12, 12, 12, 12, 12]
    };

    class SplineInterpolator {
        constructor(points) {
            this.points = points;
            this.points.sort((a, b) => a.x - b.x);
        }

        interpolate(x) {
            if (x <= this.points[0].x) return this.points[0].y;
            if (x >= this.points[this.points.length - 1].x) return this.points[this.points.length - 1].y;

            let i = 0;
            for (let j = 0; j < this.points.length - 1; j++) {
                if (this.points[j].x <= x && x <= this.points[j+1].x) {
                    i = j;
                    break;
                }
            }

            const p0 = this.points[Math.max(0, i - 1)];
            const p1 = this.points[i];
            const p2 = this.points[Math.min(this.points.length - 1, i + 1)];
            const p3 = this.points[Math.min(this.points.length - 1, i + 2)];

            const t = (x - p1.x) / (p2.x - p1.x);
            const t2 = t * t;
            const t3 = t2 * t;

            const h1 = 2*p1.y + (-p0.y + p2.y)*t;
            const h2 = (2*p0.y - 5*p1.y + 4*p2.y - p3.y)*t2;
            const h3 = (-p0.y + 3*p1.y - 3*p2.y + p3.y)*t3;

            return 0.5 * (h1 + h2 + h3);
        }
    }

    const splineData = [
        {x: 0, y: 0}, {x: 15, y: 62},
        {x: 16, y: 65}, {x: 17, y: 65},
        {x: 18, y: 66}, {x: 19, y: 67},
        {x: 20, y: 69}, {x: 22, y: 71},
        {x: 23, y: 72}, {x: 24, y: 73},
        {x: 25, y: 75}, {x: 26, y: 76},
        {x: 27, y: 77}, {x: 28, y: 79},
        {x: 29, y: 80}, {x: 30, y: 82},
        {x: 31, y: 83}, {x: 32, y: 84},
        {x: 33, y: 86}, {x: 34, y: 87},
        {x: 35, y: 88}, {x: 36, y: 90},
        {x: 37, y: 91}, {x: 38, y: 92},
        {x: 39, y: 94}, {x: 40, y: 95},
        {x: 41, y: 96}, {x: 42, y: 98},
        {x: 43, y: 99}, {x: 44, y: 100},
        {x: 45, y: 102},{x: 46, y: 104},
        {x: 47, y: 105}, {x: 48, y: 106},
        {x: 49, y: 108}, {x: 50, y: 110},
        {x: 51, y: 112}, {x: 52, y: 114},
        {x: 53, y: 116}, {x: 54, y: 118},
        {x: 55, y: 122}, {x: 56, y: 124},
        {x: 57, y: 126}, {x: 58, y: 128},
        {x: 59, y: 130}, {x: 60, y: 140}
    ];

    const splineIQ = new SplineInterpolator(splineData);

    function getBaseIQ(score) {
        return splineIQ.interpolate(Math.round(score));
    }

    class RavenApp {
        constructor() {
            this.currentQuestion = 1;
            this.userAnswers = {};
            this.timeLeft = CONFIG.totalTime;
            this.timerInterval = null;
            this.testActive = false;
            this.agePercent = 100;
            this.currentLang = 'en';
            this.endTime = 0;

            this.screens = {
                intro: document.getElementById('intro-screen'),
 test: document.getElementById('test-screen'),
 result: document.getElementById('result-screen')
            };

            this.dom = {
                timerBar: document.getElementById('timer-bar-fill'),
 timerText: document.getElementById('timer-text'),
 qImage: document.getElementById('q-image'),
 options: document.getElementById('options-container'),
 qNum: document.getElementById('current-q-num'),
 series: document.getElementById('current-series'),
 progressContainer: document.getElementById('progress-container'),
 prevBtn: document.getElementById('btn-prev'),
 nextBtn: document.getElementById('btn-next'),
 resultTable: document.querySelector('table'),
 interpretationCard: document.querySelectorAll('.sub-card')[0],
 totalScore: document.getElementById('total-raw-score'),
 timeTaken: document.getElementById('time-taken'),
 confirmModal: document.getElementById('confirm-modal'),
 langSelect: document.getElementById('lang-select'),
 userAge: document.getElementById('user-age'),
 modalTitle: document.getElementById('modal-title'),
 modalMessage: document.getElementById('modal-message'),
 confirmBtn: document.querySelector('.btn-confirm')
            };
        }

        init() {
            window.addEventListener('beforeunload', (e) => {
                if (this.testActive) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            });
            setTimeout(() => {
                this.determineLanguage();
                this.loadSavedAge();
                this.applyTranslations();
                this.updateMetaTitle();
                this.updateWikiLink();
            }, 0);
        }

        loadSavedAge() {
            const savedAge = localStorage.getItem('raven_age');
            if (savedAge && this.dom.userAge) this.dom.userAge.value = savedAge;
        }

        determineLanguage() {
            let lang = localStorage.getItem('raven_lang');
            if (!lang) lang = (navigator.language || navigator.userLanguage || 'en').substring(0, 2);
            if (TRANSLATIONS[lang]) this.currentLang = lang;
            else this.currentLang = 'en';
            if (this.dom.langSelect) this.dom.langSelect.value = this.currentLang;
        }

        t(key) {
            return TRANSLATIONS[this.currentLang][key] || key;
        }

        updateMetaTitle() { document.title = this.t('site_title'); }

        updateWikiLink() {
            const linkEl = document.querySelector('[data-i18n-href="wiki_url"]');
            if (linkEl) {
                const url = this.t('wiki_url');
                if (url && typeof url === 'string') linkEl.href = url;
            }
        }

        changeLanguage(lang) {
            localStorage.setItem('raven_lang', lang);
            this.currentLang = lang;
            this.applyTranslations();
            this.updateMetaTitle();
            this.updateWikiLink();
            if (this.testActive) this.renderQuestion();
            if (!this.screens.result.classList.contains('hidden')) this.calculateResults();
        }

        applyTranslations() {
            document.querySelectorAll('[data-i18n]').forEach(el => el.innerText = this.t(el.getAttribute('data-i18n')));
            document.querySelectorAll('[data-i18n-href]').forEach(el => {
                const link = this.t(el.getAttribute('data-i18n-href'));
                if (link && typeof link === 'string') el.href = link;
            });
        }

        resetApp() {
            clearInterval(this.timerInterval);
            this.testActive = false;
            if(this.dom.confirmModal) this.dom.confirmModal.classList.add('hidden');
            this.screens.test.classList.add('hidden');
            this.screens.result.classList.add('hidden');
            this.currentQuestion = 1;
            this.userAnswers = {};
            this.timeLeft = CONFIG.totalTime;
            this.screens.intro.classList.remove('hidden');
        }

        startTest() {
            const age = this.dom.userAge.value;
            if (!age) {
                this.dom.modalTitle.innerText = "Error";
                this.dom.modalMessage.innerText = this.t('age_label');

                const tempHandler = () => {
                    this.hideConfirm();
                    this.applyTranslations();
                    this.dom.confirmBtn.onclick = () => this.forceEnd();
                };

                this.dom.confirmBtn.onclick = tempHandler;
                this.dom.confirmModal.classList.remove('hidden');
                return;
            }
            localStorage.setItem('raven_age', age);
            this.agePercent = parseInt(age);
            this.screens.intro.classList.add('hidden');
            this.screens.test.classList.remove('hidden');
            this.testActive = true;
            this.startTimer();
            this.renderQuestion();
        }

        startTimer() {
            this.endTime = Date.now() + (this.timeLeft * 1000);
            this.updateTimerDisplay();
            this.timerInterval = setInterval(() => {
                if (!this.testActive) return;
                const now = Date.now();
                const remaining = Math.ceil((this.endTime - now) / 1000);
                this.timeLeft = Math.max(0, remaining);
                this.updateTimerDisplay();
                if (this.timeLeft <= 0) this.finishTest();
            }, 100);
        }

        updateTimerDisplay() {
            const m = Math.floor(this.timeLeft / 60);
            const s = this.timeLeft % 60;
            this.dom.timerText.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
            this.dom.timerBar.style.width = `${(this.timeLeft / CONFIG.totalTime) * 100}%`;
        }

        getSeries(n) {
            if (n <= 12) return 'A';
            if (n <= 24) return 'B';
            if (n <= 36) return 'C';
            if (n <= 48) return 'D';
            return 'E';
        }

        renderQuestion() {
            const q = this.currentQuestion;
            const s = this.getSeries(q);
            const template = this.t('progress_template');
            this.dom.progressContainer.innerText = template.replace('{q}', q).replace('{s}', s);
            const img = this.dom.qImage;
            img.src = `${CONFIG.imagePath}${q}${CONFIG.imageExt}`;
            img.onerror = () => img.src = `https://via.placeholder.com/400x400?text=Q+${q}+(${s})`;
            this.dom.options.innerHTML = '';
            this.dom.options.className = 'options-grid';
            const optCount = (s === 'A' || s === 'B') ? 6 : 8;
            if (optCount === 6) this.dom.options.classList.add('cols-6');
            for (let i = 1; i <= optCount; i++) {
                const btn = document.createElement('div');
                btn.className = `option-btn ${this.userAnswers[q] === i ? 'selected' : ''}`;
                btn.innerText = i;
                btn.onclick = () => this.selectAnswer(i);
                this.dom.options.appendChild(btn);
            }
            this.dom.prevBtn.disabled = q === 1;
            if (q === 60) {
                this.dom.nextBtn.innerText = this.t('btn_finish');
                this.dom.nextBtn.classList.add('btn-finish');
            } else {
                this.dom.nextBtn.innerText = this.t('btn_next');
                this.dom.nextBtn.classList.remove('btn-finish');
            }
        }

        selectAnswer(val) {
            this.userAnswers[this.currentQuestion] = val;
            this.renderQuestion();
        }

        nextQuestion() {
            if (this.currentQuestion < 60) {
                this.currentQuestion++;
                this.renderQuestion();
            } else {
                this.finishTest();
            }
        }

        prevQuestion() {
            if (this.currentQuestion > 1) {
                this.currentQuestion--;
                this.renderQuestion();
            }
        }

        finishTest() {
            clearInterval(this.timerInterval);
            this.testActive = false;
            this.screens.test.classList.add('hidden');
            this.screens.result.classList.remove('hidden');
            this.calculateResults();
        }

        confirmEndTest() { if (this.dom.confirmModal) this.dom.confirmModal.classList.remove('hidden'); }
        hideConfirm() { if (this.dom.confirmModal) this.dom.confirmModal.classList.add('hidden'); }
        forceEnd() { this.hideConfirm(); this.resetApp(); }

        getClosestNormative(score) {
            if (score < 15) {
                const ratio = score / 15;
                return [
                    Math.round(8 * ratio),
 Math.round(4 * ratio),
 Math.round(2 * ratio),
 Math.round(1 * ratio),
 0
                ];
            }

            if (NORMATIVE_DISTRIBUTION[score]) return NORMATIVE_DISTRIBUTION[score];
            const keys = Object.keys(NORMATIVE_DISTRIBUTION).map(Number).sort((a, b) => a - b);
            let closest = keys[0];
            let minDiff = Math.abs(score - closest);
            for (let i = 1; i < keys.length; i++) {
                const diff = Math.abs(score - keys[i]);
                if (diff < minDiff) { minDiff = diff; closest = keys[i]; }
            }
            return NORMATIVE_DISTRIBUTION[closest];
        }

        calculateResults() {
            const ANSWER_KEY = getAnswers();
            let rawScore = 0;
            const seriesScores = { A:0, B:0, C:0, D:0, E:0 };
            for (let i = 1; i <= 60; i++) {
                if (this.userAnswers[i] === ANSWER_KEY[i]) {
                    rawScore++;
                    seriesScores[this.getSeries(i)]++;
                }
            }

            let baseIQ = getBaseIQ(rawScore);
            let finalIQ = Math.round((baseIQ * 100) / this.agePercent);
            document.getElementById('final-iq').innerText = finalIQ;

            let diagnosisText = "";
            if (finalIQ >= 140) diagnosisText = this.t('diag_exceptional');
            else if (finalIQ >= 121) diagnosisText = this.t('diag_high');
            else if (finalIQ >= 111) diagnosisText = this.t('diag_above_avg');
            else if (finalIQ >= 91) diagnosisText = this.t('diag_avg');
            else if (finalIQ >= 81) diagnosisText = this.t('diag_below_avg');
            else if (finalIQ >= 71) diagnosisText = this.t('diag_low');
            else if (finalIQ >= 51) diagnosisText = this.t('diag_mild');
            else if (finalIQ >= 21) diagnosisText = this.t('diag_moderate');
            else diagnosisText = this.t('diag_severe');
            document.getElementById('final-diagnosis').innerText = diagnosisText;

            let degreeText = "";
            if (finalIQ >= 121) degreeText = this.t('degree_1');
            else if (finalIQ >= 111) degreeText = this.t('degree_2');
            else if (finalIQ >= 91) degreeText = this.t('degree_3');
            else if (finalIQ >= 81) degreeText = this.t('degree_4');
            else degreeText = this.t('degree_5');

            document.getElementById('interpretation-text').innerText = degreeText;

            const recText = this.getRecommendations(finalIQ);
            document.getElementById('recommendation-text').innerText = recText;

            const tbody = document.getElementById('series-table-body');
            tbody.innerHTML = '';
            const seriesNames = ['A', 'B', 'C', 'D', 'E'];
            const expectedNorms = this.getClosestNormative(rawScore);
            let unreliableSeriesCount = 0;
            let deviationA = 0;

            seriesNames.forEach((s, index) => {
                const score = seriesScores[s];
                const expectedScore = expectedNorms[index];
                const deviation = score - expectedScore;
                if (s === 'A') deviationA = deviation;
                const isReliable = Math.abs(deviation) <= 2;
                if (!isReliable) unreliableSeriesCount++;
                const devString = deviation > 0 ? '+' + deviation : deviation;
                const statusClass = isReliable ? '' : 'alert-danger';

                const tr = document.createElement('tr');

                const tdSeries = document.createElement('td');
                tdSeries.textContent = `${this.t('series_label')} ${s}`;
                tr.appendChild(tdSeries);

                const tdCorrect = document.createElement('td');
                tdCorrect.textContent = score;
                tr.appendChild(tdCorrect);

                const tdDeviation = document.createElement('td');
                tdDeviation.textContent = devString;
                if(statusClass) tdDeviation.classList.add(statusClass);
                tr.appendChild(tdDeviation);

                tbody.appendChild(tr);
            });

            const timeTaken = CONFIG.totalTime - this.timeLeft;
            const m = Math.floor(timeTaken / 60);
            const s = timeTaken % 60;
            this.dom.totalScore.innerText = `${rawScore} / 60`;
            this.dom.timeTaken.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;

            const ageVal = document.getElementById('user-age-val');
            if (ageVal && this.dom.userAge && this.dom.userAge.selectedIndex >= 0) {
                ageVal.innerText = this.dom.userAge.options[this.dom.userAge.selectedIndex].text;
            }

            const relMsg = document.getElementById('reliability-msg');

            if (deviationA <= -3) {
                relMsg.innerText = this.t('reliability_defect');
                relMsg.className = "alert-danger";
            } else if (unreliableSeriesCount > 2) {
                relMsg.innerText = this.t('reliability_unreliable');
                relMsg.className = "alert-danger";
            } else if (rawScore < 15) {
                relMsg.innerText = this.t('reliability_low_reliability');
                relMsg.className = "alert-warning";
            } else {
                relMsg.innerText = this.t('reliability_good');
                relMsg.className = "alert-success";
            }
        }

        getRecommendations(iq) {
            if (iq >= 120) return this.t('rec_120');
            if (iq >= 110) return this.t('rec_110');
            if (iq >= 90) return this.t('rec_90');
            if (iq >= 80) return this.t('rec_80');
            return this.t('rec_low');
        }
    }

    window.app = new RavenApp();
    window.app.init();
})();
