import { EventEmitter } from 'events';

const BUS = new EventEmitter();

export default function initialize(container) {
  BUS.emit('controllers:initializing');

  // Initialize all controllers defined on nodes
  Array.from(container.querySelectorAll(
    '[data-controller]:not([data-initialized])'),
  ).map((el) => {
    el.dataset.initialized = true; // eslint-disable-line no-param-reassign

    // Allow multiple controllers with whitespace between
    el.__controllers__ = {}; // eslint-disable-line no-param-reassign
    [...el.dataset.controller.trim().replace(/\s+/, ' ').trim().split(' ')].filter(c => c).forEach((controller) => {
      const Controller = require(`../../controllers/${controller}.js`).default; // eslint-disable-line
      el.__controllers__[controller] = new Controller( // eslint-disable-line no-param-reassign
        el, BUS);
      el.getController = name => el.__controllers__[name]; // eslint-disable-line no-param-reassign
      
    });

    return el.__controllers__;
  });

 // BUS.emit('controllers:initialized');
}

