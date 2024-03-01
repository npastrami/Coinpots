import React, { useState, Component, useEffect } from "react";
import UserService from "../services/user.service";
import Wheel from "../components/wheel.component";

export default class Home extends Component {
  constructor(props: any) {
    super(props);

    this.state = {
      content: ""
    };
  }
  componentDidMount(): void {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <Wheel />
        </header>
      </div>
    );
  }
}