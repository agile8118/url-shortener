import React, { Component } from "react";
import axios from "axios";
import UrlShortener from "./UrlShortener";
import SignInBox from "./SignInBox";
import Urls from "./Urls";

class App extends Component {
  state = { isSignedIn: null, email: "" };

  async componentDidMount() {
    const { data } = await axios.post("/auth");
    this.setState({ isSignedIn: data.isSignedIn, email: data.email });
  }

  renderBottomBox() {
    if (this.state.isSignedIn) {
      return <Urls email={this.state.email} onRef={ref => (this.urls = ref)} />;
    } else if (this.state.isSignedIn === false) {
      return <SignInBox />;
    } else {
      return <div />;
    }
  }

  render() {
    return (
      <div>
        <UrlShortener
          onNewUrl={() => {
            // Call a method on the child component (Urls)
            this.urls.fetchUrls();
          }}
        />
        {this.renderBottomBox()}
      </div>
    );
  }
}

export default App;
