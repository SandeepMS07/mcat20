"use client";

const Page = () => {
  return (
    <div className="min-h-screen text-black h-full bg-[#11102c]">
      <div className="  h-full">
        <FanCamEmbed />
      </div>
    </div>
  );
};

const FanCamEmbed = () => {
  return (
    <div className="flex flex-col items-center gap-8  py-24 h-full">
      <div className="w-full h-full">
        <iframe
          allowFullScreen
          id="fotoowl-iframe"
          src="https://events.fotoowl.ai/gallery/302394/register?embed=true&cover=true&share_key=7451"
          style={{ border: 0, height: "100vh", width: "100vw" }}
          loading="lazy"
          allow="camera"
          title="Foto Owl Gallery"
        />
      </div>
    </div>
  );
};

export default Page;
