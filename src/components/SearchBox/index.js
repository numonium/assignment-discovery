import React, { Component } from 'react';
import { getURL } from '../../util';
import './index.css';

class SearchBox extends Component {
  constructor() {
    super();

    this.state = {
      value : null
    };

  }

  componentWillMount() {
    this.setState({ provider : this.props.provider || '2flickr'});
  }

  /*async*/ search(data, callback){

    let tokens = {
      'API_KEY' : window.API.flickr.key,
      'Q': data.q
    };    

    let url = getURL('q', tokens, this.state.provider);

    fetch(url)
      .then(response => response.json())
      .then(results => {

        if(callback){
          callback(data, results);
        }

      })
      .catch(error => {

        if(this.props.errorCallback){
          this.props.errorCallback(error);
        }else{
          throw error;
        }

      });
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    let data = {
      q : this.state.value
    };

    return this.search(data, this.props.queryCallback);
  }

  render() {
    return (
      <div className="SearchBox">
          <input type="text" name="q" onKeyUp={ (e) => { this.handleChange(e); } } placeholder="Enter search query" />
          <button onClick={ (e) => { this.handleSubmit(e); } }>»</button>
      </div>
    );
  }
}

export default SearchBox;
