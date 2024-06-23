import React, {
    //useState,
    useEffect,
    //createContext,
    //useContext,
    //useReducer
} from 'react';

import { Button } from '../components/ui/button';

export const Wheel_of_fortune = () => {
    async function start() {
        let gamble_input_box = document.getElementById("gamble_input_box")
        let slider = document.querySelector("input[type='range']");
        let gamble = document.getElementById("gamble");
        // console.log("hi")
        document.getElementById('open').style.display = "inline"
        document.getElementById('close').style.display = "none"
        document.getElementById('text').style.display = "none"


        coins = await get_coins();
        bet = Math.floor(coins / 100 * slider.value)
        gamble.innerHTML = "Gamble " + bet + " coins " + "(" + Math.floor(bet / coins * 100) + "%)";
        //percantage.innerHTML
        display('coin_amount', "coin amount: " + coins + " coins")
        //gamble_input_box.style.display = "none"
        gamble_input_box.value = "0"
        gamble.style.display = "none"

        slider.oninput = async function () {
            coins = await get_coins();
            bet = await bet_amount();

            let gamble = document.getElementById("gamble");
            let gamble_input_box = document.getElementById("gamble_input_box")
            gamble.innerHTML = "Gamble " + bet + " coins (" + Math.floor(bet / coins * 100) + "%)";
            gamble_input_box.value = String(bet);

        }

        var number = 0;
        gamble_input_box.oninput = async function () {
            //gamble.innerHTML = "Gamble " + (gamble_input_box.value) + " coins (" + Math.floor(bet / coins * 100) + "%)";
            //console.log(gamble_input_box.value)
            if (is_positive_integer(gamble_input_box.value)) {
                number = Number(gamble_input_box.value)
                coins = await get_coins();
                slider.value = gamble_input_box.value / coins * 100
            }
            else {
                gamble_input_box.value = number;
            }
        }
    }
    //let gamble_input_box = document.getElementById("gamble_input_box")
    //let slider = document.querySelector("input[type='range']");
    //let gamble = document.getElementById("gamble");
    var coins;
    useEffect(() => { start() }, [])


    async function bet_amount() {
        let slider = document.querySelector("input[type='range']");
        coins = await get_coins();
        return Math.floor(coins / 100 * slider.value)
    }

    var bet, response, json, prize, new_bet;
    async function spin_wheel_slider() {
        bet = await bet_amount()

        response = await fetch("/games/wheel_of_fortune/spin_wheel_slider/" + bet);
        json = await response.json();

        prize = json.prize
        coins = json.coins
        bet = json.bet
        document.getElementById('bet_money_text').innerHTML = 'You bet ' + bet + " coins";
        document.getElementById('prize_text').innerHTML = 'Your prize is ' + prize + " coins";
        display('current_coins_text', 'You currently have a total of ' + coins + " coins");
        display('coin_amount', 'coin amount: ' + coins + ' coins');

        let slider = document.querySelector("input[type='range']");
        let gamble = document.getElementById("gamble");
        let gamble_input_box = document.getElementById("gamble_input_box")


        new_bet = Math.floor(coins / 100 * slider.value)
        gamble.innerHTML = "Gamble " + new_bet + " coins (" + Math.floor(new_bet / coins * 100) + "%)";
        gamble_input_box.value = String(new_bet);
    }




    //let slider = document.querySelector("input[type='range']");


    function is_positive_integer(str) {

        //if (str === '') { return false; }
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

    function close_rules() {
        document.getElementById('open').style.display = 'inline'
        document.getElementById('close').style.display = 'none'
        document.getElementById('text').style.display = 'none'
    }

    function display(id, text) {
        document.getElementById(id).innerHTML = text
    }
    var coin_amount;
    async function get_coins() {
        response = await fetch("/games/wheel_of_fortune/get_coins");
        json = await response.json();
        coin_amount = json.coins
        return coin_amount
    }

    return (

        <div className='bg-blue-300 w-screen h-screen'>


            <h1>Welcome to the wheel of fortune</h1>

            <Button type="button" onclick={open_rules} onmouseover={() => display('open', 'click to open the rules')}
                onmouseout={() => display('open', '..............rules.............')}
                id="open">..............rules.............</Button>
            <Button type="button" onclick={close_rules} onmouseover={() => display('close', 'click to close the rules')}
                onmouseout={() => display('close', '..............rules.............')}
                id="close">..............rules.............</Button><br />
            <p id="text">Spinning the wheel will cost you some percentage of your money.<br />
                You will recieve back a random amount of coins between 0 and<br />
                double the amount of your bet. Good luck!</p><br /><br />
            <p id="coin_amount">coin amount:</p>
            <img src="/images/coinpic.png" alt="coins" height="32px" width="32px" />

            <input type="range" min="0" max="100" value="0" class="slider" id="slider" />

            <p>Gamble <input type="text" min="0" step="1" id="gamble_input_box" size="1" /> coins</p>

            <p id="gamble">Gamble 0 coins</p><br />
            <Button type="button" id="spinButton" onclick={spin_wheel_slider}>spin the wheel!</Button>

            <p id="bet_money_text"></p>
            <p id="prize_text"></p>
            <p id="current_coins_text"></p>

        </div>
    )
}