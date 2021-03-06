// When you open a new tab, it asks you to give the correct translation for a conjugated verb.
// If you get it right, it says yay
// If you get it wrong, it tells you the right thing.

function getRandomKey(dict) {
  const keys = Object.keys(dict)
  return keys[Math.floor(Math.random() * keys.length)];
}

function getRandomPromptWithAnswer(verb) {
  const key = getRandomKey(verbsPrompts[verb]);
  if (flipCoin()) {
    return {
      prompt: key,
      answer: verbsPrompts[verb][key] 
    };
  } else {
    return {
      prompt: verbsPrompts[verb][key],
      answer: key
    };
  }
}

function getRandomVerb() {
  return getRandomKey(verbsPrompts);
}

function getQuestionHTML(question) {
  console.log(question);
  return `<p>${question.prompt}</p><br><input type="text" autofocus required></input>`;
}

function setUpQuestion() {
  verb = getRandomVerb();
  question = getRandomPromptWithAnswer(verb);
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
  document.querySelector('#high-score').innerHTML = `HIGH SCORE ${localStorage.highScore}`;
  document.querySelector('#longest-streak').innerHTML = `LONGEST STREAK ${localStorage.longestStreak}`;
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
  document.querySelector('#high-score').innerHTML = `HIGH SCORE ${localStorage.highScore}`;
}

function beatHighScore() {
  const score = parseInt(localStorage.score) - parseInt(startingScore);
  return score > parseInt(localStorage.highScore);
}

function updateLongestStreak() {
  localStorage.longestStreak = streakCounter;
  document.querySelector('#longest-streak').innerHTML = `LONGEST STREAK ${localStorage.longestStreak}`;
}

function beatLongestStreak() {
  return streakCounter > parseInt(localStorage.longestStreak);
}

function flipCoin() {
  return Math.random() > 0.5;
}

document.querySelector('#phrase').addEventListener('submit', function(e) {
  e.preventDefault();
  const userInput = document.querySelector('input').value;

  if (userInput.toUpperCase().trim() == question.answer.toUpperCase()){
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

const verbsPrompts = {
  avoir: {
    'I have': "J'ai",
    'You have': 'Tu as',
    'He has': 'Il a',
    'She has': 'Elle a',
    'We have': 'Nous avons',
    "Y'all have": 'Vous avez',
    'They have (mp)': 'Ils ont',
    'They have (fp)': 'Elles ont'
  },
  aller: {
    'I go': 'Je vais',
    'You go': 'Tu vas',
    'He goes': 'Il va',
    'She goes': 'Elle va',
    'We go': 'Nous allons',
    "Y'all go": 'Vous allez',
    'They go (mp)': 'Ils vont',
    'They go (fp)': 'Elles vont'
  },
  être: {
    'I am': 'Je suis',
    'You are': 'Tu es',
    'He is': 'Il est',
    'She is': 'Elle est',
    'We are': 'Nous sommes',
    "Y'all are": 'Vous êtes',
    'They are (mp)': 'Ils sont',
    'They are (fp)': 'Elles sont',
  }
}

const possessivePrompts = {
  'mon ma mes': {
    'père': 'mon',
    'mère': 'ma',
    'amies': 'mes',
    'amis': 'mon'
  },
  'ton ta tes': {
    'parents': 'tes',
    'amis': 'ton',
    'frère': 'ton',
    'soeurs': 'tes'
  },
  'son sa ses': {
    'devoirs': '',
    'professeur': '',
    'amis': '',
    'amies': ''
  },
  'notre nos': {},
  'votre vos': {},
  'leur leurs': {}
}

console.log(verbsPrompts);

let question, questionHTML, lastAnswerTimeStamp, startingScore, streakCounter;
startGame();

// TODO:
// Add current points and score above game
// Refactor end of game streak and high score
// Think of how the prompts data structure will need to change to add more functionality, like:
// - new verbs
// - switching the question and the answer around