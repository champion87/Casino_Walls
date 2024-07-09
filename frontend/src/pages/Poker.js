import React, { useEffect, useState } from 'react';
import { call_api } from 'src/lib/utils';
import { useParams } from 'react-router-dom';
import { useToast } from 'src/components/ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';

const PokerTable = () => {
    const toast = useToast()

    let { game_key } = useParams();
    const [playerCards, setPlayerCards] = useState(['', '']); // Initial player cards
    const [boardCards, setBoardCards] = useState(['', '', '', '', '']); // Initial Board cards
    const [pot, setPot] = useState(0); // Initial pot amount
    const [currentPlayer, setCurrentPlayer] = useState(0); // Index of current player
    const [gamePhase, setGamePhase] = useState('deal'); // Game phase: 'deal', 'flop', 'turn', 'river', 'showdown'
    const [playerBet, setPlayerBet] = useState(0); // Amount player bets in current round
    const [myBet, setMyBet] = useState(0); // Amount this player betted in current round


    const getBoardState = async () => {

        const playerCards = await call_api(`/api/games/${game_key}/poker/get_hand`, "GET").then(res => res.json())
        const cardsOnBoard = await call_api(`/api/games/${game_key}/poker/get_board`, "GET").then(res => res.json())
        const potFromBackend = await call_api(`/api/games/${game_key}/poker/get_pot`, "GET").then(res => res.json())
        const currentBet = await call_api(`/api/games/${game_key}/poker/get_current_bet`, "GET").then(res => res.json())

        setPlayerCards(playerCards.hand);
        setBoardCards(cardsOnBoard.board);
        setPot(potFromBackend.pot);
        setPlayerBet(currentBet.bet);
        setGamePhase('flop');
        setCurrentPlayer(0); // Reset to player 0 after dealing
    };

    useEffect(() => {
        getBoardState()
      }, []);

    const check = () => {
        if (myBet < playerBet) {
            toast({
                title: "Can't check",
                description: "The current bet is higher than yours, please raise, call or fold",
                className: "bg-black text-yellow-400",
                action: (
                    <ToastAction altText="Ok">Ok</ToastAction>
                ),
            });
            return;
        }
        console.log(`Player ${currentPlayer} checks.`);
        nextPlayer();
    };

    const call = async () => {
        await call_api(`api/games/${game_key}/poker/call`)
        console.log(`Player ${currentPlayer} calls.`);
        setPot(pot + playerBet - myBet);
        setMyBet(playerBet)
        nextPlayer();
    };

    const raise = async (raiseAmount) => {
        await call_api(`api/games/${game_key}/poker/raise`)
        // In a real game, this might involve increasing the current bet amount and deducting chips from the player
        const newBet = playerBet + raiseAmount; // Example: Increase bet by 10 for demonstration
        console.log(`Player ${currentPlayer} raises to ${newBet}.`);
        setPot(pot + newBet);
        setPlayerBet(newBet);
        nextPlayer();
    };

    const fold = () => {
        // Logic for a player folding (removing player from the round)
        // In a real game, this might involve removing the player's cards from the table
        console.log(`Player ${currentPlayer} folds.`);
        // Implement logic to handle fold, perhaps skip player in future rounds or mark as folded
        nextPlayer();
    };

    const nextPlayer = () => {
        // Move to the next player in sequence
        const nextPlayerIndex = currentPlayer % 2 + 1; // Assuming 2 players for simplicity
        setCurrentPlayer(nextPlayerIndex);
    };

    return (
        <div className="poker-table">
            <h1>Poker Table</h1>
            <div className="game-info">
                <p>Current Phase: {gamePhase}</p>
                <p>Current Player: Player {currentPlayer}</p>
                <p>Pot: ${pot}</p>
                <p>Current Bet: ${playerBet}</p>
            </div>

            <div className="player-section">
                <h2>Player {currentPlayer}</h2>
                <div className="player-cards">
                    {playerCards.map((card, index) => (
                        <div key={index} className="card">{card}</div>
                    ))}
                </div>
                <div className="player-actions">
                    {/* Buttons for player actions */}
                    <button onClick={check} disabled={currentPlayer !== 1 || gamePhase !== 'flop'}>Check</button>
                    <button onClick={call} disabled={currentPlayer !== 1 || gamePhase !== 'flop' || playerBet === 0}>Call</button>
                    <button onClick={raise} disabled={currentPlayer !== 1 || gamePhase !== 'flop'}>Raise</button>
                    <button onClick={fold} disabled={currentPlayer !== 1 || gamePhase !== 'flop'}>Fold</button>
                </div>
            </div>

            <div className="community-cards">
                <h2>Board</h2>
                {boardCards.map((card, index) => (
                    <div key={index} className="card">{card}</div>
                ))}
            </div>

            <div className="control-buttons">
                {/* Add buttons for other game phases (turn, river, showdown) */}
            </div>
        </div>
    );
};

export default PokerTable;
