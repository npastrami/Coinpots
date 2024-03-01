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

  const addSlice = () => {
    const newProps = [...props];
    const newAmount = Number(amount);
    const newTotalAmount = (newProps[0].items as WheelItem[]).reduce((acc: number, item: WheelItem) => {
      const itemAmount = Number(item.label.replace('$', '').trim());
      return !isNaN(itemAmount) ? acc + itemAmount : acc;
    }, 0);
  
    newProps[0].items.push({
      label: `$ ${amount}`,
      backgroundColor: '', // Add the backgroundColor property here
      labelColor: '',
      weight: newAmount / newTotalAmount, // Use the new total amount here
    });
  
    // Update the weights of all slices
    newProps[0].items = newProps[0].items.map(item => {
      const itemAmount = Number(item.label.replace('$', '').trim());
      return {
        ...item,
        weight: itemAmount / newTotalAmount,
      };
    });
  
    setProps(newProps);
    setLabel('');
    setAmount('');
    setWheelKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      <div className="container">
      <h3>10 Min BTC Jackpot</h3>
      <div key={wheelKey} className="wheel-wrapper" ref={wheelWrapperRef} style={{ height: '300px', width: '500px' }} />
      <button onClick={spinRandom}>Spin</button>
      <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label" />
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <button onClick={addSlice}>Add Slice</button>
      </div>
    </div>
  );
};

export default Wheel;