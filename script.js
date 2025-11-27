const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results');
const startButton = document.getElementById('start-btn');
const regContainer = document.getElementById('registration-container');
const historyButton = document.getElementById('history-btn');
const historyContainer = document.getElementById('history-container');
const resultsNav = document.getElementById('results-navigation');
const prevResultBtn = document.getElementById('prev-result-btn');
const nextResultBtn = document.getElementById('next-result-btn');
const resultCounter = document.getElementById('result-counter');

let studentName = "";
let studentGroup = "";
let studentFaculty = "";
let answerSelected = false; 
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let reviewIndex = 0; 
let latestQuizResults = null;

const quizQuestions = [
  { question: "1. Який пристрій є основним для введення тексту в комп’ютер?", answers: { a: "Монітор", b: "Клавіатура", c: "Принтер", d: "Мишка" }, correctAnswer: "b" },
  { question: "2. Що таке операційна система?", answers: { a: "Комп’ютерна гра", b: "Пристрій пам’яті", c: "Програма для керування комп’ютером", d: "Програма для створення текстів" }, correctAnswer: "c" },
  { question: "3. Який тип файлу має розширення .jpg?", answers: { a: "Звуковий файл", b: "Відеофайл", c: "Зображення", d: "Текстовий документ" }, correctAnswer: "c" },
  { question: "4. Що означає скорочення 'HTML'?", answers: { a: "HyperText Markup Language", b: "Hyper Transfer Machine Language", c: "HighText Main Language", d: "Hyperlink Text Module Language" }, correctAnswer: "a" },
  { question: "5. Яка мова використовується для стилізації вебсторінок?", answers: { a: "Python", b: "CSS", c: "C++", d: "Java" }, correctAnswer: "b" },
  { question: "6. Що таке браузер?", answers: { a: "Програма для перегляду вебсторінок", b: "Текстовий редактор", c: "Ігрова програма", d: "Операційна система" }, correctAnswer: "a" },
  { question: "7. Яке розширення має виконуваний файл у Windows?", answers: { a: ".txt", b: ".exe", c: ".jpg", d: ".docx" }, correctAnswer: "b" },
  { question: "8. Який пристрій виводу інформації?", answers: { a: "Монітор", b: "Клавіатура", c: "Сканер", d: "Мікрофон" }, correctAnswer: "a" },
  { question: "9. Що таке «біт»?", answers: { a: "Одиниця вимірювання часу", b: "Одиниця інформації", c: "Комп’ютерна програма", d: "Пристрій пам’яті" }, correctAnswer: "b" },
  { question: "10. Який пристрій зберігає дані постійно?", answers: { a: "Оперативна пам’ять", b: "Жорсткий диск", c: "Процесор", d: "Кеш" }, correctAnswer: "b" },
  { question: "11. Яке розширення мають таблиці Excel?", answers: { a: ".docx", b: ".xlsx", c: ".pptx", d: ".txt" }, correctAnswer: "b" },
  { question: "12. Який елемент відповідає за виконання обчислень у комп’ютері?", answers: { a: "Оперативна пам’ять", b: "Монітор", c: "Процесор", d: "Жорсткий диск" }, correctAnswer: "c" },
  { question: "13. Що означає скорочення «URL»?", answers: { a: "User Real Link", b: "Universal Resource Locator", c: "Uniform Real Line", d: "Unified Resource Label" }, correctAnswer: "b" },
  { question: "14. Який елемент не є частиною комп’ютера?", answers: { a: "Материнська плата", b: "Процесор", c: "Мишка", d: "Електрочайник" }, correctAnswer: "d" },
  { question: "15. Яка одиниця є більшою за байт?", answers: { a: "Біт", b: "Кілобайт", c: "Мегабіт", d: "Піксель" }, correctAnswer: "b" }
];

startButton.addEventListener("click", () => {
  studentName = document.getElementById("student-name").value.trim();
  studentGroup = document.getElementById("student-group").value.trim();
  studentFaculty = document.getElementById("student-faculty").value.trim();
  if (!studentName || !studentGroup || !studentFaculty){
    alert("Заповніть всі поля перед початком тесту");
    return;
  }
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  latestQuizResults = null;
  regContainer.style.display = "none";
  questionContainer.style.display = "block";
  nextButton.style.display = "inline-block";
  resultsContainer.style.display = 'none';
  resultsNav.style.display = 'none';
  historyButton.style.display = 'none';
  historyContainer.innerHTML = '';
  showQuestion(currentQuestionIndex);
});

function showQuestion(index) {
  nextButton.disabled = true;
  answerSelected = false;
  const q = quizQuestions[index];
  const answersHTML = Object.keys(q.answers)
  .map(letter => `
    <label data-answer="${letter}">
      <input type="radio" name="answer" value="${letter}">
      ${letter}) ${q.answers[letter]}
    </label>
  `).join('');
  questionContainer.innerHTML = `
    <div class="question">${q.question}</div>
    <div class="answers">${answersHTML}</div>
  `;
  const answerInputs = questionContainer.querySelectorAll('input[type="radio"]');
  answerInputs.forEach(input => {
    input.addEventListener('change', handleAnswerSelection);
  });
}

function handleAnswerSelection(event) {
  if (answerSelected) return;
  const selectedInput = event.target;
  const selectedAnswerValue = selectedInput.value;
  userAnswers[currentQuestionIndex] = selectedAnswerValue;
  checkAnswer(selectedAnswerValue); 
  nextButton.disabled = false;
}

function checkAnswer(selectedAnswer) {
  answerSelected = true; 
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const correctAnswer = currentQuestion.correctAnswer;
  const allInputs = questionContainer.querySelectorAll('input[type="radio"]');
  allInputs.forEach(input => input.disabled = true);
  const selectedLabel = questionContainer.querySelector(`label[data-answer="${selectedAnswer}"]`);
  if (selectedAnswer === correctAnswer) {
    score++;
    selectedLabel.classList.add('correct');
  } else {
    selectedLabel.classList.add('wrong');
    const correctLabel = questionContainer.querySelector(`label[data-answer="${correctAnswer}"]`);
    if (correctLabel) {
      correctLabel.classList.add('correct-after-wrong');
    }
  }
}

nextButton.addEventListener('click', () => {
  if (!answerSelected) {
    alert("Спочатку виберіть відповідь!");
    return;
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion(currentQuestionIndex);
  } else {
    showResults();
  }
});

function saveToHistory(){
  const totalQuestions = quizQuestions.length;
  const percent = Math.round((score / totalQuestions) * 100);
  const record = {
    name: studentName,
    group: studentGroup,
    faculty: studentFaculty,
    score: score,
    scoretotal: totalQuestions,
    percent: percent,
    questions: quizQuestions,
    userAnswers: userAnswers,
    date: new Date().toLocaleString()
  };
  latestQuizResults = record;
  let history = JSON.parse(localStorage.getItem("testHistory")) || [];
  history.push(record);
  localStorage.setItem("testHistory", JSON.stringify(history));
}

function showResults() {
  questionContainer.style.display = "none";
  nextButton.style.display = "none";
  resultsContainer.style.display = 'block';
  historyButton.style.display = "inline-block";
  const percent = (score / quizQuestions.length) * 100;
  let message = "";
  if (percent >= 90) message = "Відмінно!";
  else if (percent >= 70) message = "Добре!";
  else if (percent >= 50) message = "Задовільно";
  else message = "Спробуй ще раз!";
  resultsContainer.innerHTML = `
    <h2>Загальні Результати</h2>
    <p>Твій результат: ${score} із ${quizQuestions.length} (${percent.toFixed(1)}%)</p>
    <p>${message}</p>
    <button id="review-btn">Переглянути відповіді</button>
  `;
  saveToHistory();
  document.getElementById('review-btn').addEventListener('click', () => showReview(latestQuizResults));
}


function showReview(quizData) {
  if (!quizData || !quizData.questions) return;
  resultsContainer.style.display = 'none';
  historyButton.style.display = 'none';
  historyContainer.innerHTML = '';
  resultsNav.style.display = 'flex';
  questionContainer.style.display = 'block'; 
  latestQuizResults = quizData;
  reviewIndex = 0;
  renderReviewQuestion();
}

function renderReviewQuestion() {
  if (!latestQuizResults) return;
  const q = latestQuizResults.questions[reviewIndex];
  const userAnswer = latestQuizResults.userAnswers[reviewIndex];
  const isCorrect = userAnswer === q.correctAnswer;
  const answersHTML = Object.keys(q.answers)
  .map(letter => {
    let className = '';
    if (letter === q.correctAnswer) {
      className = 'correct'; 
    } else if (letter === userAnswer) {
      className = 'wrong';
    }
    return `
      <label class="${className}" data-answer="${letter}">
        ${letter}) ${q.answers[letter]}
      </label>
    `;
  }).join('');
  questionContainer.innerHTML = `
    <h2>Аналіз: Питання ${reviewIndex + 1} з ${latestQuizResults.questions.length}</h2>
    <div class="question">${q.question}</div>
    <div class="answers">${answersHTML}</div>
    <p style="margin-top: 15px;">
      Твоя відповідь: <b>${q.answers[userAnswer] || 'Немає відповіді'}</b>
      (Статус: <span style="color: ${isCorrect ? '#6ab04c' : '#eb4d4b'}; font-weight: bold;">${isCorrect ? 'Правильно' : 'Неправильно'}</span>)
    </p>
  `;
  resultCounter.textContent = `${reviewIndex + 1} / ${latestQuizResults.questions.length}`;
  prevResultBtn.disabled = reviewIndex === 0;
  nextResultBtn.disabled = reviewIndex === latestQuizResults.questions.length - 1;
}

prevResultBtn.addEventListener('click', () => {
  if (reviewIndex > 0) {
    reviewIndex--;
    renderReviewQuestion();
  }
});

nextResultBtn.addEventListener('click', () => {
  if (reviewIndex < latestQuizResults.questions.length - 1) {
    reviewIndex++;
    renderReviewQuestion();
  }
});

historyButton.addEventListener("click", showHistory);

function showHistory(){
  resultsContainer.style.display = 'none';
  resultsNav.style.display = 'none'; 
  questionContainer.style.display = 'none';
  nextButton.style.display = 'none';
  historyButton.style.display = 'none';
  let history = JSON.parse(localStorage.getItem("testHistory")) || [];
  if (history.length === 0){
    historyContainer.innerHTML = "<h2>Історія проходження тесту</h2><p>Історія порожня</p>";
    return;
  }
  let html = "<h2>Історія проходження тесту</h2>";
  history.forEach((item, index) => {
    const totalQuestions = item.total || 15; 
    html += `
      <div class="history-item" data-index="${index}">
        <div class="history-data">
          <p><b>Ім'я:</b> ${item.name}</p>
          <p><b>Група:</b> ${item.group}</p>
          <p><b>Факультет:</b> ${item.faculty}</p>
          <p><b>Результат:</b> ${item.score} / ${totalQuestions} (${item.percent}%)</p>
          <p><b>Дата:</b> ${item.date}</p>
        </div>
        <button class="history-analyze-btn" data-index="${index}">Аналіз</button>
      </div>
    `;
  });
  historyContainer.innerHTML = html;
  document.querySelectorAll('.history-analyze-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      const selectedRecord = history[index];
      showReview(selectedRecord);
    });
  });
}
// commit