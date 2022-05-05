import React, { useState, useEffect } from "react";
import * as execute from '../contract/execute';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import LoadingIndicator from '../components/LoadingIndicator';



const Play = () => {
  const connectedWallet = useConnectedWallet();
  const playTime = 15;
  
  const [gameOver, setGameOver] = useState(playTime);
  const [targetPosition, setTargetPosition] = useState({ top: "15%", left: "50%" });
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(playTime);

  useEffect(() => {
    const unsubscribe = setInterval(() => {
      setTime(time => time > 0 ? time - 1 : 0);
    }, 1000);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (time === 0) {
      setTargetPosition({ display: 'none' });
      // Show alert to let user know it's game over
      alert(`Game Over! Your score is ${score}. Please confirm transaction to submit score.`);
      submitScore();
    }
  }, [time]);

  const submitScore = async () => {
    if (connectedWallet && connectedWallet.network.name === 'testnet') {
      // This will return the transaction object on confirmation
      const tx = await execute.setScore(connectedWallet, score);
      console.log(tx);
      // Once the transaction is confirmed, we let the user know
      alert('Score submitted!');
      setLoading(false);
      window.location.href = '/leaderboard';
    }
  };

  const handleClick = () => {
    // STARCRAFT
    let audio = new Audio("/Zergling_explodes.mp3");

    // Adjust volume
    audio.volume = 0.2;
    audio.play();

    setScore(score => score + 1);

    // Play around with control bounds
    setTargetPosition({
      top: `${Math.floor(Math.random() * 80)}%`,
      left: `${Math.floor(Math.random() * 80)}%`
    });
  };

  return (
    <div className="score-board-container">
      <div className="play-container">
        <span>Score: {score}</span>
        <span>Fight!</span>
        <span>Time left: {time} s</span>
      </div>

      {/* Render loading or game container */}
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className='game-container'>
          <img src="pepe.png" id='target' alt="Target" style={{ ...targetPosition }} onClick={handleClick} />
          <img src="Marine.png" id="marine-img" alt="Marine" />
        </div>
      )}

      {/* Button to manually set score for testing */}
      {/* <button className="cta-button connect-wallet-button" onClick={() => setScore(score => score + 1)}>+1 score</button>

      {/* Button to submit score to be removed later, don't be a cheater >:(  */}
      {/* <button className="cta-button connect-wallet-button" onClick={submitScore}>Submit score</button> */} 
    </div>
  )
}

export default Play;