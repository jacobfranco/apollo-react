import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { fetchPlayerById } from "src/actions/players";
import {
  selectPlayerById,
  selectPlayersLoading,
  selectPlayersError,
} from "src/selectors";
import { Column } from "src/components/Column";
import { Card, CardBody, CardHeader, CardTitle } from "src/components/Card";

type PlayerDetailParams = {
  esportName: string;
  playerId: string;
};

const PlayerDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName, playerId } = useParams<PlayerDetailParams>();
  const playerIdNumber = Number(playerId);

  const player = useAppSelector((state) =>
    selectPlayerById(state, playerIdNumber)
  );
  const loading = useAppSelector((state) => selectPlayersLoading(state));
  const error = useAppSelector((state) => selectPlayersError(state));

  React.useEffect(() => {
    if (!player && !loading) {
      dispatch(fetchPlayerById(esportName, playerIdNumber));
    }
  }, [dispatch, player, loading, esportName, playerIdNumber]);

  if (loading || !player) {
    return <div className="p-4">Loading player data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <Column
      label=""
      backHref={`/${esportName}/players`}
      className="max-w-6xl mx-auto"
    >
      <div className="space-y-6 p-4">
        {/* Player Info Card */}
        <Card>
          <CardBody className="bg-primary-200 dark:bg-secondary-500 rounded-md">
            <div className="flex items-start">
              {/* Player Image */}
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={player.images?.[0]?.url}
                  alt={`${player.nickName} image`}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Info */}
              <div className="flex flex-col space-y-2 ml-4 flex-1">
                <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {player.nickName}
                </div>
                {/* Role */}
                {player.role && (
                  <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Role: {player.role}
                  </div>
                )}
                {/* Real Name */}
                <div className="text-gray-600 dark:text-gray-400">
                  {player.firstName} {player.lastName}
                </div>
                {/* Age */}
                {player.age && (
                  <div className="text-gray-600 dark:text-gray-400">
                    Age: {player.age.years}
                  </div>
                )}
                {/* Social Media */}
                {player.socialMediaAccounts &&
                  player.socialMediaAccounts.length > 0 && (
                    <div className="mt-2 flex space-x-4">
                      {player.socialMediaAccounts.map((account) => (
                        <a
                          key={account.url}
                          href={account.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {/* Implement getSocialIcon similar to TeamDetail */}
                        </a>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Player Statistics */}
        {/* Display player statistics here if available */}
      </div>
    </Column>
  );
};

export default PlayerDetail;
