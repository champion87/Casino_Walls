
import React, { useState } from 'react';

const PokerRulesButton = () => {
    const [showRules, setShowRules] = useState(false);

    const toggleRules = () => {
        setShowRules(!showRules);
    };

    return (
        <div>
            {showRules && (
                <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                    <h1>Rules of Poker</h1>

                    <section>
                        <h2>Overview</h2>
                        <p>
                            Poker is a popular card game that combines skill, strategy, and luck. The goal is to win chips from other players by having the best hand or by convincing them to fold.
                        </p>
                    </section>

                    <section>
                        <h2>Hand Rankings</h2>
                        <ul>
                            <li><strong>Royal Flush:</strong> A, K, Q, J, 10, all in the same suit.</li>
                            <li><strong>Straight Flush:</strong> Five consecutive cards of the same suit.</li>
                            <li><strong>Four of a Kind:</strong> Four cards of the same rank.</li>
                            <li><strong>Full House:</strong> Three cards of one rank and two cards of another rank.</li>
                            <li><strong>Flush:</strong> Any five cards of the same suit, but not in sequence.</li>
                            <li><strong>Straight:</strong> Five consecutive cards of different suits.</li>
                            <li><strong>Three of a Kind:</strong> Three cards of the same rank.</li>
                            <li><strong>Two Pair:</strong> Two cards of one rank and two cards of another rank.</li>
                            <li><strong>One Pair:</strong> Two cards of the same rank.</li>
                            <li><strong>High Card:</strong> The highest card wins if no other hand is made.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Gameplay</h2>
                        <ol>
                            <li><strong>Betting Rounds:</strong> Poker is typically played in rounds of betting. Players bet chips based on the strength of their hands.</li>
                            <li><strong>Dealing:</strong> Players are dealt two private cards (hole cards) and five community cards are dealt face-up on the table.</li>
                            <li><strong>Pre-Flop:</strong> The first round of betting occurs after players receive their hole cards.</li>
                            <li><strong>The Flop:</strong> Three community cards are dealt face-up, followed by another round of betting.</li>
                            <li><strong>The Turn:</strong> A fourth community card is dealt, followed by another round of betting.</li>
                            <li><strong>The River:</strong> The fifth and final community card is dealt, followed by the final round of betting.</li>
                            <li><strong>Showdown:</strong> Players reveal their hands, and the best hand wins the pot.</li>
                        </ol>
                    </section>

                    <section>
                        <h2>Betting Options</h2>
                        <ul>
                            <li><strong>Check:</strong> Pass the action to the next player without betting.</li>
                            <li><strong>Bet:</strong> Place a wager in the pot.</li>
                            <li><strong>Fold:</strong> Discard your hand and forfeit the round.</li>
                            <li><strong>Call:</strong> Match the current highest bet.</li>
                            <li><strong>Raise:</strong> Increase the size of the current bet.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Winning the Game</h2>
                        <p>
                            The game continues until one player has won all the chips. Players can win by either having the best hand at the showdown or by making all other players fold.
                        </p>
                    </section>

                    <section>
                        <h2>Tips for Beginners</h2>
                        <ul>
                            <li>Start with low stakes to learn the game.</li>
                            <li>Pay attention to other players' behavior and betting patterns.</li>
                            <li>Don't be afraid to fold if you have a weak hand.</li>
                            <li>Practice makes perfect! The more you play, the better you'll get.</li>
                        </ul>
                    </section>
                </div>
            )}
            <button
                onClick={toggleRules}
                className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200 p-2"
            >
                {showRules ? 'Hide Poker Rules' : 'Show Poker Rules'}
            </button>
        </div>
    );
};

export default PokerRulesButton;
