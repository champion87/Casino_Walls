import React, { useState, useEffect } from 'react';
import './bjgpt.css';
import { call_api } from 'src/lib/utils';
import { useParams } from 'react-router-dom';

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const getCardValue = (card) => {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
};


function BJ_GPT() {
  // const [ game_key ] = useParams();
  let { game_key } = useParams();
  // const [deck, setDeck] = useState(createDeck());
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [message, setMessage] = useState('');

  async function calculateScore(hand) {
    const response = await call_api(`api/games/${game_key}/blackjack/get_score`, "get")
    const data = await response.json()

    return data["score"];
  };

  async function getHand() {

    let newPlayerHand;
    try {
      const response = await call_api(`api/games/${game_key}/blackjack/get_hand`, "get")
      const data = await response.json()
      return data["hand"];
    } catch (error) {
      console.error('Error fetching player cards:', error);
      throw "oof"
    }
  };


  async function createDeck() {
    // let deck = [];
    // for (let suit of suits) {
    //   for (let value of values) {
    //     deck.push({ suit, value });
    //   }
    // }
    // return deck.sort(() => Math.random() - 0.5);

    //////////// unsupported

    // const response = await call_api(`api/games/${game_key}/blackjack/draw`, "get") 
    // const data = await response.json()
    throw "create deck unsupported"
  };


  useEffect(() => {
    startNewGame();
  }, []);

  async function startNewGame() {

    // let newDeck = createDeck();
    // let newDealerHand = [newDeck.pop(), newDeck.pop()]; // TODO
    // let newPlayerHand = [newDeck.pop(), newDeck.pop()];

    await call_api(`api/games/${game_key}/blackjack/restart_game`, "post")
    let newPlayerHand = await getHand();
    // throw "THATS ENOUGH FOR NOW"
    // try {
    //   newPlayerHand
    // } catch (error) {
    //   console.error('Error fetching player cards:', error);
    // }
    // let newPlayerHand = await getHand()
    // setDeck(newDeck);
    // setDealerHand(newDealerHand); // TODO
    setPlayerHand(newPlayerHand);
    // setDealerScore(await calculateScore(newDealerHand));// TODO
    setPlayerScore(await calculateScore(newPlayerHand));
    setMessage('');
  };

  async function hit() {
    // let newDeck = [...deck];
    // let newPlayerHand = [...playerHand, newDeck.pop()];

    await call_api(`api/games/${game_key}/blackjack/draw`, "post")

    let newPlayerHand = await getHand()
    let newPlayerScore = await calculateScore(newPlayerHand);


    // setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);

    if (newPlayerScore > 21) {
      setMessage('Player Busted!');
      // TODO endgame here
    }
  };

  async function stand() {
    await call_api(`api/games/${game_key}/blackjack/fold`, "post")


    // let newDealerHand = [...dealerHand];
    // let newDealerScore = await calculateScore(newDealerHand); // TODO

    // while (newDealerScore < 17) {
    //   newDealerHand.push(newDeck.pop());
    //   newDealerScore = await calculateScore(newDealerHand);
    // }

    // setDeck(newDeck);
    // setDealerHand(newDealerHand);
    // setDealerScore(newDealerScore);

    // if (newDealerScore > 21) {
    //   setMessage('Dealer Busted! Player Wins!');
    // } else if (newDealerScore > playerScore) {
    //   setMessage('Dealer Wins!');
    // } else if (newDealerScore < playerScore) {
    //   setMessage('Player Wins!');
    // } else {
    //   setMessage('Push!');
    // }

    setMessage('Game over!');

  };

  return (
    <div className="game-container">
      <h1>Blackjack</h1>
      <div className="dealer">
        <h2>Dealer's Hand</h2>
        <div id="dealer-cards" className="cards">
          {/* {dealerHand.map((card, index) => (
            <div key={index} className="card">{card.value} of {card.suit}</div>
          ))} */}
        </div>
        {/* <div id="dealer-score" className="score">{dealerScore}</div> */}
      </div>
      <div className="player">
        <h2>Your Hand</h2>
        <div id="player-cards" className="cards">
          {console.log(playerHand)}
          {playerHand.map((card) => (
            // <div key={index} className="card">{card}</div>
            <div className="card">{card}</div>

          ))}

        </div>
        <div id="player-score" className="score">{playerScore}</div>
      </div>
      <div className="controls">
        <button onClick={hit} disabled={message !== ''}>Hit</button>
        <button onClick={stand} disabled={message !== ''}>Stand</button>
        <button onClick={startNewGame}>New Game</button>
      </div>
      <div id="message" className="message">{message}</div>
    </div>
  );
}

export default BJ_GPT;
