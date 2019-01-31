import { Component, createElement, render } from './didact.js';
import App from './build/App.js';

render(createElement(App, null), document.getElementById('mount'));
