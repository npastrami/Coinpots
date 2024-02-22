import React, { useState, useRef } from 'react';
import { Stage, Layer, Arc, Text, Group, Tween } from 'react-konva';

const Wheel = ({ players }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const wheelRef = useRef(null);

  const spinWheel = () => {
    setSpinning(true);
    const totalAmount = players.reduce((sum, player) => sum + player.amount, 0);
    let randomNumber = Math.random() * totalAmount;
    let winnerIndex = 0;
    let accumulatedAmount = 0;

    // Find the winner and the angle to stop at
    for (let i = 0; i < players.length; i++) {
      accumulatedAmount += players[i].amount;
      if (accumulatedAmount >= randomNumber) {
        winnerIndex = i;
        break;
      }
    }

    setWinner(players[winnerIndex]);

    // Calculate the angle to stop at
    let stopAngle = 0;
    for (let i = 0; i < winnerIndex; i++) {
      stopAngle += calculateSectionAngle(i);
    }
    stopAngle += Math.random() * calculateSectionAngle(winnerIndex); // Add a random angle within the winner's section

    // Create a tween to rotate the wheel
    const rotationTween = new Tween({
      node: wheelRef.current,
      duration: 5, // Duration of the spinning animation
      rotation: 360 * 5 + stopAngle, // Spin 5 times plus the stop angle
      easing: Tween.Easing.linear,
      onFinish: () => {
        setSpinning(false);
      },
    });

    // Start the tween
    rotationTween.play();
  };

  const calculateSectionAngle = (playerIndex) => {
    const totalAmount = players.reduce((sum, player) => sum + player.amount, 0);
    return (players[playerIndex].amount / totalAmount) * 360;
  };

  const calculateSectionStartAngle = (playerIndex) => {
    let startAngle = 0;
    for (let i = 0; i < playerIndex; i++) {
      startAngle += calculateSectionAngle(i);
    }
    return startAngle;
  };

  return (
    <div>
      <button onClick={spinWheel} disabled={spinning}>
        Spin the Wheel
      </button>
      <Stage width={500} height={500}>
        <Layer ref={wheelRef}>
          {players.map((player, index) => (
            <Group key={index} rotation={calculateSectionStartAngle(index) + 90}>
              <Arc
                x={250}
                y={250}
                innerRadius={100}
                outerRadius={200}
                angle={calculateSectionAngle(index)}
                fill={winner && winner.username === player.username ? 'green' : 'red'}
                opacity={0.6}
              />
              <Text
                x={250}
                y={250}
                text={player.username}
                fontSize={16}
                align="center"
                verticalAlign="middle"
                rotation={calculateSectionAngle(index) / 2}
              />
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Wheel;