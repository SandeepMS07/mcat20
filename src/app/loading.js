"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Animation } from "./assets";

export default function LoadingPage() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showLoading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#101b52] fixed left-0 top-0 z-[1000] w-full">
      <Lottie animationData={Animation} loop autoplay />
    </div>
  );
}

// "use client";
// import Lottie from "lottie-react";
// import { Animation } from "./assets";

// export default function LoadingPage() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white">
//       {/* <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mb-4"></div> */}
//       <Lottie animationData={Animation} loop autoplay />
//       {/* <p className="text-lg text-gray-600">Loading, please wait...</p> */}
//     </div>
//   );
// }
