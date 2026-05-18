import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
//import App from './App';
//import Dashboard from './dashboard';
import AdminAuth from './AdminAuth';
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <App /> <Dashboard />*/}
      <AdminAuth />
    </BrowserRouter>
  </React.StrictMode>
); 