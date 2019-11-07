import React, { Component } from "react";
import axios from "axios";
import Links from "./Links";
import SignInBox from "./SignInBox";

class BottomBox extends Component {
  state = { isSignedIn: null };

  async componentDidMount() {
    const { data } = await axios.post("/auth");
    this.setState({ isSignedIn: data.isSignedIn });
  }

  render() {
    if (this.state.isSignedIn) {
      return <Links />;
    } else if (this.state.isSignedIn === false) {
      return <SignInBox />;
    } else {
      return <div />;
    }
  }
}

export default BottomBox;
