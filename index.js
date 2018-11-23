require ("./src/css/all.scss");
import initializeComponents from './src/js/libs/fabrique/component-loader';

if (document.documentMode) {
  console.log('Hello, Internet Explorer.');
}

document.addEventListener('DOMContentLoaded', (event) => {
  initializeComponents(event.target);
  if(!("ontouchstart" in document.documentElement)){
    document.body.classList.add('no-touch');
  }
});