import React from "react";
import { Link } from "react-router"; // or react-router-dom depending on what was used in App.jsx (saw react-router there)

const ComingSoon = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[70vh] px-4 text-center">
            {/* Logos Layer wrapper with Pulse and Bounce Animation */}
            <div className="relative flex items-center justify-center w-40 h-40 mb-8 sm:w-56 sm:h-56">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-3xl animate-pulse"></div>

                {/* Animated bounce container for Logo */}
                <div className="relative z-10 animate-bounce duration-3000">
                    <img
                        className="dark:hidden drop-shadow-xl"
                        src="/images/logo/logo-dark.png"
                        alt="Logo"
                        width={140}
                    />
                    <img
                        className="hidden dark:block drop-shadow-xl"
                        src="/images/logo/logo-light.png"
                        alt="Logo"
                        width={140}
                    />
                </div>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white/90 sm:text-5xl">
                Coming Soon
            </h1>

            <p className="max-w-xl mx-auto mb-8 text-lg text-gray-500 dark:text-gray-400">
                We're working hard to bring you this feature. Sit tight! Awesome things are on the way. Check back later for updates.
            </p>

            <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-opacity rounded-lg bg-brand-500 hover:opacity-90 hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
            >
                Back to Home
            </Link>

            <style jsx="true">{`
        @keyframes custom-bounce {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-15%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce {
          animation: custom-bounce 3s infinite;
        }
      `}</style>
        </div>
    );
};

export default ComingSoon;
