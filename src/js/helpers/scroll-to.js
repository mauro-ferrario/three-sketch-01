// jshint module: true

// Scroll to.
// TIP: Get element offset by element.getBoundingClientRect().top + window.PageYoffset.

// Easing function from http://goo.gl/5HLl8
const easeInOutQuad = function(t, b, c, d) {

  t /= d/2;

  if (t < 1) {
    return c/2*t*t + b
  }

  t--;

  return -c/2 * (t*(t-2) - 1) + b;
};

module.exports = (to = 0, duration = 1000, callback = function() {}, customEasing = false) => {
  const start = window.pageYOffset;
  const change = to - start;
  const increment = 20;

  let time = 0;

  function animateScroll() {

    time = (to >= 0) ? time + increment : time - increment;
    window.scrollTo(0, customEasing ? customEasing(time, start, change, duration) : easeInOutQuad(time, start, change, duration));

    if ((to > 0 && time < duration) || time < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      if (callback && typeof(callback) === 'function') {
        callback();
      }
    }
  }

  animateScroll();

};
