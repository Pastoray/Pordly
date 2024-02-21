import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../context/UserContext"
import DuelGame from "../../components/Features/DuelGame"
import Toolbar from "../../components/UI/Toolbar"
import Spinner from "../../components/UI/Spinner"
import { get_user } from "../../utils/Index"
import { GameStats } from "../../types/Index"
import '../../styles/pages/Duel.scss'
import io from 'socket.io-client'

function Duel() {
  const user = useContext(UserContext)
  const [webSocket, _] = useState(io('ws://localhost:8080'))
  const [isLoading, setIsLoading] = useState(true)
  const [opponentStats, setOpponentStats] = useState({ accuracy: 0, wpm: 0 } as GameStats)
  const [userValidated, setUserValidated] = useState(false);

  useEffect(() => {
      async function user_exists() {
          const result = await get_user()
          if (result === undefined) {
              window.location.href = '/login'
          } else {
              setUserValidated(true)
          }
      }
      user_exists()
  })

  useEffect(() => {
    if (!user || !userValidated) return
    webSocket.emit('initial_data', { user_id: user.info.id, user_level: user.stats.level.level });

    webSocket.on(('match_found'), () => {
      setIsLoading(false)
    });

  webSocket.on('opponent_stats', (data) => {
      if (data && data.accuracy > 0) {
        setOpponentStats((prev) => ({
          ...prev,
          accuracy: data.accuracy,
          wpm: data.wpm
          } as GameStats));
      }
    });
  webSocket.on('match_canceled', () => {
    setIsLoading(true)
    webSocket.emit('initial_data', { user_id: user.info.id, user_level: user.stats.level.level });
  })

  return () => {
      webSocket.disconnect();
    };
  }, [user]);

  function get_stats(accuracy: number, wpm: number) {
    webSocket.emit('refresh_user_stats', { user_id: user!.info.id, accuracy: accuracy, wpm: Math.ceil(wpm)});
    webSocket.emit('fetch_opponent_stats', { user_id: user!.info.id });
  }

  function game_finished() {
    webSocket.emit("match_finished")
  }

  return (
    <>
      {
      userValidated ?
        <div className="duel-page-container">
          <Toolbar/>
          <div className="duel-container">
            {
              isLoading ?
                <div className="duel-details">
                  <p id="duel-details">Duel Details</p>
                  <p><span id="duel-details-arrow"> ➜ </span>The duel is going to be 1:30 minutes long</p>
                  <p><span id="duel-details-arrow"> ➜ </span>The duel is going to consist of 50 total paragraphs</p>
                  <p><span id="duel-details-arrow"> ➜ </span>Whoever gets the higher number of points by the end of the duel wins</p>
                  <p><span id="duel-details-arrow"> ➜ </span>You get 10 points for every 1% accuracy and 5 points for every 1 WPM (you're max WPM record throughout this duel)</p>
                  <p><span id="duel-details-arrow"> ➜ </span>The winner gets 50 gems and the loser loses 50 (Can be multiplied by the current active booster)</p>
                  <div id="duel-loading-container">
                    <div id="duel-loading">
                      <Spinner/>
                    </div>
                  </div>
                </div>
              :
                <DuelGame opponent_stats={opponentStats} update_stats={get_stats} game_state={game_finished}/>
            }
          </div>
        </div>
      :
        null  
      }
    </>
  )
}

export default Duel
