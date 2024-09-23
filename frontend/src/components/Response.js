import React from 'react';

function Response({ message, options , onOptionClick}) {
  return (
    <div className="response">
      <div className="bot-message">
        <p>{message}</p>
      </div>
      {options && (
        <div className="options">
          {options.map((option, index) => (
            <button key={index} className="option-button"
                onClick={() => onOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Response;