// 1. 문제 데이터 — 배열 안에 객체(object)들을 담아 관리합니다.
const questions = [
  {
    q: "'바이브코딩(Vibe Coding)'이라는 용어를 처음 소개한 사람은 누구일까요?",
    options: ["안드레 카파시", "리누스 토르발스", "팀 버너스리", "브렌던 아이크"],
    answer: 0,
  },
  {
    q: "바이브코딩에서 가장 중요한 사람의 역할은 무엇일까요?",
    options: ["모든 코드를 직접 타이핑하기", "AI가 만든 코드를 검토하고 판단하기", "AI를 아예 쓰지 않기", "디자인만 담당하기"],
    answer: 1,
  },
  {
    q: "LLM 위키에서 'raw' 폴더의 규칙은 무엇일까요?",
    options: ["매일 비우기", "AI가 자유롭게 수정", "절대 수정하지 않기", "이미지만 저장"],
    answer: 2,
  },
  {
    q: "Git에서 'commit'은 무엇을 하는 행위일까요?",
    options: ["파일 삭제", "인터넷에 업로드", "변경 사항을 스냅샷으로 확정 기록", "새 폴더 생성"],
    answer: 2,
  },
  {
    q: "HTML과 CSS의 관계를 가장 잘 설명한 것은?",
    options: ["같은 언어의 다른 이름", "HTML=내용, CSS=디자인으로 역할 분리", "CSS가 HTML을 대체함", "관계 없음"],
    answer: 1,
  },
  {
    q: "Git과 GitHub의 차이로 옳은 것은?",
    options: ["둘은 완전히 같다", "Git=온라인 서비스, GitHub=로컬 도구", "Git=로컬 버전관리 도구, GitHub=온라인 공유 서비스", "GitHub이 있어야 Git을 쓸 수 있다"],
    answer: 2,
  },
  {
    q: "RAG(검색 증강 생성)가 하는 일은 무엇일까요?",
    options: ["AI 모델을 처음부터 학습시킴", "질문과 관련된 문서를 검색해 답변에 활용", "이미지를 생성함", "코드를 자동으로 배포함"],
    answer: 1,
  },
  {
    q: "VS Code의 내장 터미널을 여는 단축키는?",
    options: ["Ctrl + S", "Ctrl + `", "Ctrl + P", "Ctrl + Shift + E"],
    answer: 1,
  },
];

// 2. 현재 상태를 기억하는 변수들
let currentIndex = 0;
let score = 0;
let answered = false;

// 3. 화면의 요소들을 미리 찾아서 변수에 저장 (매번 찾지 않도록)
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const progressLabel = document.getElementById("progress-label");
const progressFill = document.getElementById("progress-fill");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const restartBtn = document.getElementById("restart-btn");

// 4. 현재 문제를 화면에 그리는 함수
function renderQuestion() {
  answered = false;
  const current = questions[currentIndex];

  questionText.textContent = current.q;
  feedback.textContent = "";
  nextBtn.disabled = true;

  progressLabel.textContent = `${currentIndex + 1} / ${questions.length}`;
  progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

  optionsBox.innerHTML = "";
  current.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => checkAnswer(index, btn));
    optionsBox.appendChild(btn);
  });
}

// 5. 클릭한 답이 맞는지 확인하는 함수
function checkAnswer(selectedIndex, clickedBtn) {
  if (answered) return; // 이미 답했으면 무시
  answered = true;

  const current = questions[currentIndex];
  const buttons = optionsBox.querySelectorAll(".option-btn");
  buttons.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === current.answer) {
    clickedBtn.classList.add("correct");
    feedback.textContent = "정답입니다!";
    score++;
  } else {
    clickedBtn.classList.add("wrong");
    buttons[current.answer].classList.add("correct");
    feedback.textContent = "아쉬워요, 정답은 표시된 곳입니다.";
  }

  nextBtn.disabled = false;
}

// 6. "다음 문제" 버튼 클릭 처리
nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

// 7. 최종 결과 화면 보여주기
function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  document.getElementById("result-score").textContent = `${score} / ${questions.length}`;

  const message = document.getElementById("result-message");
  if (score === questions.length) {
    message.textContent = "완벽해요! 오늘 배운 내용을 정확히 이해하셨네요.";
  } else if (score >= questions.length / 2) {
    message.textContent = "잘하셨어요! 조금만 더 복습하면 완벽할 것 같아요.";
  } else {
    message.textContent = "괜찮아요, 대화를 다시 훑어보고 재도전해보세요.";
  }

  // localStorage: 브라우저에 최고 점수를 저장해서, 다시 열어도 기억하게 함
  const bestScore = localStorage.getItem("vibeQuizBest") || 0;
  if (score > bestScore) {
    localStorage.setItem("vibeQuizBest", score);
  }
  const best = localStorage.getItem("vibeQuizBest");
  document.getElementById("best-score").textContent = `최고 기록: ${best} / ${questions.length}`;
}

// 8. "다시 풀기" 버튼 클릭 처리
restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  score = 0;
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  renderQuestion();
});

// 9. 페이지가 처음 열릴 때 첫 문제 표시
renderQuestion();