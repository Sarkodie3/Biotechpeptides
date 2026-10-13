'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function MyAccountContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('biotech_auth') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // States
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!usernameOrEmail || !password) {
      setError('Please provide both username and password.');
      return;
    }

    // Simulated secure session
    setLoggedInUser(usernameOrEmail);
    setNotice('Welcome back to your research account dashboard.');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!regUsername || !regEmail || !regPassword) {
      setError('All registration fields are required.');
      return;
    }

    setLoggedInUser(regUsername);
    setNotice('Account successfully created! You are now logged in.');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setNotice('You have been logged out.');
  };

  if (loggedInUser) {
    return (
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl font-black uppercase text-gray-900 mb-6 border-b border-gray-200 pb-4">
          My Account
        </h1>

        {notice && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 text-[14px]">
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2 border-r border-gray-200 pr-4">
            <div className="p-3 bg-gray-100 font-bold text-[#0c71c3] text-[14px]">
              Dashboard
            </div>
            <div className="p-3 hover:bg-gray-50 text-gray-700 text-[14px] cursor-pointer">
              Orders
            </div>
            <div className="p-3 hover:bg-gray-50 text-gray-700 text-[14px] cursor-pointer">
              Addresses
            </div>
            <div className="p-3 hover:bg-gray-50 text-gray-700 text-[14px] cursor-pointer">
              Account details
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left p-3 hover:bg-red-50 text-red-600 font-semibold text-[14px] cursor-pointer"
            >
              Log out
            </button>
          </div>

          <div className="md:col-span-3 space-y-4 text-[14px] text-gray-700 leading-relaxed">
            <p>
              Hello <strong>{loggedInUser}</strong> (not <strong>{loggedInUser}</strong>?{' '}
              <button type="button" onClick={handleLogout} className="text-[#0c71c3] underline">
                Sign out
              </button>
              )
            </p>
            <p>
              From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-black uppercase text-gray-900 mb-8 text-center">
        My Account
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-[14px]">
          {error}
        </div>
      )}

      {notice && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 text-[14px]">
          {notice}
        </div>
      )}

      <div className="bg-white border border-gray-200 p-8 shadow-xs">
        {mode === 'login' ? (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-900 mb-6 pb-2 border-b border-gray-100">
              Login
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Username or Email *
                </label>
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
                />
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>

                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered address.'); }} className="text-[#0c71c3] hover:underline">
                  Forgot password?
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0c71c3] hover:bg-[#0a5ea3] text-white font-bold uppercase text-[14px] tracking-wider transition-colors cursor-pointer"
                >
                  LOGIN
                </button>
              </div>

              <div className="text-center pt-4 border-t border-gray-100 text-[13px] text-gray-600">
                Not a member yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#0c71c3] font-bold underline cursor-pointer"
                >
                  Register now.
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-900 mb-6 pb-2 border-b border-gray-100">
              Register
            </h2>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0c71c3] hover:bg-[#0a5ea3] text-white font-bold uppercase text-[14px] tracking-wider transition-colors cursor-pointer"
                >
                  REGISTER
                </button>
              </div>

              <div className="text-center pt-4 border-t border-gray-100 text-[13px] text-gray-600">
                Already a member?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#0c71c3] font-bold underline cursor-pointer"
                >
                  Log in.
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[700px] mx-auto px-4 md:px-8 py-20 text-center text-gray-500">
          Loading account...
        </div>
      }
    >
      <MyAccountContent />
    </Suspense>
  );
}
