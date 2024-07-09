import React, {
    useState,
    useEffect,
    //createContext,
    //useContext,
    //useReducer
} from 'react';

import { Button } from '../components/ui/button';
import { Slider } from "../components/ui/slider"
import { call_api } from "../lib/utils"
import Wheel2 from 'src/components/wheel2';



export const Wheel_of_fortune = () => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const [betAmount, setBetAmount] = useState();
    const [betPercentage, setBetPercentage] = useState();

    var coin_amount;
    var coins;
    var bet, response, json, prize, new_bet, mult;





    async function slider_handle_change(event) {
        //console.log(event)
        var gamble_input_box = document.getElementById("gamble_input_box")
        let slider = document.getElementById("slider");
        //console.log(slider.value)
        //gamble_input_box.value = slider.value;
        var ev = await event[0];
        //console.log(ev)
        setBetPercentage(ev)
        let coins_bet = await bet_amount();
        setBetAmount(coins_bet)
        gamble_input_box.value = coins_bet

        //setValue(event.target.value);
    };

    async function start() {
        setBetAmount(0)
        setBetPercentage(0)
        var gamble_input_box = document.getElementById("gamble_input_box")
        let slider = document.getElementById("slider");
        var gamble = document.getElementById("gamble");

        document.getElementById('open').style.display = "inline"
        document.getElementById('close').style.display = "none"
        document.getElementById('text').style.display = "none"


        coins = await get_coins();
        bet = Math.floor(coins / 100 * slider.value)
        gamble.innerHTML = "Gamble " + bet + " coins " + "(" + Math.floor(bet / coins * 100) + "%)";
        display('coin_amount', "coin amount: " + coins + " coins")
        gamble_input_box.value = "0"
        gamble.style.display = "none"




    }

    var number = 0;
    async function gamble_box_handle_change() {
        var gamble_input_box = document.getElementById("gamble_input_box")
        let slider = document.getElementById("slider");
        if (is_positive_integer(gamble_input_box.value)) {
            number = Number(gamble_input_box.value)
            coins = await get_coins();
            if (gamble_input_box.value > coins) {
                setBetPercentage(100);
            }
            else {
                setBetPercentage(gamble_input_box.value / coins * 100);
            }
        }
        else {
            gamble_input_box.value = number;
        }

        //setBetAmount(gamble_input_box.value);
    }

    async function slider_on_input() {
        coins = await get_coins();
        bet = await bet_amount();

        //let gamble = document.getElementById("gamble");
        let gamble_input_box = document.getElementById("gamble_input_box")
        //gamble.innerHTML = "Gamble " + bet + " coins (" + Math.floor(bet / coins * 100) + "%)";
        gamble_input_box.value = String(bet);

    }

    useEffect(() => { start() }, [])


    async function bet_amount() {
        coins = await get_coins();
        return Math.floor(coins * betPercentage / 100)
    }



    async function spin_logic() {
        var coins_count = await get_coins();
        let gamble_input_box = document.getElementById("gamble_input_box")

        bet = gamble_input_box.value;
        if (!is_positive_integer(bet) || bet > coins_count) {
            display('bet_money_text', '');
            display('prize_text', '');
            display('message', "You can't bet " + String(bet) + ' coins');
            return [-1, 0, 0, 0];
        }

        if (bet == 0) {
            display('bet_money_text', '');
            display('prize_text', '');
            display('message', "You didn't bet coins");
            return [-1, 0, 0, 0];
        }

        response = await call_api("api/games/wheel_of_fortune/spin_wheel_slider/" + bet, "get");
        json = await response.json();

        prize = json.prize;
        coins = json.coins;
        bet = json.bet;
        mult = json.mult;
        //await sleep(5000);
        //display_results(bet, prize, coins);
        //let prize_display_box = document.getElementById("prize_display");
        //prize_display_box.style.display = "none";
        display('bet_money_text', '');
        display('prize_text', '');
        display('message', '');

        return [mult, bet, prize, coins];
    }


    async function display_results(bet, prize, coins) {
        //let prize_display_box = document.getElementById("prize_display");
        //prize_display_box.style.display = "inline";
        let gamble = document.getElementById("gamble");
        let gamble_input_box = document.getElementById("gamble_input_box")
        new_bet = await bet_amount();
        gamble.innerHTML = "Gamble " + new_bet + " coins (" + Math.floor(new_bet / coins * 100) + "%)";
        gamble_input_box.value = String(new_bet);

        display('bet_money_text', 'You bet ' + bet + " coins");
        display('prize_text', 'Your prize is ' + prize + " coins");
        if (prize > bet) {
            display('message', 'You are doing great!');
        }
        else {
            display('message', 'better luck next time!');
        }

        if (bet == 0) {
            display('bet_money_text', '');
            display('prize_text', '');
            display('message', "You didn't bet coins");

        }

        if (bet == 1) {
            display('bet_money_text', 'You bet 1 coin');
        }
        if (prize == 1) {
            display('prize_text', 'Your prize is 1 coin');
        }

        display('coin_amount', 'coin amount: ' + coins + ' coins');
    }


    function is_positive_integer(str) {

        const regex = /^[0-9]*$/;
        if (!regex.test(str)) { return false; }
        const num = Number(str);
        return Number.isInteger(num) && num >= 0;
    }

    function open_rules() {
        document.getElementById('open').style.display = 'none'
        document.getElementById('close').style.display = 'inline'
        document.getElementById('text').style.display = 'inline'

    }

    async function close_rules() {
        document.getElementById('open').style.display = 'inline'
        document.getElementById('close').style.display = 'none'
        document.getElementById('text').style.display = 'none'
    }

    function display(id, text) {
        document.getElementById(id).innerHTML = text
    }

    async function get_coins() {
        response = await call_api("api/games/wheel_of_fortune/get_coins", "get");
        json = await response.json();
        coin_amount = json.coins
        return coin_amount
    }

    return (

        <div className='bg-wheel bg-cover overflow-y-scroll w-screen h-screen p-10 text-yellow-400'>

            <div className='bg-black w-fit inline-block p-5 justify-center rounded-xl'>
                <h1 className='font-bold'>Welcome to the wheel of fortune</h1>
                <Button type="button" className=' w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300' onClick={open_rules} onMouseOver={() => display('open', 'click to open the rules')}
                    onMouseOut={() => display('open', 'rules')} //{/*..............rules.............*/}
                    id="open">rules</Button> {/*..............rules.............*/}
                <Button type="button" className=' w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300' onClick={close_rules} onMouseOver={() => display('close', 'click to close the rules')}
                    onMouseOut={() => display('close', 'rules')} //..............rules.............
                    id="close">rules</Button><br />
                <p id="text">Spinning the wheel will <br />
                    cost you some number of coins.<br />
                    You will recieve back a random<br />
                    multiple of your bet amount according<br />
                    to the prizes written on the wheel. <br />
                    Good luck!</p><br /><br />
                <p id="coin_amount">coin amount:</p>

                <div className='p-5'>
                    <Slider id="slider" max={100} defaultValue={[50]} step={1} min={0} className="w-full" onValueChange={(event) => slider_handle_change(event)} value={[betPercentage]} />
                </div>
                {/*onChange={slider_handle_change*/}
                <p>Gamble <input type="text" min="0" step="1" id="gamble_input_box" size="1" onChange={gamble_box_handle_change} className='text-black' /> coins</p>

                <p id="gamble">Gamble 0 coins</p><br />

                <Wheel2 id="wheel2" onSpin={spin_logic} prizeDisplay={display_results}></Wheel2>
                {/*<div className='bg-coin m-1 p-1 h-20 w-20 inline-block'></div>*/}

                {/* <Button type="button" id="spinButton" className=' w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300' onClick={spin_wheel_slider}>spin the wheel!</Button> */}
                <div id='prize_display' className='bg-green-600 m-5 p-2 rounded-md '>
                    <p id="bet_money_text" className='font-extrabold'></p>
                    <p id="prize_text" className='font-extrabold'></p>
                    <p id="message" className='font-extrabold'></p>
                </div>

            </div>

        </div>
    )
}