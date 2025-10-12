import { useEffect } from 'react';

function useKeyboard(keyMap) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if user is typing in an input field
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return;
      }

      const key = event.key;
      
      // Prevent default for Space key
      if (key === ' ') {
        event.preventDefault();
      }

      // Execute the mapped function if it exists
      if (keyMap[key] && typeof keyMap[key] === 'function') {
        event.preventDefault();
        keyMap[key](event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [keyMap]);
}

export default useKeyboard;

// Alternative version with key combinations
export function useKeyboardWithModifiers(keyMap) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return;
      }

      const key = event.key;
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      let keyCombo = '';
      
      if (ctrl) keyCombo += 'Ctrl+';
      if (shift) keyCombo += 'Shift+';
      if (alt) keyCombo += 'Alt+';
      keyCombo += key;

      if (keyMap[keyCombo] && typeof keyMap[keyCombo] === 'function') {
        event.preventDefault();
        keyMap[keyCombo](event);
      } else if (keyMap[key] && typeof keyMap[key] === 'function') {
        event.preventDefault();
        keyMap[key](event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [keyMap]);
}