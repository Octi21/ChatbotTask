import './App.css';
import Message from './components/Message';
import Response from './components/Response';
import TypeBar from './components/TypeBar';

import React, { useState, useEffect, useRef } from 'react';


function App() {


  const [data, setData] = useState([])  // json data prom the backend 

  const [command, setCommand] = useState("displayStocks")  // what is the current chatbot command 

  const [stock, setStock] = useState("")   //

  const [stockList, setStockList] = useState([])   // 

  const [inputValue, setInputValue] = useState(""); 

  const [messages, setMessages] = useState([      // list of messages from the chat
    {
      sender: 'bot',
      text: 'Hello! Welcome to LSEG. I’m here to help you.',
    }
    
  ]);

  const chatboxRef = useRef(null);
  const messageAddedRef = useRef(false); 

  // auto scroll
   useEffect(() => {    
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]); 


  // fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/data');
        const result = await response.json();
        setData(result);

        if (!messageAddedRef.current) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: 'bot',
              text: 'Please select a Stock Exchange:',
              options: result.map((exchange) => exchange.stockExchange),
            },
          ]);
          messageAddedRef.current = true;
        }
      } catch (error) {
        console.error('Error fetching stock exchanges:', error);
      }
    };

    fetchData();
  }, []);



  // handle the user response
  const handleUserResponse = (text) => {
    const newMessage = {
      sender: 'user',
      text,
    };

    setMessages([...messages, newMessage]);  // add user message to chat


    // we handle the situation based on the command value
    
    // handle behavior when command is "displayStocks"
    if(command === "displayStocks")
    { 
      const listOfOptions = data.map((exchange) => exchange.stockExchange);


      const exchange = data.find(
        (exchange) => exchange.stockExchange.toLowerCase() === text.toLowerCase()
      );

      // if a valid exchange is selected
      if(exchange)
      {
        setStock(exchange.stockExchange)
        setStockList(exchange.topStocks)

        const listOfTopStocks = exchange.topStocks.map((stock) => stock.stockName);

        // update chatbot with top stocks of the selected exchange
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: 'bot',
            text: 'Please select a Stock:',
            options: exchange.topStocks.map((stock) => stock.stockName),
          }
        ]);

        setCommand("displayTopStocks");

      }

    }

    if(command === "displayTopStocks")
    {
      const selectExchange = stockList.find(
        (exchange) => exchange.stockName.toLowerCase() === text.toLowerCase()
      );

      // if a valid exchange is selected
      if(selectExchange)
      {
        
        // provide info for top stocks of the selected exchange
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: 'bot',
            text: `Stock Price of ${selectExchange.stockName} is ${selectExchange.price}. Please select an option`,
            options: ["Main menu", "Go Back"],
          }
        ]);
        setCommand("whatNext");
      }
      
    }

    
    // handle behavior when command is "whatNext"
    if(command === "whatNext")
    {
      if(text === "Main menu")
      {
        setCommand("displayStocks"); // reset command to "displayStocks"
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: 'bot',
            text: 'Please select a Stock Exchange:',
            options: data.map((exchange) => exchange.stockExchange),
          }
        ]);


      }
      if(text === "Go Back")
      {
        setCommand("displayTopStocks"); // reset command to "displayTopStocks"
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: 'bot',
            text: 'Please select a Stock:',
            options:stockList.map((stock) => stock.stockName),
          }
        ]);
      }

    }

    

  }

  const handleOptionClick = (option) => {
    setInputValue(option);
  };
  

  
  return (
    <div className="app">

      <div className="header">
        <h1>LSEG Chatbot</h1>
      </div>

      <div className="chatbox" ref={chatboxRef}>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.sender === 'bot' ? (
              <Response message={msg.text} options={msg.options} onOptionClick={handleOptionClick} />
            ) : (
              <Message message={msg.text} />
            )}
          </div>
        ))}
      </div>

      <TypeBar onSend={handleUserResponse} inputValue={inputValue} setInputValue={setInputValue} />

    </div>
  );
}

export default App;
