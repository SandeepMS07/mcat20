import { useEffect } from "react";

const InstagramEmbed = () => {
  useEffect(() => {
    const loadInstagramScript = () => {
      // If not already loaded
      if (!window.instgrm) {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        };
      } else {
        // If already loaded
        window.instgrm.Embeds.process();
      }
    };

    loadInstagramScript();
  }, []);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink="https://www.instagram.com/reel/DKovUKKhr7F/"
      data-instgrm-version="14"
      style={{
        background: "#fff",
        border: 0,
        margin: "1rem auto",
        padding: 0,
        width: "100%",
        maxWidth: "540px",
        minHeight: "400px", // space reserved for embed
      }}
    ></blockquote>
  );
};

export default InstagramEmbed;
