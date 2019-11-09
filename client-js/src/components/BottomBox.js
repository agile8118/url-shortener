import React, { Component } from "react";
import axios from "axios";
import Urls from "./Urls";
import SignInBox from "./SignInBox";

class BottomBox extends Component {
  state = { isSignedIn: null, email: "" };

  async componentDidMount() {
    const { data } = await axios.post("/auth");
    this.setState({ isSignedIn: data.isSignedIn, email: data.email });
  }

  render() {
    if (this.state.isSignedIn) {
      return <Urls email={this.state.email} />;
    } else if (this.state.isSignedIn === false) {
      return <SignInBox />;
    } else {
      return <div />;
    }
  }
}

export default BottomBox;
