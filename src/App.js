import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Home from './Home';
import HeaderNav from './HeaderNav';
import ArtistContainer from './ArtistContainer';
import PlaylistContainer from './PlaylistContainer';
import { Route, Switch, withRouter } from 'react-router-dom';
import getCookie from 'js-cookie';
import serverURL from './serverURL.js';
import queryString from 'query-string'


const My404 = () => {
  return (
    <div>
      You're lost, will you even be found?
    </div>
    )
}


class App extends Component {
  constructor(){
    super();
    this.state = {
      spotify_tokens: {
        access_token: '',
        expires_in: null,
        refresh_token: '',
        scope: '',
        token_type: ''
      },
      }
    }

  getSpotifyTokens = async (props) => {
    const csrfCookie = getCookie('csrftoken');
    const values = queryString.parse(this.props.location.search)
    const tokens = await fetch('http://127.0.0.1:8000/tokens/?code=' + values.code, {
      'credentials': 'include',
      headers: {
        'X-CSRFToken': csrfCookie
      }
    });
    const tokensParsedJSON = await tokens.json();
    console.log(`---------- tokensParsedJSON ----------\n`, tokensParsedJSON);
    return tokensParsedJSON.data
  }

  componentDidMount(){
    this.getSpotifyTokens().then(tokens => {

    console.log(`---------- tokens ----------\n`, tokens);

      this.setState({
        spotify_tokens:{
          access_token: tokens.access_token,
          expires_in: tokens.expires_in,
          refresh_token: tokens.refresh_token,
          scope: tokens.scope,
          token_type: tokens.token_type
        }
      });

    }).catch((err) => {
      console.error(`---------- Error: ----------\n`, err);
    });
  }


  handleLogout = async (e) => {
    e.preventDefault();

    try {
      const cookie = getCookie('csrftoken');  
      const logoutRequest = await fetch(serverURL + 'logout/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': cookie
        }
      })

      const logoutRequestParsed = await logoutRequest.json();

      if (logoutRequestParsed.data === 'Logout Successful') {
        this.props.history.push('/login')                               // Redirect to Spotify Login
      
      } else {
        console.error(`logoutRequestParsed.error: `, logoutRequestParsed.error);
      }

    } catch(err){
      console.error(`Error catch in handleLogout: `, err);
    }
  }

  render() {
    console.log(`---------- this.state in App ----------\n`, this.state);
    return (
      <div className="App">
        <HeaderNav handleLogout={this.handleLogout}/>

        <Switch>
          <Route exact path="/" render={ Login } />
          <Route exact path="/home" render={ Home } />
          <Route exact path="/artists" component={ ArtistContainer } />
          <Route exact path="/playlists" render={ (props) => {
            <PlaylistContainer {...props} 
              tokens={this.state.spotify_tokens} 
              handleTokens={this.handleTokens}
            />}}
          />
          <Route component={ My404 }/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
