import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Calculator, Shield, Users, TrendingUp, Lock, AlertCircle } from 'lucide-react';
import { loginWithGoogle, loginWithApple, isOAuthConfigured } from '../../services/authService';

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [oauthConfig, setOauthConfig] = useState({ google: false, apple: false });

  useEffect(() => {
    // Check OAuth configuration
    setOauthConfig(isOAuthConfigured());
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const userData = await loginWithGoogle();
      login(userData);
    } catch (error) {
      console.error('Google login failed:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const userData = await loginWithApple();
      login(userData);
    } catch (error) {
      console.error('Apple login failed:', error);
      setError('Apple login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">LoanSathi</h1>
          </div>
          <p className="text-gray-600">Smart Loan Calculator for India</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your loan calculators</p>
          </div>

          {/* OAuth Configuration Notice */}
          {(!oauthConfig.google && !oauthConfig.apple) && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-amber-800 font-medium">Demo Mode Active</p>
                  <p className="text-amber-700 mt-1">
                    OAuth not configured. Using demo authentication for testing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Login Buttons */}
          <div className="space-y-4">
            {/* Google Login */}
            <div>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
              
              {/* Hidden div for Google Sign-In button (fallback) */}
              <div id="google-signin-button" className="hidden"></div>
              
              {!oauthConfig.google && (
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {oauthConfig.google ? 'Real Google OAuth' : 'Demo mode - no real authentication'}
                </p>
              )}
            </div>

            {/* Apple Login */}
            <div>
              <button
                onClick={handleAppleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-900 rounded-lg shadow-sm bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continue with Apple
                  </>
                )}
              </button>
              
              {!oauthConfig.apple && (
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {oauthConfig.apple ? 'Real Apple OAuth' : 'Demo mode - no real authentication'}
                </p>
              )}
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-4">What you'll get access to:</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calculator className="h-4 w-4 mr-2 text-primary-500" />
                EMI Calculator
              </div>
              <div className="flex items-center text-gray-600">
                <TrendingUp className="h-4 w-4 mr-2 text-primary-500" />
                Borrowing Capacity
              </div>
              <div className="flex items-center text-gray-600">
                <Shield className="h-4 w-4 mr-2 text-primary-500" />
                Prepayment Benefits
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2 text-primary-500" />
                Secure & Private
              </div>
            </div>
          </div>

          {/* OAuth Setup Instructions */}
          {(!oauthConfig.google && !oauthConfig.apple) && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">Want Real OAuth?</p>
              <p className="text-xs text-blue-700">
                Configure Google/Apple OAuth credentials in your environment variables to enable real authentication.
              </p>
            </div>
          )}

          {/* Terms */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            Your data is secure and never shared with third parties.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Made with ❤️ for Indian borrowers
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
