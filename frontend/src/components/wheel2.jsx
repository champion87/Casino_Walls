import React, { useState, useEffect } from 'react';
import { call_api } from "../lib/utils"
import { Button } from '../components/ui/button';

function Wheel2({ onSpin, prizeDisplay }) {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const [prizes, setPrizes] = useState(['×0.5', '×1.5', '×0.7', '×1.2', '×0.9', '×1.1']); //[0.5, 1.5, 0.7, 1.2, 0.9, 1.1]
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    const spinWheel = async () => {
        var arr = await onSpin();
        var mult = arr[0];
        var bet = arr[1];
        var prize = arr[2];
        var coins = arr[3];
        if (mult == -1) {
            return;
        }
        //console.log(mult);
        setSpinning(true);

        try {
            //const response = await call_api("api/games/wheel_of_fortune/get_spin", 'get');
            //const result = await response.json();
            //console.log("result: " + result.prize);
            // console.log("rotation: " + rotation);
            const prizeIndex = prizes.indexOf("×" + mult);

            if (prizeIndex !== -1) {
                const prizeAngle = 360 / prizes.length;
                const targetRotation = 3600 + prizeIndex * prizeAngle;
                const rounded_rotation = 360 * Math.floor(rotation / 360);
                //console.log("prizeAngle: " + prizeAngle);
                //console.log("targetRotation: " + targetRotation);
                //console.log("rounded_rotation: " + rounded_rotation);

                setTimeout(() => {
                    setSpinning(false);
                    setRotation((rounded_rotation) + 30 - targetRotation);
                }, 100);
                await sleep(4100);
                prizeDisplay(bet, prize, coins);
            }
            else { console.log("indexError"); }
        } catch (error) {
            console.error('Error spinning the wheel:', error);
            setSpinning(false);
        }
    };

    return (
        <div style={styles.app}>
            <div style={styles.wheelContainer}>
                <div
                    style={{
                        ...styles.wheel,
                        animation: spinning ? 'spin 1s linear infinite' : 'none',
                        transform: `rotate(${rotation}deg)`,
                        transition: spinning ? 'none' : 'transform 4s ease-out',
                    }}
                >
                    {prizes.map((prize, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.prize,
                                transform: `rotate(${(360 / prizes.length) * index}deg)`,
                            }}
                        >
                            {prize}
                        </div>
                    ))}
                </div>
            </div>
            <div className='bg-green-500 rounded-full h-7 w-2'></div>
            <Button type="button" id="spinButton" className=' w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300'
                onClick={spinWheel}>spin the wheel!</Button>

        </div>
    );
}

const styles = {
    app: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        //height: '100vh',
    },
    wheelContainer: {
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        border: '5px solid #000',
        position: 'relative',
        overflow: 'hidden',
    },
    wheel: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        position: 'absolute',
        top: '0',
        left: '0',
        background: 'conic-gradient(#ff0000 0% 16.67%, #00ff00 16.67% 33.34%, #0000ff 33.34% 50.01%, #ffff00 50.01% 66.68%, #ff00ff 66.68% 83.35%, #00ffff 83.35% 100%)',
    },
    prize: {
        position: 'absolute',
        width: '50%',
        height: '50%',
        top: '50%',
        left: '50%',
        transformOrigin: '0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: '#fff',
        textShadow: '1px 1px 1px #000',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
};


export default Wheel2;
