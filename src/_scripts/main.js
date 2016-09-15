// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';
import Quiz from '../_modules/quiz/quiz';

$(() => {
  new Quiz();
});
