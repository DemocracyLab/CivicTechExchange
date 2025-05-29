// @flow

import React from "react";
import ReactDOM from "react-dom";
import CharacterCounter from "./forms/CharacterCounter.jsx";
import LinkList from "./forms/LinkList.jsx";
import FileUploadList from "./forms/FileUploadList.jsx";
import MainController from "./controllers/MainController.jsx";
import CreateProjectController from "./controllers/CreateProjectController.jsx";
import LogInController from "./controllers/LogInController.jsx";
import SignUpErrorAdapter from "./componentsBySection/signUp/SignUpErrorAdapter.jsx";

// TODO: Figure out a better way to prevent react console error where it's
// expecting node Environment variables
window.process = {
  env: {
    NODE_ENV: "production",
  },
};

const APPS = {
  CreateProjectController,
  CharacterCounter,
  MainController,
  LogInController,
  SignUpErrorAdapter,
};

function renderElement(el) {
  const App = APPS[el.id];
  if (App) {
    // get props from elements data attribute, like the post_id
    const props = Object.assign({}, el.dataset);
    ReactDOM.render(<App {...props} />, el);
  }
}

document.querySelectorAll(".__react-root").forEach(renderElement);
