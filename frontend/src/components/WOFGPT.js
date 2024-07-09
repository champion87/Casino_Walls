import React, { useState, useRef, useEffect } from 'react';
import './WheelOfFortune.css'; // Include your styles here

const WheelOfFortune = ({ values, degrees }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  useEffect(() => {
    if (degrees !== null && degrees !== undefined) {
      spinWheel(degrees);
    }
  }, [degrees]);

  const spinWheel = (degrees) => {
    if (isSpinning) return;
    setIsSpinning(true);

    const newRotation = rotation + degrees + (360 * 5); // Adding extra spins for effect
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
    }, 5000); // Assuming 5 seconds for the spin duration
  };

  return (
    <div className="wheel-container">
      <div
        className={`wheel ${isSpinning ? 'spinning' : ''}`}
        style={{ transform: `rotate(${rotation}deg)` }}
        ref={wheelRef}
      >
        {values.map((value, index) => (
          <div
            key={index}
            className="wheel-segment"
            style={{ transform: `rotate(${index * (360 / values.length)}deg)` }}
          >
            {value}
          </div>
        ))}
      </div>
      <div className="wheel-pointer">▼</div>
    </div>
  );
};

export default WheelOfFortune;
