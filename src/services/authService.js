/**
 * Real OAuth Authentication Service for LoanSathi
 */

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'https://loansathi-app.vercel.app';

/**
 * Initialize Google OAuth
 */
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    // Load Google Identity Services script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          resolve(window.google);
        } else {
          reject(new Error('Google Identity Services failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    } else {
      resolve(window.google);
    }
  });
};

/**
 * Google OAuth Login
 */
export const loginWithGoogle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if we have a client ID
      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your_google_client_id_here.apps.googleusercontent.com') {
        // Fallback to demo mode if no client ID is configured
        console.warn('Google Client ID not configured, using demo mode');
        setTimeout(() => {
          resolve({
            id: 'google_demo_' + Date.now(),
            name: 'Demo User (Google)',
            email: 'demo@gmail.com',
            provider: 'google',
            avatar: 'https://via.placeholder.com/40/4285f4/ffffff?text=G',
            loginTime: new Date().toISOString(),
            isDemo: true
          });
        }, 1500);
        return;
      }

      // Initialize Google Auth
      await initializeGoogleAuth();

      // Configure Google OAuth
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          try {
            // Decode the JWT token
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            const userData = {
              id: 'google_' + payload.sub,
              name: payload.name,
              email: payload.email,
              provider: 'google',
              avatar: payload.picture,
              loginTime: new Date().toISOString(),
              isDemo: false
            };
            
            resolve(userData);
          } catch (error) {
            reject(new Error('Failed to process Google login response'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Show the Google One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup if One Tap is not available
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              width: '100%'
            }
          );
        }
      });

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Apple OAuth Login
 */
export const loginWithApple = () => {
  return new Promise((resolve, reject) => {
    // Check if we have Apple client ID
    if (!APPLE_CLIENT_ID || APPLE_CLIENT_ID === 'your.apple.service.id') {
      // Fallback to demo mode if no client ID is configured
      console.warn('Apple Client ID not configured, using demo mode');
      setTimeout(() => {
        resolve({
          id: 'apple_demo_' + Date.now(),
          name: 'Demo User (Apple)',
          email: 'demo@icloud.com',
          provider: 'apple',
          avatar: 'https://via.placeholder.com/40/000000/ffffff?text=🍎',
          loginTime: new Date().toISOString(),
          isDemo: true
        });
      }, 1500);
      return;
    }

    // Real Apple Sign-In implementation
    try {
      // Load Apple Sign-In script if not already loaded
      if (!window.AppleID) {
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.async = true;
        script.onload = () => {
          initAppleSignIn();
        };
        document.head.appendChild(script);
      } else {
        initAppleSignIn();
      }

      function initAppleSignIn() {
        window.AppleID.auth.init({
          clientId: APPLE_CLIENT_ID,
          scope: 'name email',
          redirectURI: REDIRECT_URI,
          state: 'apple_login_' + Date.now(),
          usePopup: true
        });

        window.AppleID.auth.signIn().then((response) => {
          // Process Apple response
          const userData = {
            id: 'apple_' + response.user,
            name: response.user.name ? `${response.user.name.firstName} ${response.user.name.lastName}` : 'Apple User',
            email: response.user.email || 'user@privaterelay.appleid.com',
            provider: 'apple',
            avatar: 'https://via.placeholder.com/40/000000/ffffff?text=🍎',
            loginTime: new Date().toISOString(),
            isDemo: false
          };
          
          resolve(userData);
        }).catch((error) => {
          reject(new Error('Apple Sign-In failed: ' + error.message));
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Check if OAuth is properly configured
 */
export const isOAuthConfigured = () => {
  return {
    google: GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your_google_client_id_here.apps.googleusercontent.com',
    apple: APPLE_CLIENT_ID && APPLE_CLIENT_ID !== 'your.apple.service.id'
  };
};
