import React, { Component } from "react";
import axios from "axios";
import LinkShow from "./LinkShow";
import lib from "../lib";

class UrlShortener extends Component {
  constructor(props) {
    super(props);

    this.state = { url: "", realUrl: "", shortenedUrl: "" };

    this.loadingButton = React.createRef();
    this.shortenButton = React.createRef();
    this.box = React.createRef();
    this.message = React.createRef();
  }

  async onShortenButtonClick() {
    // Make the button as loading
    this.shortenButton.current.classList.add("display-none");
    this.loadingButton.current.classList.remove("display-none");

    if (lib.validURL(this.state.url)) {
      try {
        const { data } = await axios.post("/url", { url: this.state.url });
        const realUrl = data.realURL;
        const shortenedUrl = data.shortenedURL;

        // Hide the error
        this.hideError();
        this.setState({ url: "", realUrl, shortenedUrl });

        // Make the button as normall
        this.shortenButton.current.classList.remove("display-none");
        this.loadingButton.current.classList.add("display-none");
      } catch (error) {
        if (error.response.status === 400) {
          this.showError(this.responseText);
        }

        if (error.response.status === 500) {
          this.showError(
            "Sorry an unexpected error happened please try again."
          );
        }
      }
    } else if (this.state.url.length > 0) {
      // Show a error to user
      this.showError("The URL you put is not valid.");
    } else {
      // Show a error to user
      this.showError("Please first put your URL here.");
    }
  }

  showError(msg) {
    this.box.current.classList.add("box--error");
    this.message.current.innerHTML = msg;
    this.setState({ realUrl: "", shortenedUrl: "" });

    // Make the button as normall
    this.shortenButton.current.classList.remove("display-none");
    this.loadingButton.current.classList.add("display-none");
  }

  hideError() {
    this.box.current.classList.remove("box--error");
    this.message.current.innerHTML = "";
  }

  render() {
    return (
      <section className="section">
        <h1>URL Shortener App</h1>
        <p>
          Just put your long URL in the text box below and click shorten to get
          a nice small URL.
        </p>

        <div className="box" ref={this.box}>
          <div className="message" ref={this.message}></div>
          <input
            type="text"
            onChange={event => {
              this.setState({ url: event.target.value });
            }}
            onFocus={event => {
              event.target.placeholder = "";
            }}
            onBlur={event => {
              event.target.placeholder = "Put your link here...";
            }}
            value={this.state.url}
            placeholder="Put your link here..."
          />
          <br />
          <button
            type="submit"
            onClick={() => {
              this.onShortenButtonClick();
            }}
            ref={this.shortenButton}
            className="button"
            name="button"
          >
            Shorten
          </button>
          <button
            type="submit"
            ref={this.loadingButton}
            className="button display-none"
            disabled
            name="button"
          >
            Shortening
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </button>
        </div>

        <LinkShow
          realUrl={this.state.realUrl}
          shortenedUrl={this.state.shortenedUrl}
        />

        <p className="a-1">
          By clicking Shorten, you agree to our <a href="#">Privacy Policy</a>{" "}
          and
          <a href="#">Terms of Use</a>.
        </p>
      </section>
    );
  }
}

export default UrlShortener;
