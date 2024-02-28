import React, { useEffect, useRef } from 'react';
import { Wheel as SpinWheel } from './spin-wheel-esm';

import { loadFonts } from './utils';
import { props } from './props';

const Wheel = () => {
  const wheelWrapperRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      await loadFonts(props.map(i => i.itemLabelFont));

      if (!wheelWrapperRef.current) {
        return;
      }

      const wheel = new SpinWheel(wheelWrapperRef.current);

  const dropdown = document.querySelector('select');

  // Initalise dropdown with the names of each example:
  for (const p of props) {
    const opt = document.createElement('option');
    opt.textContent = p.name;
    if (dropdown) {
      dropdown.append(opt);
    }
  }

  // Handle dropdown change:
  if (dropdown) {
    dropdown.onchange = () => {
      wheel.init({
        ...props[dropdown.selectedIndex],
        rotation: wheel.rotation, // Preserve value.
      });
    };
  }

  // Select default:
  if (dropdown) {
    dropdown.options[0].selected = true;
    if (typeof dropdown.onchange === 'function') {
      dropdown.onchange(new Event('change'));
    }
  }

  // Save object globally for easy debugging.
  (window as any).myWheel = wheel;
};

init();
}, []);

return <div className="wheel-wrapper" ref={wheelWrapperRef} />;
};

export default Wheel;
