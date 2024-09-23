import React from 'react';

function Message({ message }) {
  
    return (
    <div className="user-message">
      <p>{message}</p>
    </div>
  );
}

export default Message;