import React, { Component } from 'react';
import './App.css';

import PlaylistContainer from './PlaylistContainer';
import ProfileContainer from './ProfileContainer';
import ArtistContainer from './ArtistContainer';
import EventContainer from './EventContainer';
import CalendarList from './CalendarList';
import CalendarEdit from './CalendarEdit';
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
      calendar: [],
      eventToEdit: {
        id: '',
        going: ''
      },
      showEditModal: false
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

  getData = async () => {

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

    // ---------- Remove artist duplicates from artistsArray ---------- //
    
    let artistObject = {};

    for (let i = 0, len = artistsArray.length; i < len; i++) {
      artistObject[artistsArray[i]['name']] = artistsArray[i];
    }

    const uniqueArtistsArray = [];

    for (let key in artistObject) {
      uniqueArtistsArray.push(artistObject[key]);
    }

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

      artistsParsedJSON = await getArtists.json();

      for (let j = 0; j < artistsParsedJSON.data.artists.length; j++) {
        artistsDataFull.push(artistsParsedJSON.data.artists[j]);
      }
    }

    // ---------------------------------------- GET CALENDAR DATA ---------------------------------------- //

    csrfCookie = getCookie('csrftoken');
    const calendarResponse = await fetch('http://127.0.0.1:8000/calendar/', {
      method: 'POST',
      body: JSON.stringify({spotify_id: spotifyProfileData.id}),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfCookie
      }
    });
    const calendarResponseParsedJSON = await calendarResponse.json();
    console.log(`---------- calendarResponseParsedJSON ----------\n`, calendarResponseParsedJSON);

    const calendarResponseData = calendarResponseParsedJSON.data
    console.log(`---------- calendarResponseParsedJSON.data ----------\n`, calendarResponseParsedJSON.data);

    const newState = {
      user_profile: {
        spotify_image: spotifyProfileData.images[0].url,
        spotify_display_name: spotifyProfileData.display_name,
        spotify_id: spotifyProfileData.id
      },
      artists: artistsDataFull,
      playlists: playlists,
      calendar: calendarResponseParsedJSON.data
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

  // handleLogout = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const cookie = getCookie('csrftoken');  
  //     const logoutRequest = await fetch(serverURL + 'logout/', {
  //       method: 'GET',
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-CSRFToken': cookie
  //       }
  //     })

  //     const logoutRequestParsed = await logoutRequest.json();

  //     if (logoutRequestParsed.data === 'Logout Successful') {
  //       this.props.history.push('/login')                               // Redirect to Spotify Login
      
  //     } else {
  //       console.error(`logoutRequestParsed.error: `, logoutRequestParsed.error);
  //     }

  //   } catch(err){
  //     console.error(`Error catch in handleLogout: `, err);
  //   }
  // }

  handleArtists = async (artists) => {
    this.setState({
      artists: artists
    })
  }

  addEvent = async (userEvent, e) => {
    e.preventDefault();

    try {

      console.log(`============EVENT==========\n`, userEvent);

      const dataToSend = {
        spotify_id: this.state.user_profile.spotify_id,
        event_id: userEvent.id,
        venue: userEvent.venue.displayName,
        display_name: userEvent.displayName,
        city: userEvent.location.city,
        date: userEvent.start.date,
        uri: userEvent.uri
      };

      const csrfCookie = getCookie('csrftoken');

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

      // console.log(`============ createdEventParsed ==========\n`, createdEventParsed);
      // console.log(`============ createdEventParsed.data ==========\n`, createdEventParsed.data);

      if (createdEventParsed.data !== undefined) {
        this.setState({
          calendar: [...this.state.calendar, createdEventParsed.data]
        })
      } else {
        this.setState({
          calendar: [...this.state.calendar]
        })
      }


    } catch(err) {
      console.error(`Error: `, err);
    }
  }

  handleEventEditChange = (e, data) => {
    console.log(`------------- e ------------\n`, e.currentTarget);
    console.log(`------------- data ------------\n`, data);

    this.setState({
      eventToEdit: {
        ...this.state.eventToEdit,
        [data.name]: data.value
      }
    });
  }

  closeAndEdit = async (e) => {
    e.preventDefault();

    try {

        if (this.state.eventToEdit.going === 'not') {

          this.eventDelete(this.state.eventToEdit.id);

        } else {
          const csrfCookie = getCookie('csrftoken');

          const editResponse = await fetch('http://127.0.0.1:8000/events/' + this.state.eventToEdit.id + '/edit/', {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({
              going: this.state.eventToEdit.going
            }),
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfCookie
            }
          });

          const editResponseParsed = await editResponse.json();

          const newEventArrayWithEdit = this.state.calendar.map(event => {

            if(event.id === editResponseParsed.data.id){
              event = editResponseParsed.data
            }

            return event
          });

          this.setState({
            showEditModal: false,
            calendar: newEventArrayWithEdit
          });
        }

    } catch(err){
      console.error(`Error: `, err)
    }
  }

  openAndEdit = (eventFromCalendar) => {
    // console.log(`----------- eventFromCalendar -----------\n`, eventFromCalendar);
    this.setState({
      showEditModal: true,
      eventToEdit: {
        ...eventFromCalendar
      }
    })
  }

  eventDelete = async (id) => {

    const csrfCookie = getCookie('csrftoken');

    const eventDeleteResponse = await fetch('http://127.0.0.1:8000/events/' + id + '/delete/', 
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfCookie
        }
      }
    );

    const eventDeleteParsed = await eventDeleteResponse;

    console.log(`---------- eventDeleteParsed ----------\n`, eventDeleteParsed)

    this.setState({
      showEditModal: false,
      calendar: this.state.calendar.filter(event => event.id !== id)
    })
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
    if (this.state.user_profile.spotify_display_name === ''){

      this.getData().then(newState => {

        this.createShowDownUser(newState.user_profile);

        this.setState({
          user_profile: newState.user_profile,
          artists: newState.artists,
          playlists: newState.playlists,
          calendar: newState.calendar
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

        {this.state.showEditModal ? (
            <CalendarEdit open={this.state.showEditModal} eventToEdit={this.state.eventToEdit} 
            handleEventEditChange={this.handleEventEditChange} closeAndEdit={this.closeAndEdit}/>
            ) : null }

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

          <Route exact path="/calendar" render={ (props) => 
            <CalendarList {...props} 
              // spotify_tokens={this.state.spotify_tokens} 
              // handleTokens={this.handleTokens}
              // handlePlaylists={this.handlePlaylists}
              // handleArtists={this.handleArtists}
              // artists={this.state.artists}
              calendar={this.state.calendar}
              openAndEdit={this.openAndEdit}
              eventDelete={this.eventDelete}
              // closeAndEdit={this.closeAndEdit}
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
