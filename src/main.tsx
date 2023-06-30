import React from 'react'
import App from './App.tsx'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SpinnerContext from './context/SpinnerContext.tsx';
import AuthContext from './context/AuthContext.tsx';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContext>
        <SpinnerContext>
          <App />
        </SpinnerContext>
      </AuthContext>
      <ToastContainer position='bottom-right' closeButton draggable={false} hideProgressBar autoClose={2000} />
    </BrowserRouter>
  </React.StrictMode>,
)
