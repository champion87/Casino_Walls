import React, { useState } from 'react';

const BJRulesButton = () => {
  const [showRules, setShowRules] = useState(false);

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <div>
      <button 
        onClick={toggleRules} 
        className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200 p-2"
      >
        {showRules ? 'Hide Blackjack Rules' : 'Show Blackjack Rules'}
      </button>
      {showRules && (
        <div className="bg-white text-black p-4 mt-2 rounded-md">
          <h2 className="text-xl font-bold">Blackjack Rules</h2>
          <ul className="list-disc list-inside">
            <li>The goal of blackjack is to beat the dealer's hand without going over 21.</li>
            <li>Face cards are worth 10. Aces are worth 1 or 11, whichever makes a better hand.</li>
            <li>Each player starts with two cards, one of the dealer's cards is hidden until the end.</li>
            <li>To 'Hit' is to ask for another card. To 'Stand' is to hold your total and end your turn.</li>
            <li>If you go over 21 you bust, and the dealer wins regardless of the dealer's hand.</li>
            <li>If you are dealt 21 from the start (Ace & 10), you got a blackjack.</li>
            <li>Blackjack usually means you win 1.5 the amount of your bet.</li>
            <li>Dealer will hit until their cards total 17 or higher.</li>
            <li>Doubling is like a hit, only the bet is doubled and you only get one more card.</li>
            <li>Split can be done when you have two of the same card - the pair is split into two hands.</li>
            <li>Splitting also doubles the bet, because each new hand is worth the original bet.</li>
            <li>You can only double/split on the first move, or first move of a hand created by a split.</li>
            <li>You cannot play on two aces after they are split.</li>
            <li>Doubling after splitting is usually not allowed.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BJRulesButton;
