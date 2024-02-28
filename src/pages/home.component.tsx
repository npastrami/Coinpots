import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import Wheel from "../components/wheel.component";

const Home = () => {
  const [content, setContent] = useState("");
  const players = [
    // This should be dynamic or fetched from a service
    { username: "Player 1", amount: 10 },
    { username: "Player 2", amount: 20 },
    // Add more players as needed
  ];

  useEffect(() => {
    UserService.getPublicContent().then(
      response => {
        setContent(response.data);
      },
      error => {
        const errorMsg =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        setContent(errorMsg);
      }
    );
  }, []); // The empty array ensures this effect runs only once after the initial render

  return (
    <div className="container">
      <header className="jumbotron">
        <Wheel />
      </header>
    </div>
  );
};

export default Home;
