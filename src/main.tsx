import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; 
import { store } from './store'; 
import 'src/styles/tailwind.css';
import 'src/styles/Theme.css';
import 'src/styles/assets/Fonts.css';
import AppRouter from './Router';

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap your app with Provider */}
      <AppRouter />
    </Provider>
  </React.StrictMode>
);
