// src/features/StreamModal.tsx

import React, { useState } from "react";
import { Broadcaster } from "src/schemas/broadcaster";
import LiveStreamEmbed from "src/components/LiveStreamEmbed";

interface StreamModalProps {
  broadcasters: Broadcaster[];
  onClose: () => void;
}

const StreamModal: React.FC<StreamModalProps> = ({ broadcasters, onClose }) => {
  console.log("StreamModal - Mounted with broadcasters:", broadcasters);

  const [selectedBroadcaster, setSelectedBroadcaster] = useState<Broadcaster>(
    broadcasters[0]
  );
  const [hasSwitchError, setHasSwitchError] = useState(false);

  const openInNewWindow = () => {
    const url = getStreamUrl(selectedBroadcaster);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const getStreamUrl = (broadcaster: Broadcaster): string | null => {
    switch (broadcaster.broadcasterPlatformId) {
      case 1: // Twitch
        return `https://www.twitch.tv/${broadcaster.broadcasterExternalId}`;
      case 2: // Hitbox / Smashcast
        return `https://www.smashcast.tv/${broadcaster.broadcasterExternalId}`;
      case 3: // Viagame
        return `https://www.viagame.com/${broadcaster.broadcasterExternalId}`; // Verify URL structure
      case 4: // Azubu (Smashcast)
        return `https://www.smashcast.tv/${broadcaster.broadcasterExternalId}`;
      case 5: // Dailymotion
        return `https://www.dailymotion.com/video/${broadcaster.broadcasterExternalId}`;
      case 6: // MLG
        return `https://www.mlg.com/${broadcaster.broadcasterExternalId}`; // Verify embed availability
      case 7: // AfreecaTV
        return `https://play.afreecatv.com/${broadcaster.broadcasterExternalId}`;
      case 8: // YouTube
        return `https://www.youtube.com/watch?v=${broadcaster.broadcasterExternalId}`;
      case 9: // Huya
        return `https://www.huya.com/${broadcaster.broadcasterExternalId}`;
      case 10: // Douyu
        return `https://www.douyu.com/${broadcaster.broadcasterExternalId}`;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 max-w-5xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
          aria-label="Close Stream"
        >
          &times;
        </button>

        {/* Broadcaster Selection */}
        {broadcasters.length > 1 && (
          <div className="flex justify-center space-x-4 mb-6 overflow-x-auto">
            {broadcasters.map((broadcaster) => (
              <button
                key={broadcaster.broadcasterId}
                onClick={() => {
                  try {
                    setSelectedBroadcaster(broadcaster);
                    setHasSwitchError(false);
                  } catch (error) {
                    console.error("Error switching broadcaster:", error);
                    setHasSwitchError(true);
                  }
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center transition-colors ${
                  selectedBroadcaster.broadcasterId ===
                  broadcaster.broadcasterId
                    ? `bg-[#${broadcaster.color}]`
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                aria-label={`Switch to ${broadcaster.broadcasterName}`}
              >
                <img
                  src={""} // TODO: Platform logo
                  alt={broadcaster.broadcasterName}
                  className="w-8 h-8 mr-2 rounded-full"
                />
                <span className="text-white">
                  {broadcaster.broadcasterName}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Error Message on Broadcaster Switch Failure */}
        {hasSwitchError && (
          <div className="text-red-500 mb-4 text-center">
            Failed to switch broadcaster. Please try again.
          </div>
        )}

        {/* Live Stream Embed */}
        <div className="aspect-w-16 aspect-h-9 mb-6">
          <LiveStreamEmbed broadcaster={selectedBroadcaster} />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-between">
          <button
            onClick={openInNewWindow}
            className="px-6 py-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 focus:outline-none"
            aria-label="Open Stream in New Window"
            title="Opens the stream in a new window/tab"
          >
            Open in New Window
          </button>
          {/* Add more controls if needed */}
        </div>
      </div>
    </div>
  );
};

export default StreamModal;
