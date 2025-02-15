let currentQuestionIndex = 0;
let questions = [];

// Загрузка вопросов из JSON-файла
fetch('words.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        showQuestion();
    })
    .catch(error => console.error('Ошибка загрузки вопросов:', error));

// Функция для отображения вопроса
function showQuestion() {
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const resultText = document.getElementById('result-text');

    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question;
        answerInput.value = '';
        resultText.textContent = '';
    } else {
        questionText.textContent = 'Тест завершен!';
        answerInput.style.display = 'none';
        document.getElementById('check-answer').style.display = 'none';
        document.getElementById('speak-question').style.display = 'none';
        document.getElementById('next-question').style.display = 'none';
    }
}

// Функция для проверки ответа
document.getElementById('check-answer').addEventListener('click', () => {
    const answerInput = document.getElementById('answer-input');
    const resultText = document.getElementById('result-text');
    const question = questions[currentQuestionIndex];

    if (answerInput.value.toLowerCase() === question.answer.toLowerCase()) {
        resultText.textContent = 'Правильно!';
        resultText.style.color = 'green';
    } else {
        resultText.textContent = `Неправильно. Правильный ответ: ${question.answer}`;
        resultText.style.color = 'red';
    }
});

// Функция для озвучки вопроса
document.getElementById('speak-question').addEventListener('click', () => {
    const question = questions[currentQuestionIndex];
    speakText(question.question);
});

// Функция для перехода к следующему вопросу
document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    showQuestion();
});

// Функция для озвучки текста
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Female'));

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        } else {
            console.warn('Женский английский голос не найден. Будет использован голос по умолчанию.');
        }

        utterance.rate = 0.8;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    } else {
        alert('Ваш браузер не поддерживает озвучку текста.');
    }
}
