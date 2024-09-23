import React, { useState } from 'react';

function TypeBar({ onSend , inputValue , setInputValue}) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      onSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="typebar">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Please pick an option..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default TypeBar;