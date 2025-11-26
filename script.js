const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results');
const startButton = document.getElementById('start-btn');
const regContainer = document.getElementById('registration-container');
const historyButton = document.getElementById('history-btn');
const historyContainer = document.getElementById('history-container');

let studentName = "";
let studentGroup = "";
let studentFaculty = "";

startButton.addEventListener("click", () => {
  studentName = document.getElementById("student-name").value.trim();
  studentGroup = document.getElementById("student-group").value.trim();
  studentFaculty = document.getElementById("student-faculty").value.trim();

  if (!studentName || !studentGroup || !studentFaculty){
    alert("Заповніть всі поля перед початком тесту");
    return;
  }

  regContainer.style.display = "none";
  questionContainer.style.display = "block";
  nextButton.style.display = "inline-block";

  showQuestion(currentQuestionIndex);
});

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

let currentQuestionIndex = 0;
let score = 0;

function showQuestion(index) {
  const q = quizQuestions[index];
  const answersHTML = Object.keys(q.answers)
  .map(letter => `
    <label>
      <input type="radio" name="answer" value="${letter}">
      ${letter}) ${q.answers[letter]}
    </label>
  `).join('');

  questionContainer.innerHTML = `
    <div class="question">${q.question}</div>
    <div class="answers">${answersHTML}</div>
  `;
}

nextButton.addEventListener('click', () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    alert("Виберіть відповідь перед переходом далі!");
    return;
  }

  if (selected.value === quizQuestions[currentQuestionIndex].correctAnswer) {
    score++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion(currentQuestionIndex);
  } else {
    showResults();
  }
});

function saveToHistory(){
  const percent = Math.round((score / quizQuestions.length) * 100);

  const record = {
    name: studentName,
    group: studentGroup,
    faculty: studentFaculty,
    score: score,
    percent: percent,
    date: new Date().toLocaleString()
  };

  let history = JSON.parse(localStorage.getItem("testHistory")) || [];
  history.push(record);

  localStorage.setItem("testHistory", JSON.stringify(history));
}

function showResults() {
  questionContainer.style.display = "none";
  nextButton.style.display = "none";
  historyButton.style.display = "inline-block";

  const percent = (score / quizQuestions.length) * 100;
  let message = "";

  if (percent >= 90) message = "Відмінно!";
  else if (percent >= 70) message = "Добре!";
  else if (percent >= 50) message = "Задовільно";
  else message = "Спробуй ще раз!";

  resultsContainer.innerHTML = `
  <h2>Рузультати</h2>
  <p><b>Ім'я</b> ${studentName}</p>
  <p><b>Група</b> ${studentGroup}</p>
  <p><b>Факультет</b> ${studentFaculty}</p>
  <p>Твій результат: ${score} із ${quizQuestions.length} (${percent.toFixed(1)}%)</p>
    <p>${message}</p>
  `;

  saveToHistory();
}

historyButton.addEventListener("click", showHistory);

function showHistory(){
  let history = JSON.parse(localStorage.getItem("testHistory")) || [];

  if (history.length === 0){
    historyContainer.innerHTML = "<p>Історія порожня</p>";
    return;
  }

  let html = "<h2>Історія проходження тесту</h2>";

  history.forEach(item => {
    html += `
    <div class="history-item">
    <p><b>Ім'я</b> ${item.name}</p>
    <p><b>Група</b> ${item.group}</p>
    <p><b>Факультет</b> ${item.faculty}</p>
    <p><b>Результат</b> ${item.score} / ${quizQuestions.length} (${item.percent}%)</p>
    <p><b>Дата</b> ${item.date}</p>
    </div>
    `
  });

  historyContainer.innerHTML = html;
}