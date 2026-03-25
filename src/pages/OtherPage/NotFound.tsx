import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Lottie from "lottie-react";
import lottieData from "../../lottie/404out.json";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="Out Admin | 404 Not Found"
        description="Out Admin | 404 Not Found"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1 bg-white dark:bg-gray-900">
        <GridShape />
        <div className="mx-auto w-full max-w-[800px] text-center flex flex-col items-center justify-center">

          <div className="w-full flex justify-center items-center mb-6">
            <Lottie
              animationData={lottieData}
              loop={true}
              className="w-full max-w-[600px] h-auto object-cover"
            />
          </div>

          <h1 className="mb-4 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            Oops! Page Not Found
          </h1>

          <p className="mb-8 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            We can’t seem to find the page you are looking for!
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-brand-500 px-8 py-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition-all duration-300 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            Back to Home Page
          </Link>
        </div>
        {/* <!-- Footer --> */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - Out Admin
        </p>
      </div>
    </>
  );
}
