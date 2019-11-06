import React, { Component } from "react";
import axios from "axios";
import lib from "../lib";

class UrlShortener extends Component {
  constructor(props) {
    super(props);

    this.state = { url: "" };

    this.loadingButton = React.createRef();
    this.shortenButton = React.createRef();
    this.tooltipText = React.createRef();
    this.box = React.createRef();
    this.message = React.createRef();
    this.link = React.createRef();
    this.realLinkDisplay = React.createRef();
    this.shortenedLink = React.createRef();
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
        this.setState({ url: "" });
        this.link.current.classList.remove("display-none");

        if (realUrl.length > 35) {
          this.realLinkDisplay.current.innerHTML =
            realUrl.substring(0, 35) + "...";
        } else {
          this.realLinkDisplay.current.innerHTML = realUrl;
        }

        this.shortenedLink.current.innerHTML = shortenedUrl;
        this.shortenedLink.current.href = shortenedUrl;

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

  onCopyButtonClick() {
    // Grap the text from the shortened link tag and copy it to the clipboard
    var text = this.shortenedLink.current.innerHTML;
    navigator.clipboard.writeText(text).then(function() {});

    // Represent to the user that the link was copied
    this.tooltipText.current.innerHTML = "Copied!";
  }

  showError(msg) {
    this.box.current.classList.add("box--error");
    this.message.current.innerHTML = msg;
    this.link.current.classList.add("display-none");
    this.realLinkDisplay.current.innerHTML = "";
    this.shortenedLink.current.innerHTML = "";
    this.shortenedLink.current.href = "";

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

        <div className="link display-none" ref={this.link}>
          <div className="link__real" ref={this.realLinkDisplay}></div>
          <div className="link__shortened">
            <a ref={this.shortenedLink} target="_blank" href=""></a>
            <div className="tooltip">
              <button
                onClick={() => {
                  this.onCopyButtonClick();
                }}
                onMouseLeave={() => {
                  this.tooltipText.current.innerHTML = "Copy";
                }}
                className="link__copy"
              >
                <img src="/copy-document.svg" />
              </button>
              <span ref={this.tooltipText} className="tooltip__text">
                Copy
              </span>
            </div>
          </div>
        </div>
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
