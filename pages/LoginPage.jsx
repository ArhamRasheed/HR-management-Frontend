import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { clearAuthFeedback, loginUser } from "../src/store/slices/authSlice";
import { getDefaultRoute } from "../src/utils/navigationHelpers";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, isAuthenticated, statusMessage, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      const target = getDefaultRoute(user?.department);
      const redirectTimer = setTimeout(() => {
        navigate(target, { replace: true });
      }, 650);
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, navigate, user?.department]);

  const handleLogin = (event) => {
    event.preventDefault();
    const email = emailRef.current?.value.trim() || "";
    const password = passwordRef.current?.value || "";
    if (!email || !password) {
      return;
    }

    dispatch(
      loginUser({
        email,
        password,
      })
    );
  };

  const resetFeedback = () => {
    if (error || statusMessage) {
      dispatch(clearAuthFeedback());
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-6 py-4 overflow-hidden">
        <div className="w-full max-w-md flex flex-col h-full">
          <div className="text-center mb-4 mt-4 flex-shrink-0">
            <div className="inline-block p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-3">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              Welcome Back
            </h1>

            <p className="text-base text-gray-600 mt-1">
              Sign in to your HR Management System
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 overflow-y-auto flex-grow">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {statusMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg flex gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-800 text-sm">{statusMessage}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    type="email"
                    required
                    ref={emailRef}
                    onChange={resetFeedback}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3 py-2.5 text-base border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    ref={passwordRef}
                    onChange={resetFeedback}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-base border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-black"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg 
                text-base font-bold shadow-md hover:shadow-lg transition-all duration-300 ease-out 
                hover:scale-[1.02] hover:-translate-y-[2px] disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex gap-2 justify-center items-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-gray-500 text-xs">🔒 Secure HR Personnel Access Only</p>
          </div>

          <p className="mt-4 text-center text-gray-600 text-xs flex-shrink-0">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-10 relative overflow-y-auto">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-white max-w-lg my-auto space-y-6">
          <h2 className="text-3xl font-black">HR Management System</h2>

          <p className="text-lg text-emerald-100">
            Streamline your workforce, empower your people
          </p>

          <Feature
            title="Secure & Reliable"
            text="Enterprise-grade security for your sensitive HR data"
            iconPath="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z"
          />

          <Feature
            title="Lightning Fast"
            text="Process payroll, leaves, and attendance in seconds"
            iconPath="M13 10V3L4 14h7v7l9-11h-7z"
          />

          <Feature
            title="Smart Analytics"
            text="Data-driven insights for better decision making"
            iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ title, text, iconPath }) => (
  <div className="flex items-start gap-3">
    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
    </div>
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-emerald-100 text-sm">{text}</p>
    </div>
  </div>
);

export default LoginPage;

