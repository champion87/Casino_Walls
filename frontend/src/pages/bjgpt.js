import React, { useState, useEffect } from 'react';
import './bjgpt.css';
import { call_api } from 'src/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'

function BJ_GPT() {
  const navigate = useNavigate();

  let { game_key } = useParams();
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [hands, setHands] = useState({});
  const [dealerScore, setDealerScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [message, setMessage] = useState('');


  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    fetchHands();
    const intervalId = setInterval(fetchHands, 1000); // Fetch every 1 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver && !hasExecuted) {
      // Your code to be executed once
      console.log('Game Over! Code executed only once.');
      async function endgame() {
        setDealerHand(await getDealerHand());

        let newDealerScore = await getDealerScore()
        let yourScore = await getScore()
        setDealerScore(newDealerScore);

        if (yourScore > 21) {
          setMessage('Player Busted!');
        } else if (newDealerScore > 21) {
          setMessage('Dealer Busted! Player Wins!');
        } else if (newDealerScore > yourScore) {
          setMessage('Dealer Wins!');
        } else if (newDealerScore < yourScore) {
          setMessage('Player Wins!');
        } else {
          setMessage('Tie!');
        }

      }
      endgame()
      // Set hasExecuted to true to prevent re-execution
      setHasExecuted(true);
    }
  }, [isGameOver, hasExecuted]);


  async function getScore() {
    const response = await call_api(`/api/games/${game_key}/blackjack/get_score`, "get")
    const data = await response.json()

    return data["score"];
  };

  async function getDealerScore() {
    const response = await call_api(`/api/games/${game_key}/blackjack/get_dealer_score`, "get")
    const data = await response.json()

    return data["score"];
  }

  async function getHand() {
    try {
      const response = await call_api(`/api/games/${game_key}/blackjack/get_hand`, "get")
      const data = await response.json()
      return data["hand"];
    } catch (error) {
      console.error('Error fetching player cards:', error);
      throw "oof"
    }
  };

  async function getDealerHand() {
    try {
      const response = await call_api(`/api/games/${game_key}/blackjack/get_dealer_hand`, "get")
      const data = await response.json()
      console.log("getting hand")
      console.log(data["hand"])

      return data["hand"];
    } catch (error) {
      console.error('Error fetching dealer cards:', error);
      throw "oof"
    }
  };

  async function BackToMainPage() {
    await call_api(`/api/games/${game_key}/blackjack/abort`, "post")
    const response = await call_api(`/api/lobbies/my_lobby`, "get")
    const data = response.json()
    navigate("/blackjack_main")
  }

  async function BackToLobby() {
    const response = await call_api(`/api/lobbies/my_lobby`, "get")
    const data = await response.json()
    console.log(data.lobby_key)
    await call_api(`/api/games/${game_key}/blackjack/abort`, "post")
    navigate(`/blackjack_lobby/${data.lobby_key}`)
  }

  async function fetchHands() {
    if (isGameOver) {
      console.log("over")
      return
    }
    console.log("is game over")
    console.log(isGameOver)

    try {
      const response = await call_api(`/api/games/${game_key}/blackjack/get_other_hands`, "get");
      const data = await response.json();
      setHands(data.hands);
      console.log("hands from the server")

      console.log(data.hands)

      const response2 = await call_api(`/api/games/${game_key}/blackjack/is_game_over`, "get");
      const data2 = await response2.json();

      

      if (data2.is_game_over) {
        console.log("I set")
        setIsGameOver(true);
      }

    } catch (error) {
      console.error('Error fetching other hands:', error);
    }
  };

  async function startNewGame() {

    await call_api(`/api/games/${game_key}/blackjack/try_restart_game`, "post")

    let newDealerHand = await getDealerHand()
    let newPlayerHand = await getHand();

    console.log(newPlayerHand)
    console.log(typeof newPlayerHand)

    setDealerHand(newDealerHand);
    setPlayerHand(newPlayerHand);
    setDealerScore(await getDealerScore())
    setPlayerScore(await getScore());
    setMessage('');
  };

  async function hit() {
    await call_api(`/api/games/${game_key}/blackjack/draw`, "post")

    let newPlayerHand = await getHand()
    let newPlayerScore = await getScore();


    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);

    if (newPlayerScore > 21) {
      setMessage("Player busted!")
    }
  };

  async function stand() {
    console.log("i stand!")
    await call_api(`/api/games/${game_key}/blackjack/fold`, "post")

    setMessage('What a Thrill!');

  };

  return (
    <div className="game-container">
      <h1>Blackjack</h1>
      <div className="dealer">
        <h2>Dealer's Hand</h2>
        <div id="dealer-cards" className="cards">
          {dealerHand.map((card) => (
            <Card card={card[0]} height="100px" back={card[1]} />
            // <div key={card} className="card">{card}</div>
          ))}
        </div>
        <div id="dealer-score" className="score">{dealerScore}</div>
      </div>
      <div className="player">
        <h2>Your Hand</h2>
        <div id="player-cards" className="cards">
          {playerHand.map((card) => (
            // <div key={card} className="card">{card}</div>
            <Card card={card[0]} height="100px" back={card[1]} />

          ))}
        </div>
        <div id="player-score" className="score">{playerScore}</div>
      </div>



      <div className="controls">
        <button onClick={hit} disabled={message !== ''}>Hit</button>
        <button onClick={stand} disabled={message !== ''}>Stand</button>
        <button onClick={BackToLobby}>Back To Lobby</button>
        <button onClick={BackToMainPage}>Main page</button>
      </div>

      <div id="message" className="message">{message}</div>

      <div>
      {console.log("hands")}{console.log(hands)}{Object.entries(hands)
          .map(([key, hand]) => (
            <>
              <h2>{key}'s Hand</h2>
              <div id="player-cards" className="cards">

                {console.log("hand")}{console.log(hand)}{console.log("hands")}{console.log(hands)}{
                  hand.map((card, index) => (
                    <Card key={index} card={card[0]} height="100px" back={card[1]} />
                  ))}
              </div>
            </>
          ))
        }
      </div>

    </div >
  );
}

export default BJ_GPT;
