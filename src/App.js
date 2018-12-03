import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Home from './Home';
import HeaderNav from './HeaderNav';
import ArtistContainer from './ArtistContainer';
import PlaylistContainer from './PlaylistContainer';
import ProfileContainer from './ProfileContainer';
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
      user_profile: {
        spotify_image: '',
        spotify_display_name: '',
        spotify_id: ''
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

  handleTokens(){

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

  getSpotifyProfile = async () => {
    const csrfCookie = getCookie('csrftoken');
    const spotifyProfile = await fetch('http://127.0.0.1:8000/profile/?access_token=' + this.state.spotify_tokens.access_token, {
      'credentials': 'include',
      headers: {
        'X-CSRFToken': csrfCookie
      }
    });
    const spotifyProfileParsedJSON = await spotifyProfile.json();
    console.log(`---------- spotifyProfileParsedJSON ----------\n`, spotifyProfileParsedJSON);
    return spotifyProfileParsedJSON.data    
  }

  componentDidUpdate(){
    console.log(`---------- this.state in componentDidUpdate ----------\n`, this.state)
    if (this.state.user_profile.spotify_display_name === ''){

      this.getSpotifyProfile().then(profile => {

        console.log(`---------- profile ----------\n`, profile)

        this.setState({
          user_profile: {
            spotify_image: profile.images[0].url,
            spotify_display_name: profile.display_name,
            spotify_id: profile.id
          }
        })

      }).catch(err => {
        console.error(`Error: `, err);
      });
    }
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

          // {this.state && this.state.access_token ?  
          //   (<Route exact path="/home" render={ (props) =>
          //                 <Home {...props}
          //                   spotify_tokens={this.state.spotify_tokens} 
          //                 /> }
          //               />) : (<p>Welcome!</p>)
          // }
  render() {
    console.log(`---------- this.state in App ----------\n`, this.state);
    return (
      <div className="App">
        <HeaderNav handleLogout={this.handleLogout} />

        <Switch>
          <Route exact path="/" render={ Login } />
          <Route exact path="/artists" component={ ArtistContainer } />
 
            <Route exact path="/home" render={ (props) =>
                          <Home {...props}
                            spotify_tokens={this.state.spotify_tokens} 
                          /> }
                        />
          

          <Route exact path="/profile" render={ (props) =>
            <ProfileContainer {...props}
              spotify_tokens={this.state.spotify_tokens}
              user_profile={this.state.user_profile}
            />
           } />

          <Route exact path="/playlists" render={ (props) => 
            <PlaylistContainer {...props} 
              spotify_tokens={this.state.spotify_tokens} 
              handleTokens={this.handleTokens}
            />}
          />
          <Route component={ My404 }/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
