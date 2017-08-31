import React, { Component } from 'react';
import SearchBox from '../SearchBox';
import logo from '../../img/logo.png';
import logo_uv from '../../img/uv-logo-white.png';
import './index.css';

import { API } from '../../cfg.json';
window.API = API;

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      view : 'home',
      q : null,
      videos : null, 
      provider: 'youtube',
      error: 1,
    };

  }

  home(){
    this.setState({view : 'home'});
  }

  search(data, results){
    this.setState({
      error: false,
      q: data.q,
      photos : results
    });

  }

  searchError(error){
    this.setState({
      error
    });
  }

  renderVideos(photos='', timer=3000){

    let numVideos = 0;

    return (
      <div>
        <h2> { numVideos + ' Videos' + (numVideos !== 1 ? 's' : '') + ' Found' }</h2>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App--header">
          <a href="javascript:;" onClick={(e) => { this.home(e) }}>
            <img className="App--header--logo" src={logo} alt="Assignment Discovery" height="100%" />
          </a>
          <SearchBox
            provider={ this.state.provider }
            queryCallback={ this.search.bind(this) }
            errorCallback={ this.searchError.bind(this) } />
        </header>
        <div className="App--content">
          { this.state.error ? (
              <h2>Apologies, we had issues fetching this content right now</h2>
            ) : this.renderVideos( this.state.photos ) }
        </div>
        <footer className="App--footer">
          <div className="App--footer--inner">
            <p>&copy; 2017 &ndash; Prepared Exclusively for <strong>Discovery Communications</strong></p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
