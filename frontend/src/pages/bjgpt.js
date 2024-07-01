import React, { useState, useEffect } from 'react';
import './bjgpt.css';
import { call_api } from 'src/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const getCardValue = (card) => {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
};


function BJ_GPT() {
  const navigate = useNavigate();

  // const [ game_key ] = useParams();
  let { game_key } = useParams();
  // const [deck, setDeck] = useState(createDeck());
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [hands, setHands] = useState({ 'hello': ["world"] });

  const [dealerScore, setDealerScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [message, setMessage] = useState('');

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
    const response = await call_api(`/api/games/${game_key}/blackjack/abort`, "post")
    navigate("/blackjack_main")
  }

  async function createDeck() {
    throw "create deck unsupported"
  };


  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    const fetchHands = async () => {
      try {
        const response = await call_api(`/api/games/${game_key}/blackjack/get_other_hands`, "get");
        const data = await response.json();
        setHands(data.hands);

        const response2 = await call_api(`/api/games/${game_key}/blackjack/is_game_over`, "get");
        const data2 = await response2.json();

        console.log("data2.is_game_over")

        console.log(data2.is_game_over)

        if (data2.is_game_over) {
          setDealerHand(await getDealerHand());

          let newDealerScore = await getDealerScore()
          let yourScore = await getScore()
          setDealerScore(newDealerScore);

          if (yourScore > 21) {
            setMessage('Player Busted!');
          } else if (newDealerScore > 21) {
            setMessage('Dealer Busted! Player Wins!');
          } else if (newDealerScore > playerScore) {
            setMessage('Dealer Wins!');
          } else if (newDealerScore < playerScore) {
            setMessage('Player Wins!');
          } else {
            setMessage('Tie!');
          }
        }

      } catch (error) {
        console.error('Error fetching other hands:', error);
      }
    };

    fetchHands();

    const intervalId = setInterval(fetchHands, 1000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

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
      // setMessage('Player Busted!');
      // TODO endgame here
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
            <div key={card} className="card">{card}</div>
          ))}
        </div>
        <div id="dealer-score" className="score">{dealerScore}</div>
      </div>
      <div className="player">
        <h2>Your Hand</h2>
        <div id="player-cards" className="cards">
          {/* {console.log(playerHand)} */}
          {playerHand.map((card) => (
            // <div key={index} className="card">{card}</div>
            <div key={card} className="card">{card}</div>

          ))}

        </div>
        <div id="player-score" className="score">{playerScore}</div>
      </div>




      <div className="controls">
        <button onClick={hit} disabled={message !== ''}>Hit</button>
        <button onClick={stand} disabled={message !== ''}>Stand</button>
        <button onClick={startNewGame}>New Game</button>
        <button onClick={BackToMainPage}>Go Back</button>

      </div>
      <div id="message" className="message">{message}</div>

      <div>
        {Object.entries(hands)
          .map(([key, hand]) => (
            <>
              <h2>{key}'s Hand</h2>
              <div id="player-cards" className="cards">

                {console.log("hand")}{console.log(hand)}{console.log("hands")}{console.log(hands)}{
                  hand.map((card, index) => (
                    <div key={index} className="card">{card}</div>))}
              </div>
            </>
          ))
        }
      </div>

    </div >
  );
}

export default BJ_GPT;
