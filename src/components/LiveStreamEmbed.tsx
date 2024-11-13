// src/components/LiveStreamEmbed.tsx

import React, { useState } from "react";
import { Broadcaster } from "src/schemas/broadcaster";

interface LiveStreamEmbedProps {
  broadcaster: Broadcaster;
}

const LiveStreamEmbed: React.FC<LiveStreamEmbedProps> = ({ broadcaster }) => {
  const [hasError, setHasError] = useState(false);

  const getEmbedUrl = () => {
    switch (broadcaster.broadcasterPlatformId) {
      case 1: {
        // Twitch
        const parent =
          process.env.REACT_APP_TWITCH_PARENT || window.location.hostname;
        return `https://player.twitch.tv/?channel=${broadcaster.broadcasterExternalId}&parent=${parent}`;
      }
      case 2: // Hitbox / Smashcast
        return `https://embed.smashcast.tv/?channel=${broadcaster.broadcasterExternalId}`;
      case 3: // Viagame
        return `https://www.viagame.com/${broadcaster.broadcasterExternalId}`; // Verify URL structure
      case 4: // Azubu (Smashcast)
        return `https://embed.smashcast.tv/?channel=${broadcaster.broadcasterExternalId}`;
      case 5: // Dailymotion
        return `https://www.dailymotion.com/embed/video/${broadcaster.broadcasterExternalId}`;
      case 6: // MLG
        return `https://www.mlg.com/${broadcaster.broadcasterExternalId}`; // Verify embed availability
      case 7: // AfreecaTV
        return `https://play.afreecatv.com/embed/${broadcaster.broadcasterExternalId}`;
      case 8: // YouTube
        return `https://www.youtube.com/embed/${broadcaster.broadcasterExternalId}`;
      case 9: // Huya
        return `https://www.huya.com/embed/${broadcaster.broadcasterExternalId}`; // Verify
      case 10: // Douyu
        return `https://www.douyu.com/embed/${broadcaster.broadcasterExternalId}`; // Verify
      default:
        return null;
    }
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return <div className="text-white">Stream not available.</div>;
  }
  return (
    <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
      <iframe
        src={embedUrl}
        allowFullScreen
        title={`${broadcaster.broadcasterName} Stream`}
        className="w-full h-full rounded-lg"
        onError={() => setHasError(true)}
      ></iframe>
    </div>
  );
};

export default LiveStreamEmbed;
