// When you open a new tab, it asks you to give the correct translation for a conjugated verb.
// If you get it right, it says yay
// If you get it wrong, it tells you the right thing.

function getRandomKey() {
  const keys = Object.keys(prompts)
  return keys[Math.floor(Math.random() * keys.length)];
}

function getRandomPromptWithAnswer() {
  const key = getRandomKey();
  return {
    prompt: key,
    answer: prompts[key] 
  };
}

function getQuestionHTML(question) {
  return `<p>${question.prompt}</p><br><input type="text" autofocus required></input>`;
}

function setUpQuestion() {
  question = getRandomPromptWithAnswer();
  questionHTML = getQuestionHTML(question);
  document.getElementById('phrase').innerHTML = questionHTML;
  lastAnswerTimeStamp = Date.now();
  document.querySelector('input').focus();
}

function initializeScoreAndStats() {
  localStorage.score = localStorage.score || 0;
  localStorage.highScore = localStorage.highScore || 0;
  localStorage.longestStreak = localStorage.longestStreak || 0;
  streakCounter = 0;
  document.querySelector('#score').innerHTML = localStorage.score;  
}

function startGame() {
  startingScore = localStorage.score;
  initializeScoreAndStats();
  setUpQuestion();
}

function updateScoreAndStats() {
  const points = Math.max(5 - Math.round((Date.now() - lastAnswerTimeStamp) /1000), 1);
  streakCounter++;
  localStorage.score = parseInt(localStorage.score) + points;
  document.querySelector('#score').innerHTML = localStorage.score;
}

function getGameOverHTML(userInput) {
  return `<p>${question.prompt}</p><p class="incorrect">${userInput}</p><p class="correct">${question.answer}</p>`
}

function congratulateUserScore() {
  const p = document.createElement('p');
  const parent = document.querySelector('#hurray');
  p.innerHTML = `You got ${localStorage.highScore} points! New high score!`;
  parent.appendChild(p);
}

function congratulateUserStreak() {
  const p = document.createElement('p');
  const parent = document.querySelector('#hurray');
  p.innerHTML = `You beat your longest streak by ${streakCounter - parseInt(localStorage.longestStreak)} words!`;
  parent.appendChild(p);
}

function consoleUser() {
  const p = document.createElement('p');
  const parent = document.querySelector('#hurray');
  p.innerHTML = `You got ${parseInt(localStorage.score) - parseInt(startingScore)} points. Not bad!`;
  parent.appendChild(p);
}

function updateHighScore() {
  localStorage.highScore = parseInt(localStorage.score) - parseInt(startingScore);
}

function beatHighScore() {
  const score = parseInt(localStorage.score) - parseInt(startingScore);
  return score > parseInt(localStorage.highScore);
}

function updateLongestStreak() {
  localStorage.longestStreak = streakCounter;
}

function beatLongestStreak() {
  return streakCounter > parseInt(localStorage.longestStreak);
}

document.querySelector('#phrase').addEventListener('submit', function(e) {
  e.preventDefault();
  const userInput = document.querySelector('input').value;

  if (userInput.toUpperCase() == question.answer.toUpperCase()){
    document.querySelector('input').innerHTML = '';
    updateScoreAndStats();
    setUpQuestion();
  } else {
    document.querySelector('#phrase').innerHTML = getGameOverHTML(userInput);
    if (beatHighScore() || beatLongestStreak()) {
      if (beatHighScore()) {
        updateHighScore();
        congratulateUserScore();
      }
      if (beatLongestStreak()) {
        congratulateUserStreak();
        updateLongestStreak();
      } 
    } else { 
      consoleUser();
    }
  }
})

const prompts = {
  'I have': "J'ai",
  'You have': 'Tu as',
  'He has': 'Il a',
  'She has': 'Elle a',
  'We have': 'Nous avons',
  "Y'all have": 'Vous avez',
  'They have (masc. plural)': 'Ils ont',
  'They have (fem. plural)': 'Elles ont'
}

let question, questionHTML, lastAnswerTimeStamp, startingScore, streakCounter;
startGame();