import { useEffect, useState } from "react";
import App from "../App";
import { useParams } from "react-router-dom";

export const BlackJackPage = () => {

    // var my_cards = ["test"]
    // var is_game_over = true
    // var score = 0

    // async function setup() {
    //     hide_game_over()

    //     // /games/black_jack/

    //     response = await fetch("/games/black_jack/first_turn");
    //     json = await response.json();

    //     console.log(json)

    //     update_hand(json.hand)
    //     update_score(json.sum)
    //     is_game_over = json.finish_state
    // }

    // function update_hand(new_hand) {
    //     document.getElementById("hand").innerHTML = new_hand.toString();
    // }

    // function update_score(new_score)
    // {
    //     score = new_score
    //     document.getElementById("score").innerHTML = "Score: " + score  
    // }

    // function choose(choice) {
    //     if (is_game_over) { return; }

    //     console.log('Hello World', choice);
    //     if (choice == 'yes') {
    //         draw_card();
    //     }
    //     else {
    //         fold();
    //     }
    // }

    // var IDs_of_game_over_elements = [
    //     "game_over_text1",
    //     "game_over_text2",
    //     "reply_button",
    //     "lobby_button"
    // ]

    // function hide_game_over() {
    //     game_over("none")
    // }

    // function game_over(visability = "inline") {
    //     IDs_of_game_over_elements.forEach(id => {document.getElementById(id).style.display = visability;})
    // }

    // async function fold() {
    //     response = await fetch("/games/black_jack/fold");
    //     json = await response.json();

    //     console.log(json)

    //     game_over()
    // }

    // // GETs and uploads the new card. Doesn't check game rules.
    // async function draw_card() {
    //     response = await fetch("/games/black_jack/draw");
    //     json = await response.json();

    //     console.log(json)

    //     update_hand(json.hand)
    //     update_score(json.sum)

    //     if (json.finish_state) {
    //         game_over()
    //     }
    // }

    // async function play_again()
    // {

    // }

    // async function back_to_lobby()
    // {
    //     location.href = "/games/black_jack/lobby1"
    // }

    function choose() {
        alert('You clicked me!');
    }

    const [hand, setHand] = useState([]);

    
    const {game_key} = useParams();
    useEffect(() => {

        fetch(`http://127.0.0.1:8000/api/games/${game_key}/blackjack/get_state`).then(response => {
            response.json().then(json => {
                console.log(json)
                setHand(json.hand)

            });

        });
    },
        [])

    return (
        <>
            <title> BLACK JACK </title>

            <p>Wanna draw another card?</p>
            <button onClick={choose}>YES</button>
            {/* <button onClick="choose('no')">NO</button> */}

            <p id="score"></p>
            <p>Your Hand:</p>
            <div style={{ columnGap: 8, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                {hand.map(item => (
                    <div>{item}</div>
                ))}</div>
            <strong id="game_over_text1">GAME OVER!</strong>
            <p id="game_over_text2">Press the button to play again</p>
            {/* <button id="reply_button" onClick="play_again();">Play Again</button> */}
            {/* <button id="lobby_button" onClick="back_to_lobby();">GO Back To Lobby1</button> */}
        </>
    );
}