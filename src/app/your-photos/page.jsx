"use client";

import { PHOTO_GALLERY_ID, PHOTO_SHARE_KEY } from "@/constant";
import { useSearchParams } from "next/navigation";

const Page = () => {
  return (
    <div className="min-h-screen text-black h-full">
      <div className="section-width h-full">
        <FotoOwlEmbed />
      </div>
    </div>
  );
};

const FotoOwlEmbed = () => {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const requestKey = searchParams.get("request_key");
 

  const queryParams = new URLSearchParams();
  if (requestId) queryParams.append("request_id", requestId);
  if (requestKey) queryParams.append("request_key", requestKey);
 


  const iframeSrc = `https://site.fotoowl.ai/mumbait20league/gallery/${PHOTO_GALLERY_ID}?share_key=${PHOTO_SHARE_KEY}${queryParams.toString()}`;



  // const isDetailed = requestId && requestKey;

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-20 h-full">
      <div className={ "w-full h-screen" }>
      {/* <div className={isDetailed ? "w-full h-[600px]" : "w-full h-screen"}> */}
        <iframe
          src={iframeSrc}
          width="100%"
          height="100%"
          allow="camera; microphone"
          allowFullScreen
          // style={isDetailed ? { border: "1px solid #ccc" } : {}}
        ></iframe>
      </div>
    </div>
  );
};

export default Page;