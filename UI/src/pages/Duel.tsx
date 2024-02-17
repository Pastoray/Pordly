import { useEffect, useState } from "react"
import DuelGame from "../components/Features/DuelGame"
import Toolbar from "../components/UI/Toolbar"
import '../styles/pages/Duel.scss'
import Spinner from "../components/UI/Spinner"
import io from 'socket.io-client'

function Duel() {
  const socket = io('ws://localhost:8080');
  const [isLoading, setIsLoading] = useState(true)
  const [counter, setCounter] = useState(0)
  /*useEffect(() => {
    //stop_loading()
    socket.on("message", (message) => {
      setCounter(message)
      console.log(message);
    });
  }, [])*/

  async function stop_loading() {
    setTimeout(() => setIsLoading(false), 5000)
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
                <p><span id="duel-details-arrow">➜ </span>The duel is going to be 2 minutes long</p>
                <p><span id="duel-details-arrow">➜ </span>The duel is going to consist of 30 total paragraphs</p>
                <p><span id="duel-details-arrow">➜ </span>Whoever gets the higher number of points by the end of the duel wins</p>
                <p><span id="duel-details-arrow">➜ </span>You get 5 points for every 1% accuracy and 2 points for every 1 WPM (you're max WPM record throughout this duel)</p>
                <p><span id="duel-details-arrow">➜ </span>The winner gets 15 ranked points and the loser loses 15 ranked points</p>
                <div id="duel-loading-container">
                  <div id="duel-loading">
                    <Spinner/>
                  </div>
                </div>
              </div>
            :
              <DuelGame/>
          }
        </div>
      </div>
    
    </>
  )
}

export default Duel