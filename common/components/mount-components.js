import React from 'react'
import ReactDOM from 'react-dom'
import CharacterCounter from './forms/CharacterCounter.jsx'
import MainController from './controllers/MainController.jsx'
import LogInController from './controllers/LogInController.jsx'
import SignUpController from './controllers/SignUpController.jsx'

// TODO: Figure out a better way to prevent react console error where it's
// expecting node Environment variables
global.process = {
  env: {
    NODE_ENV: 'production'
  }
};

const APPS = {
  CharacterCounter,
  MainController,
  LogInController,
  SignUpController,
};

function renderElement(el) {
  const App =  APPS[el.id];
  if (App) {
    // get props from elements data attribute, like the post_id
    const props = Object.assign({}, el.dataset);
    ReactDOM.render(<App {...props} />, el);
  }
}

document
  .querySelectorAll('.__react-root')
  .forEach(renderElement)
