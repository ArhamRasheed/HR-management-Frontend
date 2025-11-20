const messages = {
  default: "Securing your session...",
  verifying: "Verifying your access...",
};

/**
 * Branded loading view for auth-bound flows.
 *
 * @param {{ message?: keyof typeof messages | string }} props
 */
export default function AppLoader({ message = "default" }) {
  const resolvedMessage = messages[message] || message || messages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="bg-white/80 px-10 py-8 rounded-3xl shadow-xl backdrop-blur">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm font-semibold text-emerald-800 tracking-wide uppercase text-center">
          {resolvedMessage}
        </p>
      </div>
    </div>
  );
}


