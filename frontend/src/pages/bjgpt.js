import React, { useState, useEffect } from 'react';
import './bjgpt.css';

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const getCardValue = (card) => {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
};

const calculateScore = (hand) => {
  let score = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  let aceCount = hand.filter(card => card.value === 'A').length;
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount -= 1;
  }
  return score;
};

const createDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

function App() {
  const [deck, setDeck] = useState(createDeck());
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    let newDeck = createDeck();
    let newDealerHand = [newDeck.pop(), newDeck.pop()];
    let newPlayerHand = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setPlayerHand(newPlayerHand);
    setDealerScore(calculateScore(newDealerHand));
    setPlayerScore(calculateScore(newPlayerHand));
    setMessage('');
  };

  const hit = () => {
    let newDeck = [...deck];
    let newPlayerHand = [...playerHand, newDeck.pop()];
    let newPlayerScore = calculateScore(newPlayerHand);

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);

    if (newPlayerScore > 21) {
      setMessage('Player Busted!');
    }
  };

  const stand = () => {
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];
    let newDealerScore = calculateScore(newDealerHand);

    while (newDealerScore < 17) {
      newDealerHand.push(newDeck.pop());
      newDealerScore = calculateScore(newDealerHand);
    }

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setDealerScore(newDealerScore);

    if (newDealerScore > 21) {
      setMessage('Dealer Busted! Player Wins!');
    } else if (newDealerScore > playerScore) {
      setMessage('Dealer Wins!');
    } else if (newDealerScore < playerScore) {
      setMessage('Player Wins!');
    } else {
      setMessage('Push!');
    }
  };

  return (
    <div className="game-container">
      <h1>Blackjack</h1>
      <div className="dealer">
        <h2>Dealer's Hand</h2>
        <div id="dealer-cards" className="cards">
          {dealerHand.map((card, index) => (
            <div key={index} className="card">{card.value} of {card.suit}</div>
          ))}
        </div>
        <div id="dealer-score" className="score">{dealerScore}</div>
      </div>
      <div className="player">
        <h2>Your Hand</h2>
        <div id="player-cards" className="cards">
          {playerHand.map((card, index) => (
            <div key={index} className="card">{card.value} of {card.suit}</div>
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

export default App;
