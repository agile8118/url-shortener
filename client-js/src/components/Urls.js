import React, { Component } from "react";
import axios from "axios";
import LinkShow from "./LinkShow";
import Loading from "./Loading";

class Urls extends Component {
  state = { urls: null, domain: null };

  async componentDidMount() {
    const { data } = await axios.get("/url");

    this.setState({ urls: data.urls, domain: data.domain });
  }

  renderUrls() {
    // Data has not came from database yet
    if (!this.state.urls) {
      return <Loading />;
    }

    // User has urls
    if (this.state.urls.length > 0) {
      return this.state.urls.map(url => {
        return (
          <LinkShow
            key={url.id}
            realUrl={url.real_url}
            onList={true}
            shortenedUrl={`${this.state.domain}${url.shortened_url_id}`}
          />
        );
      });
    }

    // User has no url
    if (this.state.urls.length === 0) {
      return (
        <p className="text-center a-3">
          No URL yet. Try one by putting a URL in the input above.
        </p>
      );
    }
  }

  render() {
    return (
      <div>
        <section className="section section--2">
          <h2>URLs you have shortened with this account</h2>
          {this.renderUrls()}
        </section>
        <p className="a-2">
          Signed in as {this.props.email}. <a href="/logout">Singout.</a>
        </p>
      </div>
    );
  }
}

export default Urls;
