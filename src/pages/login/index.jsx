import React, { useEffect } from 'react';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { firebase, auth } from '../../firebase';

const LoginPage = () => {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // Handle sign-in success.
          // Return true to redirect to the `signInSuccessUrl`.
          return true;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        },
      },
      signInOptions: [
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            size: 'normal',
          },
        },
      ],
      signInSuccessUrl: '/',
      signInFlow: 'redirect',
    };
    ui.start('#firebaseui-auth-container', uiConfig);
  }, []);

  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>Please sign-in:</p>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </div>
  );
};

export default LoginPage;
