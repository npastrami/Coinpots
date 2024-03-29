import React, { Component, createRef } from "react";
import UserService from "../services/user.service";
import Wheel, { WheelHandle } from "../components/wheel.component";
import Timer from '../components/timer';

// Define an interface for the component's state
interface HomeState {
  content: string;
  timerKey: number; // Include the timerKey in the state interface
}

export default class Home extends Component<{}, HomeState> {
  constructor(props: any) {
    super(props);

    this.state = {
      content: "",
      timerKey: 0 // Initialize the timerKey in the state
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

  wheelRef = createRef<WheelHandle>();

  handleTimerEnd = () => {
    console.log('Timer ended. Handling in Home.');
    if (this.wheelRef.current) {
      this.wheelRef.current.handleTimerEnd();
    }
     // 15 seconds delay
  };

  handleCycleComplete = () => {
    console.log('Timer restarted. synced with backend.');
    if (this.wheelRef.current) {
      this.wheelRef.current.handleTimerEnd();
    }
    // This function will be called when the Wheel's cycle is complete
    this.setState(prevState => ({
      timerKey: prevState.timerKey + 1
    }));
  };


  render() {
    const { timerKey } = this.state;
    return (
      <div className="container">
        <header className="jumbotron">
          <Timer key={timerKey} onTimerEnd={this.handleTimerEnd} />
          <Wheel ref={this.wheelRef} onCycleComplete={this.handleCycleComplete} />
        </header>
      </div>
    );
  }
}