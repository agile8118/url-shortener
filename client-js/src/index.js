import React from "react";
import ReactDOM from "react-dom";

import UrlShortener from "./components/UrlShortener";
import SignInBox from "./components/SignInBox";

ReactDOM.render(<UrlShortener />, document.querySelector("#url-shortener"));
ReactDOM.render(<SignInBox />, document.querySelector("#sign-in-box"));
