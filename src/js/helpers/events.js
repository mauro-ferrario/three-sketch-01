export const AddMultipleEvents = (element, arEvent, handler, useCapture = false) => {
  if (typeof arEvent === 'string') {
    arEvent = [arEvent]
  }
  if (!(arEvent instanceof Array)) {
    throw 'addMultipleListeners: not supported, [\'click\']';
  }
  arEvent.map((eventName) => {
    element.addEventListener(eventName, handler, useCapture);
  })
};

export const Events = {
  'transition' : {
    'transitionend' : [
      'webkitTransitionEnd'
    ]
  }
};