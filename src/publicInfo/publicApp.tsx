import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import GetDeck from './GetDeck';

// function render() {
//   ReactDOM.render(<div><GetDeck/></div>, document.body);
// }

function render() {
  const container = document.getElementById('app');
  const root = createRoot(container);
  root.render(
    <div>
      <GetDeck />
    </div>
  );
}

render();
