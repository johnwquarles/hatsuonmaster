'use strict';

import $ from 'jquery';
import keyboardJS from 'keyboardjs';

export default class Quiz {
  constructor() {
    const audioPath = './static/audio';
    const $correct = $('.stat.correct');
    const $incorrect = $('.stat.incorrect');
    const $attempts = $('.stat.attempts');

    const $nextQuestionButton = $('.next-question-button');
    const $answerButtons = $('.answer-button');
    const $listenAgainButton = $('.listen-again-button');
    const $answerSection = $('.answer-section');
    const $starsSection = $('.stars');
    const $starCounterSection = $('.next-star-counter');
    const $starCounter = $('.next-star-counter p');

    const correctDisplayText = 'Correct Answers: ';
    const incorrectDisplayText = 'Incorrect Answers: ';
    const attemptsDisplayText = 'Questions Attempted: ';

    const $emojis = $('.emoji');
    const $correctEmoji = $('.correct.emoji');
    const $incorrectEmoji = $('.incorrect.emoji');

    const nextQuestionInterval = 1000;
    const emojiFadeInterval = 750;

    let currentCorrectAnswer = null;
    let questionsAttempted = 0;
    let questionsAnsweredCorrectly = 0;
    let questionsAnsweredIncorrectly = 0;
    let questionsAnsweredCorrectlyInARow = 0;

    let waitingOnAnswer = false;
    let currentAudio = null;

    const flys = {
      answer: 'fly',
      files: [
        `${audioPath}/fly1.m4a`,
        `${audioPath}/fly2.m4a`,
        `${audioPath}/fly3.m4a`,
        `${audioPath}/fly4.m4a`,
        `${audioPath}/fly5.m4a`
      ]
    };
    const frys = {
      answer: 'fry',
      files: [
        `${audioPath}/fry1.m4a`,
        `${audioPath}/fry2.m4a`,
        `${audioPath}/fry3.m4a`,
        `${audioPath}/fry4.m4a`,
        `${audioPath}/fry5.m4a`
      ]
    };
    const plays = {
      answer: 'play',
      files: [
        `${audioPath}/play1.m4a`,
        `${audioPath}/play2.m4a`,
        `${audioPath}/play3.m4a`
      ]
    };
    const prays = {
      answer: 'pray',
      files: [
        `${audioPath}/pray1.m4a`,
        `${audioPath}/pray2.m4a`,
        `${audioPath}/pray3.m4a`
      ]
    };
    const glasses = {
      answer: 'glass',
      files: [
        `${audioPath}/glass1.m4a`,
        `${audioPath}/glass2.m4a`,
        `${audioPath}/glass3.m4a`
      ]
    };
    const grasses = {
      answer: 'grass',
      files: [
        `${audioPath}/grass1.m4a`,
        `${audioPath}/grass2.m4a`,
        `${audioPath}/grass3.m4a`
      ]
    };
    const questionSets = [
      [flys, frys],
      [plays, prays],
      [grasses, glasses]
    ];

    const correctEmojis = [
      '☜(˚▽˚)☞',
      '	( ˘⌣˘)♡(˘⌣˘ )',
      '♡(ŐωŐ人)',
      '（*’∀’人）♥',
      'ʚɞ(ू•ᴗ•ू❁)',
      '₍₍ ( ๑॔˃̶◡ ˂̶๑॓)◞♡',
      '(∗ᵒ̶̶̷̀ω˂̶́∗)੭₎₎̊₊♡',
      '(´,,•ω•,,)♡',
      '(*°∀°)=3',
      '\(⸝⸝⸝°⁻̫° ⸝⸝⸝)',
      '(*˘︶˘*).｡.:*♡',
      '°₊·ˈ∗♡( ˃̶᷇ ‧̫ ˂̶᷆ )♡∗ˈ‧₊°',
      '( ˘͈ ᵕ ˘͈♡)˚๐*˟ ♡',
      '(๑•̀ㅂ•́)و',
      '✧٩(•́⌄•́๑)',
      'ೕ(･ㅂ･ )',
      '∠( ᐛ 」∠)＿',
      'ᕕ( ᐛ )ᕗ',
      '⁽ˇ́˙̫ˇ̀˵⁾',
      '(⋆ʾ ˙̫̮ ʿ⋆)',
      '(　◠ ◡ ◠　)'
    ];

    const correctPhrases = [
      'YEP', 'OK!', 'Great!', 'That\'s right!', 'WOWOW', 'ur smart!', 'uhu~', 'SUPER!',
      'I\'m impressed!', 'fantastic!', 'o wow', '<3'
    ];

    const incorrectPhrases = [
      '...no', 'no...', 'uh-oh...', 'NOPE', 'sorry...', 'try again!', 'hmm...', 'well...', 'err...',
      'don\'t worry!', 'keep trying!', 'it\'s ok!', 'ganbare!', 'one more time!'
    ];

    const incorrectEmojis = [
      '(❁°͈▵°͈)',
      '(｡+･`ω･´)',
      '(,,#ﾟДﾟ)',
      '( >д<)',
      '( ≧Д≦)',
      '(　ﾟДﾟ)＜!!',
      '(; ･`д･´)',
      '(; ･`д･´)​',
      '( ｰ̀εｰ́ )',
      'ಠ_ಠ',
      'ఠ ͟ಠ',
      'ʕ •̀ o •́ ʔ',
      '(ಠ ∩ಠ)',
      'ヾ( ˃̶⺫˂̶｡)ノ',
      'ᕙ(⇀‸↼‶)ᕗ',
      '୧(๑•̀ᗝ•́)૭',
      'ฅ(๑*д*๑)ฅ!!',
      '໒( ᓀ ‸ ᓂ )७',
      '━(◯Δ◯∥)━ン',
      '( ⚆ _ ⚆ )'
    ]

    init();

    function init() {
      updateStats();
      $nextQuestionButton.on('click touchstart', () => {
        nextQuestion();
      });
      $answerButtons.on('click touchstart', () => {
        submitAnswer(event.target.value);
      })
      $listenAgainButton.on('click touchstart', () => {
        replayAudio();
      });
      [1,2,3,4,5,6,7,8,9].forEach(function(num) {
        num = '' + num;
        keyboardJS.bind(num, function(e) {
          try {
            submitAnswer($answerButtons[num - 1].value);
          } catch(e) {
            return;
          }
        });
      });
      keyboardJS.bind('space', function(e) {
        e.preventDefault();
        replayAudio();
      });
      keyboardJS.bind('enter', function(e) {
        nextQuestion();
      });
    }

    function replayAudio() {
      if (!currentAudio) { return; }
      currentAudio.play();
    }

    function nextQuestion() {
      waitingOnAnswer = true;
      const setToUseIndex = randomNumber(0, questionSets.length);
      const setToUse = questionSets[setToUseIndex];
      setAnswerSection(setToUse);
      const answerObjIndex = randomNumber(0, setToUse.length)
      const answerObj = setToUse[answerObjIndex];
      const fileToPlayIndex = randomNumber(0, answerObj.files.length);
      const fileToPlay = answerObj.files[fileToPlayIndex];
      currentAudio = new Audio(fileToPlay);
      currentAudio.play();
      currentCorrectAnswer = answerObj.answer;
    }

    function setAnswerSection(setToUse) {
      setToUse.forEach(function(answerObj, i) {
        $($answerButtons[i]).val(answerObj.answer);
        $($answerButtons[i]).text(answerObj.answer);
      });
      $answerSection.removeClass('hidden');
    }

    function submitAnswer(answer) {
      if (!waitingOnAnswer) { return; }
      $starCounterSection.removeClass('hidden');
      questionsAttempted++;
      if (answer === currentCorrectAnswer) {
        questionsAnsweredCorrectly++;
        questionsAnsweredCorrectlyInARow++;
        showEmoji($correctEmoji, true);
        if (questionsAnsweredCorrectlyInARow === 10) {
          addStar();
        }
      } else {
        questionsAnsweredIncorrectly++;
        showEmoji($incorrectEmoji, false);
        questionsAnsweredCorrectlyInARow = 0;
      }
      waitingOnAnswer = false;
      updateStats();
      setTimeout(nextQuestion, nextQuestionInterval);
    }

    function addStar() {
      questionsAnsweredCorrectlyInARow = 0;
      const newStar = $('<i class="fa fa-3x fa-star"></i>').hide();
      $starsSection.append(newStar);
      newStar.show(emojiFadeInterval);
    }

    function showEmoji($emoji, isCorrect) {
      const emojiSet = isCorrect ? correctEmojis: incorrectEmojis;
      const phraseSet = isCorrect ? correctPhrases: incorrectPhrases;
      const emojiIndex = randomNumber(0, emojiSet.length);
      const phraseIndex = randomNumber(0, phraseSet.length);
      $emoji.text(`${emojiSet[emojiIndex]} ${phraseSet[phraseIndex]}`);
      $emoji.fadeIn(emojiFadeInterval, () => {
        $emoji.fadeOut(emojiFadeInterval);
      });
    }

    function updateStats() {
      $attempts.text(attemptsDisplayText + questionsAttempted);
      $correct.text(correctDisplayText + questionsAnsweredCorrectly);
      $incorrect.text(incorrectDisplayText + questionsAnsweredIncorrectly);
      $starCounter.text(10 - questionsAnsweredCorrectlyInARow);
    }

    // stopIndex not included. ie, randomNumber(0, 3) will return 0, 1, or 2.
    function randomNumber(startIndex, stopIndex) {
      return Math.floor((stopIndex - startIndex) * Math.random()) + startIndex;
    }
  }
}
