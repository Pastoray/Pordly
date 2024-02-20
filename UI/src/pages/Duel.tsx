import { useContext, useEffect, useState } from "react"
import DuelGame from "../components/Features/DuelGame"
import Toolbar from "../components/UI/Toolbar"
import '../styles/pages/Duel.scss'
import Spinner from "../components/UI/Spinner"
import io from 'socket.io-client'
import { UserContext } from "../context/UserContext"

type GameStats = {
  accuracy: number,
  wpm: number
}

function Duel() {
  const user = useContext(UserContext)
  const [webSocket, setWebSocket] = useState(io('ws://localhost:8080'))
  const [isLoading, setIsLoading] = useState(true)
  const [opponentStats, setOpponentStats] = useState({ accuracy: 0, wpm: 0 } as GameStats)

  useEffect(() => {
    if (!user) return
    webSocket.emit('initial_data', { user_id: user.info.id, user_level: user.stats.level.level });

    webSocket.on(`response`, (response) => {
      if (response.match_found) {
        setIsLoading(false)
      }
    });

  webSocket.on('opponent_stats', (data) => {
      if (data) {
        console.log(data)
        setOpponentStats((prev) => ({
          ...prev,
          accuracy: data.accuracy,
          wpm: data.wpm
          } as GameStats));
      }
    });

    return () => {
      webSocket.disconnect();
    };
  }, [user]);

  function get_stats(accuracy: number, wpm: number) {
    webSocket.emit('renew_stats', { user_id: user!.info.id, accuracy: accuracy, wpm: Math.ceil(wpm)});
    webSocket.emit('fetch_opponent_stats', { user_id: user!.info.id });
  }

  return (
    <>
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
              <DuelGame opponentStats={opponentStats} statsUpdate={get_stats}/>
          }
        </div>
      </div>
    
    </>
  )
}

export default Duel
