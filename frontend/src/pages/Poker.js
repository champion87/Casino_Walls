import React, { useEffect, useState } from 'react';
import { call_api } from 'src/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'src/components/ui/button';
import { Slider } from "../components/ui/slider"

import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'

const PokerTable = () => {
    const navigate = useNavigate()

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
    const [coins, setCoins] = useState(""); // dict from user to coin amount
    const [canCall, setCanCall] = useState(false); // determines wether the user can call
    const [canCheck, setCanCheck] = useState(false); // determines wether the user can check
    const [raiseAmount, setRaiseAmount] = useState(0); // how much the user wants to raise by
    const [raisePercentage, setRaisePercentage] = useState(0); // how much the user wants to raise by

    const updatePage = async () => {
        const info = await call_api(`/api/games/${game_key}/poker/info`, "GET")
        .then(res => {
            if (!res.ok)
            {
                navigate("/poker_main")
            }
            return res.json()
        })
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
        setCoins(info.coins)
        setCanCheck(info.can_check)
        setCanCall(info.can_call)
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
        await call_api(`/api/games/${game_key}/poker/raise/` + raiseAmount, "POST")
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

    async function BackToLobby() {
        const response = await call_api(`/api/lobbies/my_lobby`, "get")
        const data = await response.json()
        navigate(`/poker_lobby/${data.lobby_key}`)
    }

    async function slider_handle_change(event) {
        var gamble_input_box = document.getElementById("gamble_input_box")
        var ev = await event[0];
        setRaisePercentage(ev)
        let coins_bet = await raise_amount_from_percentage();
        setRaiseAmount(coins_bet)
        gamble_input_box.value = coins_bet
    };

    async function raise_amount_from_percentage() {
        return Math.floor(coins[myUsername] * raisePercentage / 100)
    }

    var number = 0;
    async function gamble_box_handle_change() {
        var gamble_input_box = document.getElementById("gamble_input_box")
        if (is_positive_integer(gamble_input_box.value)) {
            number = Number(gamble_input_box.value)
            if (gamble_input_box.value > Number(coins[myUsername])) {
                console.log("to big")
                setRaisePercentage(100);
            }
            else {
                setRaisePercentage(gamble_input_box.value / coins[myUsername] * 100);
            }
        }
        else {
            gamble_input_box.value = number;
        }
        setRaiseAmount(gamble_input_box.value)
    }

    function is_positive_integer(str) {
        const regex = /^[0-9]*$/;
        if (!regex.test(str)) { return false; }
        const num = Number(str);
        return Number.isInteger(num) && num >= 0;
    }

    return (
        <div className='bg-wall bg-cover h-screen w-screen items-center overflow-y-scroll relative'>
            <div className='bg-chips fixed right-4 h-screen w-1/5 bg-contain bg-no-repeat bg-right' />
            <div className='bg-chips2 fixed left-0 h-screen w-1/5 bg-contain bg-no-repeat bg-left' />
            <div className="bg-black items-center justify-center inline-block rounded-3xl m-10 p-4">
                <h1 className='mb-4 text-3xl font-bold text-yellow-400'>Poker Table</h1>
                <div className="game-info text-l">
                    <p>Current Phase: {gamePhase}</p>
                    <p>Current Player: {currentPlayerName}</p>
                    <p>Current Bet: ${playerBet}</p>
                    <p>Pot: ${pot}</p>
                </div>

                <div className="player-section">
                    <div className="player-cards flex-col">
                        {Object.entries(playerCards).map(([key, hand]) => (
                            <>
                                <div className='inline-block m-5'>
                                    <h2>{key}'s Hand</h2>
                                    <div id="player-cards" className="cards">
                                        {hand.map((card, index) => (
                                            <Card key={index} card={card[0]} height="100px" back={card[1]} />
                                        ))}
                                    </div>
                                    <h2>{key}'s Bet: ${bets[key]}</h2>
                                    <h2>{key}'s Coins: ${coins[key]}</h2>
                                </div>
                            </>
                        ))}
                    </div>
                    <div className="player-actions grid grid-cols-4">
                        <Button onClick={check} className='m-2 bg-white text-black hover:text-yellow-300' disabled={currentPlayer !== myPlayerNum || gamePhase === 'showdown' || !canCheck}>Check</Button>
                        <Button onClick={call} className='m-2 bg-white text-black hover:text-yellow-300' disabled={currentPlayer !== myPlayerNum || gamePhase === 'showdown' || !canCall}>Call</Button>
                        <Button onClick={() => raise(raiseAmount)} className='m-2 bg-white text-black hover:text-yellow-300' disabled={currentPlayer !== myPlayerNum || gamePhase === 'showdown' || coins[myUsername] == 0 || raiseAmount == 0}>Raise</Button>
                        <Button onClick={fold} className='m-2 bg-white text-black hover:text-yellow-300' disabled={currentPlayer !== myPlayerNum || gamePhase === 'showdown'}>Fold</Button>
                    </div>
                    <div className='p-5'>
                        <Slider id="slider" max={100} defaultValue={[50]} step={1} min={0} className="w-full" onValueChange={(event) => slider_handle_change(event)} value={[raisePercentage]} />
                    </div>
                    <p>Raise by <input type="text" min="0" step="1" id="gamble_input_box" size="1" onChange={gamble_box_handle_change} className='text-black' /> coins</p>
                </div>

                <div className="community-cards flex-col items-center justify-center">
                    <h2 className="mb-4 text-xl text-yellow-300">Board</h2>
                    <div className="flex items-center justify-center">
                        {boardCards.map((card, index) => (
                            <Card key={index} card={card[0]} height="100px" back={card[1]} />
                            // <div key={index} className="card inline-block">{card}</div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className={(gamePhase === "showdown") ? "flex-col" : "hidden"}>
                        <h2 className='text-xl text-yellow-300 m-4'>{winners.length == 1 ? "winner" : "winners"}</h2>
                        {winners.map((winner, index) => (
                            <div key={index} className="inline-block text-3xl m-2 text-yellow-300">{winner}</div>
                        ))}
                        <div className='text-l m-2'>
                            {winningHand ? "with " + winningHand : ""}
                        </div>
                        <Button className='m-2 bg-white text-black hover:text-yellow-300' onClick={BackToLobby}>back to lobby</Button>
                    </div>
                </div>

                <div className="control-buttons">
                    {/* Add buttons for other game phases (turn, river, showdown) */}
                </div>
            </div>
        </div>
    );
};

export default PokerTable;
