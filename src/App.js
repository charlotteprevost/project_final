import React, { Component } from 'react';
import './App.css';

import PlaylistContainer from './PlaylistContainer';
import CalendarContainer from './CalendarContainer';
import ProfileContainer from './ProfileContainer';
import ArtistContainer from './ArtistContainer';
import EventContainer from './EventContainer';
import HeaderNav from './HeaderNav';
import Login from './Login';
import Home from './Home';

import { Route, Switch, withRouter } from 'react-router-dom';
import getCookie from 'js-cookie';
import serverURL from './serverURL.js';
import queryString from 'query-string'


const My404 = () => {
  return (
    <div>
      "You're lost, will you even be found?" <br/>
      -- Jim
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
      artists: [],
      playlists: [],
      calendar: []
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
    // console.log(`---------- tokensParsedJSON ----------\n`, tokensParsedJSON);
    return tokensParsedJSON.data
  }

  handleTokens(){
  }

  getSpotifyData = async () => {

    // ---------------------------------------- GET PROFILE DATA ---------------------------------------- //

    let csrfCookie = getCookie('csrftoken');
    const spotifyProfile = await fetch('http://127.0.0.1:8000/profile/?access_token=' + this.state.spotify_tokens.access_token, {
      'credentials': 'include',
      headers: {
        'X-CSRFToken': csrfCookie
      }
    });
    const spotifyProfileParsedJSON = await spotifyProfile.json();
    console.log(`---------- spotifyProfileParsedJSON.data ----------\n`, spotifyProfileParsedJSON.data);

    const spotifyProfileData = spotifyProfileParsedJSON.data

    // ---------------------------------------- GET PLAYLISTS DATA ---------------------------------------- //

    csrfCookie = getCookie('csrftoken');                                // New cookie?

    const getPlaylists = await fetch('http://127.0.0.1:8000/playlists-tracks/?access_token=' + this.state.spotify_tokens.access_token, {
      'credentials': 'include',
      headers: {
        'X-CSRFToken': csrfCookie
      }
    });

    const playlistsParsedJSON = await getPlaylists.json();

    console.log(`---------- playlistsParsedJSON.data ----------\n`, playlistsParsedJSON.data);

    const playlists = playlistsParsedJSON.data;

    let artistsArray = [];

    for (let i = 0; i < playlists.length; i++) {
      for (let j = 0; j < playlists[i].items.length; j++) {
        for (let k = 0; k < playlists[i].items[j].track.artists.length; k++) {
          const artist = {
            name: playlists[i].items[j].track.artists[k].name,
            href: playlists[i].items[j].track.artists[k].href,
            id: playlists[i].items[j].track.artists[k].id
          }
          artistsArray.push(artist)
        }
      }
    }

    console.log(`---------- artistsArray ----------\n`, artistsArray);

    // ---------- Remove artist duplicates from artistsArray ---------- //
    
    let artistObject = {};

    for (let i = 0, len = artistsArray.length; i < len; i++) {
      artistObject[artistsArray[i]['name']] = artistsArray[i];
    }

    const uniqueArtistsArray = [];

    for (let key in artistObject) {
      uniqueArtistsArray.push(artistObject[key]);
    }

    console.log(`---------- uniqueArtistsArray ----------\n`, uniqueArtistsArray);

    // ---------------------------------------- GET ARTISTS DATA ---------------------------------------- //

    // Spotify allows concatenated queries, but of only 50 artist ids at a time
    // --> Make array of concatenated strings (<=50)

    const artistsDataFull = [];

    let stringOfFifties = '';

    let arrayOfStringFifties = [];

    for (let i = 0; i < uniqueArtistsArray.length; i++) {
      if (i === 0) {                                                        // If first string:
        stringOfFifties = uniqueArtistsArray[i].id;                         // Make first
      } else if (i % 48 === 0 && i !== 0) {                                 // If reached 50:
        arrayOfStringFifties.push(stringOfFifties);                         // Add big string to array
        stringOfFifties = '';                                               // Empty big string
      } else if (i % 48 !== 0 && i !== 0) {                                 // Otherwise:
        if (stringOfFifties === '') {
          stringOfFifties = uniqueArtistsArray[i].id;
        } else {
          stringOfFifties = stringOfFifties + '%2C' + uniqueArtistsArray[i].id; // Concatenate
        }
      }
    }

    console.log(`---------- arrayOfStringFifties ----------\n`, arrayOfStringFifties);

    let artistsParsedJSON = null;

    for (let i = 0; i < arrayOfStringFifties.length; i++) {

      csrfCookie = getCookie('csrftoken');                                // New cookie?
      const getArtists = await fetch('http://127.0.0.1:8000/artists/?access_token=' + this.state.spotify_tokens.access_token 
                                        + '&ids=' + arrayOfStringFifties[i], {
        'credentials': 'include',
        headers: {
          'X-CSRFToken': csrfCookie
        }
      });

      // let artistsParsedJSON = await getArtists.json();
      artistsParsedJSON = await getArtists.json();

      // artistsParsedData = 

      console.log(`---------- artistsParsedJSON ----------\n`, artistsParsedJSON);



      for (let j = 0; j < artistsParsedJSON.data.artists.length; j++) {
        artistsDataFull.push(artistsParsedJSON.data.artists[j]);
      }
    }

    console.log(`---------- artistsDataFull END ----------\n`, artistsDataFull);

    const newState = {
      user_profile: {
        spotify_image: spotifyProfileData.images[0].url,
        spotify_display_name: spotifyProfileData.display_name,
        spotify_id: spotifyProfileData.id
      },
      artists: artistsDataFull,
      playlists: playlists
    }

    return newState;   
  }

  createShowDownUser = async (user) => {

    let csrfCookie = getCookie('csrftoken');
    const createdUser = await fetch('http://127.0.0.1:8000/register/', {
      method: 'POST',
      body: JSON.stringify(user),
      'credentials': 'include',
      headers: {
        'X-CSRFToken': csrfCookie,
        'Content-Type': 'application/json'
      }
    });
    const createdUserParsedJSON = await createdUser.json();

    console.log(`---------- createdUserParsedJSON ----------\n`, createdUserParsedJSON);
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

  handleArtists = async (artists) => {
    this.setState({
      artists: artists
    })
  }

  addEvent = async (event, e) => {
    e.preventDefault();

    try {

      // if (event.venue.display_name === undefined) {
      //   venue = ''
      // }
      console.log(`---------- THE EVENT ---------- \n `, event);

      const dataToSend = {
        spotify_id: this.state.user_profile.spotify_id,
        event_id: event.id,
        venue: event.venue.displayName,
        city: event.location.city,
        date: event.start.date,
        uri: event.uri
      };
      console.log(`---------- dataToSend ---------- \n `, dataToSend);

      const csrfCookie = getCookie('csrftoken');
      console.log(`---------- csrfCookie ---------- \n `, csrfCookie);

      const createdEvent = await fetch('http://127.0.0.1:8000/event-new/', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfCookie
        }
      });

      const createdEventParsed = await createdEvent.json();

      console.log(`---------- createdEventParsed ---------- \n `, createdEventParsed);

      // this.setState({
      //   calendar: [...this.state.calendar, createdEventParsed.data]
      // })

    } catch(err) {
      console.error(`Error: `, err);
    }
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

  componentDidUpdate(){
    console.log(`---------- this.state in componentDidUpdate ----------\n`, this.state)
    if (this.state.user_profile.spotify_display_name === ''){

      this.getSpotifyData().then(newState => {

        console.log(`---------- newState ----------\n`, newState)

        this.createShowDownUser(newState.user_profile);

        this.setState({
          user_profile: newState.user_profile,
          artists: newState.artists,
          playlists: newState.playlists
        })

      }).catch(err => {
        console.error(`Error: `, err);
      });
    }
  }

  render() {
    console.log(`---------- this.state in App ----------\n`, this.state);
    return (
      <div className="App">
        <HeaderNav handleLogout={this.handleLogout} />

        <Switch>
          <Route exact path="/" render={ Login } />
 
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

          <Route exact path="/artists" render={ (props) => 
            <ArtistContainer {...props} 
              // spotify_tokens={this.state.spotify_tokens} 
              // handleTokens={this.handleTokens}
              // handlePlaylists={this.handlePlaylists}
              // handleArtists={this.handleArtists}
              artists={this.state.artists}
            />}
          />

          <Route exact path="/playlists" render={ (props) => 
            <PlaylistContainer {...props} 
              spotify_tokens={this.state.spotify_tokens} 
              handleTokens={this.handleTokens}
              handlePlaylists={this.handlePlaylists}
            />}
          />

          <Route exact path="/events" render={ (props) => 
            <EventContainer {...props} 
              // spotify_tokens={this.state.spotify_tokens} 
              // handleTokens={this.handleTokens}
              // handlePlaylists={this.handlePlaylists}
              // handleArtists={this.handleArtists}
              artists={this.state.artists}
              addEvent={this.addEvent}
            />}
          />

          <Route exact path="/events" render={ (props) => 
            <CalendarContainer {...props} 
              // spotify_tokens={this.state.spotify_tokens} 
              // handleTokens={this.handleTokens}
              // handlePlaylists={this.handlePlaylists}
              // handleArtists={this.handleArtists}
              artists={this.state.calendar}
              // addEvent={this.addEvent}
            />}
          />
          <Route component={ My404 }/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
