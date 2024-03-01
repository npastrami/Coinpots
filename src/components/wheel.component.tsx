import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Wheel as SpinWheel } from './spin-wheel-esm';
import * as easing from './easing.js';
import { loadFonts } from './utils';
import { props as initialProps } from './props';
import './wheel.css';
import axios from 'axios';

interface WheelItem {
  label: string;
  backgroundColor?: string; // Make optional if not all items have this
  labelColor?: string;
  weight?: number; // Make optional if you're adding it dynamically
}

const Wheel = () => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [props, setProps] = useState(initialProps);
  const wheelWrapperRef = useRef<HTMLDivElement>(null);
  const wheelInstanceRef = useRef(null);
  const [wheelKey, setWheelKey] = useState(0);

  useEffect(() => {
    const init = async () => {
      await loadFonts(props.map(i => i.itemLabelFont));

      // Make sure to clean up the previous wheel instance if it exists
      if (wheelWrapperRef.current && wheelWrapperRef.current.firstChild) {
        wheelWrapperRef.current.removeChild(wheelWrapperRef.current.firstChild);
      }

      const wheel = new SpinWheel(wheelWrapperRef.current);
      wheelInstanceRef.current = wheel as any; // Update the type of wheelInstanceRef to allow assignment of the wheel object.

      // Find the "Money" theme in the props array
      const moneyTheme = props.find(p => p.name === 'Money');

      if (moneyTheme) {
        // Initialize the wheel with the "Money" theme
        wheel.init({
          ...moneyTheme,
          rotation: wheel.rotation, // Preserve value.
        });
      }

      // Save object globally for easy debugging.
      (window as any).myWheel = wheel;
    };

    init();
  }, [props, wheelKey]);

  const animateWheelToPosition = (winningPosition: number) => {
    const rotations = 5; // Spin the wheel 5 times for visual effect
    const totalRotation = (rotations * 360) + winningPosition; // Ensure the wheel spins 5 times then lands on the winning position
  
    (wheelInstanceRef.current as any).spin(totalRotation); // Adjust based on your wheel's API
  };

  const spinRandom = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/jackpot/spin');
      const { winner, position } = response.data;
      console.log("Winner: ", winner); // Debugging
      // You'll need to adjust your wheel logic to accept the position and animate to it
      animateWheelToPosition(position); // Implement this function based on your wheel's API
    } catch (error) {
      console.error("Error spinning the wheel: ", error);
    }
  };

  const addSlice = async () => {
    // Assuming `currentUser` holds the username of the logged-in user
    const currentUser = "username"; // Replace this with actual logic to get the current user's username
    const newAmount = Number(amount);
    if (!currentUser || newAmount <= 0) {
      console.error("Invalid user or amount");
      return;
    }
  
    try {
      await axios.post('http://localhost:8080/api/jackpot/addEntry', {
        username: currentUser,
        amount: newAmount,
        // wallet_id and transaction_id can be omitted or set to null explicitly if your backend handles it
      });
      console.log("Entry added successfully");
    } catch (error) {
      console.error("Error adding entry: ", error);
    }
  
    // Clear inputs after sending data
    setLabel('');
    setAmount('');
  };

  return (
    <div>
      <div className="container">
      <h3>10 Min BTC Jackpot</h3>
      <div key={wheelKey} className="wheel-wrapper" ref={wheelWrapperRef} style={{ height: '300px', width: '500px' }} />
      <button onClick={spinRandom}>Spin</button>
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <button onClick={addSlice}>Enter</button>
      </div>
    </div>
  );
};

export default Wheel;