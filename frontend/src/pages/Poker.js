import React, { useEffect, useState } from 'react';
import { call_api } from 'src/lib/utils';
import { useParams } from 'react-router-dom';
import { useToast } from 'src/components/ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { Button } from 'src/components/ui/button';

const PokerTable = () => {
    const { toast } = useToast()

    let { game_key } = useParams();
    const [playerCards, setPlayerCards] = useState({}); // Initial player cards
    const [boardCards, setBoardCards] = useState([]); // Initial Board cards
    const [pot, setPot] = useState(0); // Initial pot amount
    const [currentPlayer, setCurrentPlayer] = useState(0); // Index of current player
    const [currentPlayerName, setCurrentPlayerName] = useState(''); // Index of current player
    const [gamePhase, setGamePhase] = useState('deal'); // Game phase: 'deal', 'flop', 'turn', 'river', 'showdown'
    const [playerBet, setPlayerBet] = useState(0); // Amount player bets in current round
    const [myBet, setMyBet] = useState(0); // Amount this player betted in current round
    const [bets, setBets] = useState([]); // Amount all players betted in current round
    const [myPlayerNum, setMyPlayerNum] = useState(0); // the number of this player
    const [reload, setReload] = useState(0); // used to refetch information from the server
    const [myUsername, setMyUsername] = useState(""); // used to know the users username
    const [winners, setWinners] = useState([]); // The winners of the round
    const [winningHand, setWinningHand] = useState(""); // The hand type of the winner

    const updatePage = async () => {
        const info = await call_api(`/api/games/${game_key}/poker/info`, "GET").then(res => res.json())
        setBoardCards(info.board);
        setPlayerCards(info.hands);
        setPot(info.pot);
        setPlayerBet(info.current_bet);
        setCurrentPlayer(info.player);
        setCurrentPlayerName(info.player_name);
        setGamePhase(info.phase);
        setBets(info.bets);
        setMyPlayerNum(info.num);
        setMyUsername(info.username)
        setMyBet(bets[myUsername])
        setWinners(info.winners)
        setWinningHand(info.winning_hand)
    }

    const refresh = () => {
        setReload((reload + 1) % 10)
    }


    useEffect(() => {
        updatePage()
        const intervalId = setInterval(refresh, 1000); // Fetch every 1 seconds
        return () => clearInterval(intervalId); // unmountCleanup on 
    }, [reload]);

    const check = async () => {
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
        await call_api(`/api/games/${game_key}/poker/check`, "POST")
        console.log(`Player ${currentPlayer} checks.`);
        nextPlayer();
    };

    const call = async () => {
        await call_api(`/api/games/${game_key}/poker/call`, "POST")
        console.log(`Player ${currentPlayer} calls.`);
        setPot(pot + playerBet - myBet);
        setMyBet(playerBet)
        nextPlayer();
    };

    const raise = async (raiseAmount) => {
        await call_api(`/api/games/${game_key}/poker/raise`, "POST")
        const newBet = playerBet + raiseAmount;
        console.log(`Player ${currentPlayer} raises to ${newBet}.`);
        nextPlayer();
    };

    const fold = async () => {
        await call_api(`/api/games/${game_key}/poker/fold`, "POST")
        // remove the player's cards from the table
        console.log(`Player ${currentPlayer} folds.`);
        nextPlayer();
    };

    const nextPlayer = async () => {
        // Move locally to the next player in sequence
        const player_amount = await call_api(`/api/games/${game_key}/poker/get_player_amount`, "GET").then(res => res.json())
        const nextPlayerIndex = (currentPlayer + 1) % player_amount.amount;
        setCurrentPlayer(nextPlayerIndex);
    };

    return (
        <div className="poker-table">
            <h1>Poker Table</h1>
            <div className="game-info">
                <p>Current Phase: {gamePhase}</p>
                <p>Current Player: {currentPlayerName}</p>
                <p>Pot: ${pot}</p>
                <p>Current Bet: ${playerBet}</p>
            </div>

            <div className="player-section">
                <div className="player-cards flex-col">
                    {Object.entries(playerCards).map(([key, hand]) => (
                        <>
                            <div className='inline-block m-5'>
                                <h2>{key}'s Hand</h2>
                                <div id="player-cards" className="cards">
                                    {hand.map((card, index) => (
                                        <div key={index} className="card">{card}</div>))}
                                </div>
                                <h2>{key}'s Bet: {bets[key]}</h2>
                            </div>
                        </>
                    ))}
                </div>
                <div className="player-actions">
                    <Button onClick={check} disabled={currentPlayer !== myPlayerNum || gamePhase === 'showdown' || myBet < playerBet}>Check</Button>
                    <Button onClick={call} disabled={currentPlayer !== myPlayerNum || gamePhase === 'showdown' || playerBet === myBet}>Call</Button>
                    <Button onClick={() => raise(10)} disabled={currentPlayer !== myPlayerNum || gamePhase === 'showdown'}>Raise</Button>
                    <Button onClick={fold} disabled={currentPlayer !== myPlayerNum || gamePhase === 'showdown'}>Fold</Button>
                </div>
            </div>

            <div className="community-cards flex-col items-center justify-center">
                <h2>Board</h2>
                <div className="flex ">
                {boardCards.map((card, index) => (
                    <div key={index} className="card ">{card}</div>
                ))}
                </div>
            </div>

            <div>
                <div className={(gamePhase ===  "showdown") ? "flex-col" : "hidden"}>
                    <h2>winners</h2>
                    {winners.map((winner, index) => (
                        <div key={index} className="card inline-block m-5">{winner}</div>
                    ))}
                    <div>
                        with {winningHand}
                    </div>
                </div>
            </div>

            <div className="control-buttons">
                {/* Add buttons for other game phases (turn, river, showdown) */}
            </div>
        </div>
    );
};

export default PokerTable;
