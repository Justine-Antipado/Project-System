import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
//import Dashboard from './dashboard';
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/*<Dashboard />*/}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);