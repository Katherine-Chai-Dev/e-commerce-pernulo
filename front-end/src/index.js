

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <GoogleOAuthProvider clientId="814518281159-jno32ktjn7f2nkmu5rqa3utmjj1gt6q9.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>

);
