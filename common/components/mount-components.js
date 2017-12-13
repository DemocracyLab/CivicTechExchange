import React from 'react'
import ReactDOM from 'react-dom'
import CharacterCounter from './forms/CharacterCounter.jsx'
import LinkList from './forms/LinkList.jsx'
import MainController from './controllers/MainController.jsx'
import ImageUploadFormElement from './forms/ImageUploadFormElement.jsx'

// TODO: Figure out a better way to prevent react console error where it's expecting node Environment variables
global.process = {
  env: {
      NODE_ENV: 'production'
  }
};

const APPS = {
    "CharacterCounter": CharacterCounter,
    'MainController': MainController,
    'LinkList' : LinkList,
    'ImageUploadFormElement' : ImageUploadFormElement
};

function renderElement(el) {
    var App =  APPS[el.id];
    if(App) {
        // get props from elements data attribute, like the post_id
        const props = Object.assign({}, el.dataset);
        ReactDOM.render(<App {...props} />, el);
    }
}

document
    .querySelectorAll('.__react-root')
    .forEach(renderElement)
