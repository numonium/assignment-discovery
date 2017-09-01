import React, { Component } from 'react';
import { connect } from 'react-redux';
import { yt_search, yt_categories } from '../../redux/actions';
import YouTube from 'react-youtube';
import SearchBox from '../SearchBox';
import { getURL } from '../../util';
import logo from '../../img/logo.png';
import './index.css';

import { API } from '../../cfg.json';
window.API = API;

const VIDEO_MAX_WIDTH = 720;

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      view : 'home',
      q : null,
      videos : null, 
      provider: 'youtube',
      error: null,
      single: null,
      cat: null
    };

  }

  componentDidMount() {
    if(this.isHome()){
      this.featuredCategories();
    }
  }

  componentWillUpdate(nextProps, nextState) {

    if(nextState.cat && (nextState.cat !== this.state.cat)){

      this.searchCategory({
        q: nextState.cat
      });

    }else if((nextState.single !== this.state.single) && !!nextState.single && nextProps.videos && nextProps.videos.items){

      let vid = (typeof nextState.single === 'object' ? nextState.single : nextProps.videos.items[nextState.single]);

      console.warn('yt[search][related]', vid, nextState.single);

      this.search({
        q: vid.id.videoId,
        related: true
      },{}, true);
    }
  }

  home(){
    this.setState({
      view : 'home',
      q : '',
      error : null,
      cat : null
    });
  }

  isHome(state=this.state){
    return !(state.error || state.q || state.single);
  }

  featuredCategories(){
    const { yt_categories } = this.props;

    yt_categories({}).then((results) => {
      console.warn('yt[cats][promise]', results);
    });
  }

  search(data, results, related=false){

    const { yt_search } = this.props;

    let q = {
      q: data.q,
      maxResults: 10,
      videoCategoryId : data.videoCategoryId || null,
      related
    };

    console.warn('yt[search]', related, q, data);

    yt_search(q).then((results) => {
      console.warn('yt[search][complete / promise]', results, related);
    })

    if(!related){
      this.setState({
        error: false,
        q: data.q,
        single: null
      });
    }
  }

  searchCategory({ q='' }){
    return this.search({
      videoCategoryId: q.id
    });
  }

  searchRelated(data){
    return this.search(data,{},true);
  }

  searchError(error){
    this.setState({
      error
    });
  }

  selectCategory(cat){
    this.setState({
      cat
    });
  }

  selectVideo(video){

    this.setState({
      single: video
    });

    console.warn('++ select video', video);
  }

  deselectVideo(){
    this.setState({
      single: null
    });
  }

  renderCategory(cat=this.state.cat){

    let content = this.renderVideos();

    console.warn('yt[cat]', cat.snippet.title);

    return (
      <div>
        <h2>Featured Category - { cat.snippet.title }</h2>
        {content}
      </div>
    );
  }

  renderFeatured(){

    if(!this.props.featuredCategories){
      console.error('err - no featured categories');
    }

    let opts = {
      width: window.innerWidth < VIDEO_MAX_WIDTH ? window.innerWidth : VIDEO_MAX_WIDTH
    };

    let content = [];

    for(var i in this.props.featuredCategories.items){
      if(!this.props.featuredCategories.items.hasOwnProperty(i)){
        continue;
      }

      let cat = this.props.featuredCategories.items[i];

      content.push(
        <a
          key={ i }
          href="javascript:;"
          className="content--preview"
          data-etag={ cat.etag }
          data-channel-id={ cat.snippet.channelId }
          onClick={ function(cat, i){ this.selectCategory(cat); }.bind(this, cat, i) }>{ cat.snippet.title }</a>
      );
    }

    return (
      <div>
        <YouTube videoId={ API.youtube.featured.videoId } opts={ opts } />
        <h2>Featured Categories</h2>
        <div className="content--wrapper">
          {content}
        </div>
      </div>
    );
  }

  renderPreview(video, i){

    let tokens = {
      video_id : video.id.videoId,
      quality : 'mq'
    };

    let url = getURL('img', tokens);

    return (
      <a href="javascript:;" key={i} data-slide onClick={ function(video, i){ this.selectVideo(video, i); }.bind(this, video, i) }>

        { video.snippet.thumbnails && (

          <div data-slide-img>
            <img src={ url } alt={ video.snippet.title } />
          </div>

        )}

        <h3>{ video.snippet.title }</h3>

      </a>
    );
  }

  renderVideos_related(video, videos=this.props.videosRelated){

    if(!videos && !Object.keys(videos).length){
      console.error('err - no related videos');
      return false;
    }

    let slides = [];

    for(var i in videos.items){

      if(!videos.items.hasOwnProperty(i)){
        continue;
      }

      slides.push(this.renderPreview(videos.items[i], i));

    }

    return (
      <div>
        <h3>Related Videos</h3>
        { slides }
      </div>
    );
  }

  renderVideos_single(video, videos=this.props.videos){

    let hasVideos = videos && !!Object.keys(videos).length;

    if(video === undefined || !videos || !hasVideos){
      console.error('no video to play :(', video, videos);
      return false;
    }

    let vid = null;

    if(typeof video === 'object'){
      vid = video;
    }else{
      vid = videos.items[video];
    }

    let opts = {
      width: window.innerWidth
    };

    return (
      <div>

        <YouTube videoId={ vid.id.videoId } opts={ opts } />

        <h3>Playing single video - { vid.snippet.title }</h3>
        <pre>{video + ' / ' + vid.id.videoId}</pre>
        <a href="javascript:;" onClick={ () => { this.deselectVideo() } }>Back to List</a>
        { this.renderVideos_related(vid) }

      </div>
    );
  }

  renderVideos(videos=this.props.videos, timer=3000){

    if(this.state.single){
      return this.renderVideos_single(this.state.single);
    }

    let hasVideos = videos && !!Object.keys(videos).length;

    if(!videos || !hasVideos){
      return (
        <div>
          <h2>No videos found!</h2>
        </div>
      ); 
    }

    let content = [], numVideos = (videos.pageInfo ? videos.pageInfo.totalResults : videos.items.length);

    for(let i in videos.items){

      if(!videos.items.hasOwnProperty(i)){
        continue;
      }

      content.push(this.renderPreview(videos.items[i], i));

    }
    
    return (
      <div>
        { this.state.q && (
          <h2>Search - {this.state.q}</h2>
        )}
        <h2> { numVideos + ' Video' + (numVideos !== 1 ? 's' : '') + ' Found' }</h2>
        { content }
      </div>
    );
  }

  render() {

    let content = '';

    if(this.state.error){
      content = (<h2>Apologies, we had issues fetching this content right now</h2>);
    }else if(this.state.q){
      content = this.renderVideos();
    }else if(this.state.cat){
      content = this.renderCategory(this.state.cat);
    }else{
      content = this.renderFeatured();
    }

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
          { content }
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

function mapStateToProps({ auth, featuredCategories, loading, videos, videosRelated }) {
  return {
    auth,
    featuredCategories,
    loading,
    videos,
    videosRelated
  };
}

function mapDispatchToProps(dispatch) {
  return {
    yt_search: (q) => yt_search(q, dispatch),
    yt_categories: (q) => yt_categories(q, dispatch),
    // activateFamily: (auth, sims, order) => {
    //   dispatch(loading(true));
    //   return activateFamily(auth, sims, order, dispatch);
    // },
    // setLoadingToFalse: () => dispatch(loading(false))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
