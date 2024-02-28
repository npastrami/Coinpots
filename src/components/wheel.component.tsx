import React, { useEffect, useRef } from 'react';
import { Wheel as SpinWheel } from './spin-wheel-esm';
import * as easing from './easing.js';
import { loadFonts } from './utils';
import { props } from './props';

const Wheel = () => {
  const wheelWrapperRef = useRef(null);
  const wheelInstanceRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      await loadFonts(props.map(i => i.itemLabelFont));

      if (!wheelWrapperRef.current) {
        return;
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
  }, []);

  const spinRandom = () => {
    // Calculate a random rotation for 5-6 full rotations
    const rotations = 5 + Math.floor(Math.random() * 2);
    const rotation = rotations * 360;

    // Spin the wheel
    if (wheelInstanceRef.current) {
      (wheelInstanceRef.current as any).spin(rotation); // Adjust this line according to your SpinWheel implementation
    }
  };

  return (
    <div>
      <div className="wheel-wrapper" ref={wheelWrapperRef} />
      <button onClick={spinRandom}>Spin</button>
    </div>
  );
};

export default Wheel;