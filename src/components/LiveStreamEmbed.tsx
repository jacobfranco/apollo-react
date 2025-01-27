import React, { useState } from "react";
import { Broadcaster } from "src/schemas/broadcaster";

interface LiveStreamEmbedProps {
  broadcaster: Broadcaster;
}

const LiveStreamEmbed: React.FC<LiveStreamEmbedProps> = ({ broadcaster }) => {
  const [hasError, setHasError] = useState(false);

  const getEmbedUrl = () => {
    // Extract the first broadcast if available
    const broadcast = broadcaster.broadcasts && broadcaster.broadcasts[0];
    const externalId =
      broadcast?.externalId || broadcaster.broadcasterExternalId;

    switch (broadcaster.broadcasterPlatformId) {
      case 1: {
        // Twitch
        const parent = window.location.hostname;
        return `https://player.twitch.tv/?channel=${externalId}&parent=${parent}`;
      }
      case 8: {
        // YouTube
        // Handle both video IDs and channel URLs
        return `https://www.youtube.com/embed/${externalId}?autoplay=1`;
      }
      case 2: // Hitbox / Smashcast
        return `https://embed.smashcast.tv/?channel=${externalId}`;
      case 7: // AfreecaTV
        return `https://play.afreecatv.com/${externalId}/embed`;
      case 5: // Dailymotion
        return `https://www.dailymotion.com/embed/video/${externalId}`;
      case 9: // Huya
        return `https://www.huya.com/${externalId}`;
      case 10: // Douyu
        return `https://www.douyu.com/${externalId}`;
      default:
        console.warn(
          `Unsupported platform ID: ${broadcaster.broadcasterPlatformId}`
        );
        return null;
    }
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 rounded">
        <p className="text-gray-500">Stream not available for this platform.</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 rounded">
        <p className="text-danger-500">Failed to load stream.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        onError={(e) => {
          e.stopPropagation();
          setHasError(true);
        }}
      />
    </div>
  );
};

export default LiveStreamEmbed;
