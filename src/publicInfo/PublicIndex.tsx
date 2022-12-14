import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';

function render() {
  const container = document.getElementById('app');
  const root = createRoot(container);

  root.render(
    <div>
      <App />
    </div>
  );
}

render();
