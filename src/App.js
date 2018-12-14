import React, { Component } from 'react';
import './App.css';

import PlaylistContainer from './PlaylistContainer';
import ProfileContainer from './ProfileContainer';
import ArtistContainer from './ArtistContainer';
import EventContainer from './EventContainer';
import CalendarList from './CalendarList';
import CalendarEdit from './CalendarEdit';
import Redirecting from './Redirecting';
import HeaderNav from './HeaderNav';
import SideBar from './SideBar';
import Login from './Login';
import Home from './Home';

import { Route, Switch, withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

import getCookie from 'js-cookie';
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
      showEditModal: false,
    }
  }

  // -------------------------------------------------------------------------------------------------- //
  // ------------------------------------ GET SPOTIFY AUTH TOKENS ------------------------------------- //
  // -------------------------------------------------------------------------------------------------- //

  getSpotifyTokens = async (props) => {
    const csrfCookie = getCookie('csrftoken');
    const values = queryString.parse(this.props.location.search)
    const tokens = await fetch(
      'http://127.0.0.1:8000/tokens/?code=' + values.code, {
        'credentials': 'include',
        headers: {
          'X-CSRFToken': csrfCookie
        }
    });
    const tokensParsedJSON = await tokens.json();
    return tokensParsedJSON.data
  }

  handleTokens(){                               // Will be used for token refresh
  }

  // -------------------------------------------------------------------------------------------------- //
  // --------------------------------------- GET AAALL THE DATA --------------------------------------- //
  // -------------------------------------------------------------------------------------------------- //

  getData = async () => {

    // ------------------------------------- GET PROFILE DATA ------------------------------------- //

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

    const userProfile = {
      spotify_image: spotifyProfileData.images[0].url,
      spotify_display_name: spotifyProfileData.display_name,
      spotify_id: spotifyProfileData.id
    }

    this.createShowDownUser(userProfile);

    // ------------------------------------- GET PLAYLISTS DATA ------------------------------------- //

    csrfCookie = getCookie('csrftoken');
    const getPlaylists = await fetch(
      'http://127.0.0.1:8000/playlists-tracks/?access_token=' 
      + this.state.spotify_tokens.access_token, {
        'credentials': 'include',
        headers: {
          'X-CSRFToken': csrfCookie
        }
    });

    const playlistsParsedJSON = await getPlaylists.json();
    const playlists = playlistsParsedJSON.data;

    // ----- New array for playlists, must be selective with data ----- //

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

    // ------------------------------------- GET ARTISTS DATA ------------------------------------- //

    // ------------- Spotify allows concatenated queries, ------------- //
    // ------------- but of only 50 artist ids at a time -------------- //
    // ----------> Make array of concatenated strings (<=50) ---------- //

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

    // ------------------------ Make API calls ------------------------ //

    for (let i = 0; i < arrayOfStringFifties.length; i++) {

      csrfCookie = getCookie('csrftoken'); 
      const getArtists = await fetch(
        'http://127.0.0.1:8000/artists/?access_token=' 
          + this.state.spotify_tokens.access_token 
          + '&ids=' + arrayOfStringFifties[i], {
            'credentials': 'include',
            headers: {
              'X-CSRFToken': csrfCookie
            }
      });

      const artistsParsedJSON = await getArtists.json();

      // --------------------- Store in new array ---------------------- //

      for (let j = 0; j < artistsParsedJSON.data.artists.length; j++) {
        artistsDataFull.push(artistsParsedJSON.data.artists[j]);
        }
      }


    // ------------------------------------- GET CALENDAR DATA ------------------------------------- //

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

    calendarResponseData.sort(function (a, b) {                      // Sort Events by date ascending
      a = a.date.split('-');                                         // 'YYYY-MM-DD'.split('/')
      b = b.date.split('-');                                         // gives ["YYYY", "MM", "DD"]
      return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
    });


    // -------------- Consolidate what will be new state -------------- //

    const newState = {
      user_profile: {
        spotify_image: spotifyProfileData.images[0].url,
        spotify_display_name: spotifyProfileData.display_name,
        spotify_id: spotifyProfileData.id
      },
      artists: artistsDataFull,
      playlists: playlists,
      calendar: calendarResponseData
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
    e.preventDefault();                                        // Will be used with Sessions
    this.props.history.push('/')                               // For now redirect to Spotify Login
  }

  handleArtists = async (artists) => {
    this.setState({
      artists: artists
    })
  }

  // -------------------------------------------------------------------------------------------------- //
  // --------------------- Create Event in PostgreSQL - Add to Calendar in State ---------------------- //
  // -------------------------------------------------------------------------------------------------- //

  addEvent = async (userEvent, e) => {
    e.preventDefault();

    try {

      // ---------------- Consolidate what will be sent ----------------- //

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

      if (createdEventParsed.data !== undefined) {                      // Because using get_or_create in django
        this.setState({                                                 // Add to calendar in state 
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
    this.setState({
      eventToEdit: {
        ...this.state.eventToEdit,
        [data.name]: data.value
      }
    });
  }

  closeAndEdit = async (e) => {

    try {
        // ------------------------ Make API calls ------------------------ //
        // ------------- If 'not' going, DELETE from calendar ------------- //

        if (this.state.eventToEdit.going === 'not') {

          this.eventDelete(this.state.eventToEdit.id);

        // ------------------------ If not 'not', UPDATE ------------------------ //

        } else {

          let csrfCookie = getCookie('csrftoken');
          const editResponse = await fetch(
            'http://127.0.0.1:8000/events/' + this.state.eventToEdit.id + '/edit/', {
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

          // ------------------ API Call for accurate new state ------------------- //

          csrfCookie = getCookie('csrftoken');
          const calendarResponse = await fetch('http://127.0.0.1:8000/calendar/', {
            method: 'POST',
            body: JSON.stringify({spotify_id: this.state.user_profile.spotify_id}),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfCookie
            }
          });

          const calendarResponseParsedJSON = await calendarResponse.json();
          const calendarResponseData = calendarResponseParsedJSON.data

          calendarResponseData.sort(function (a, b) {                      // Sort Events by date ascending
            a = a.date.split('-');                                         // 'YYYY-MM-DD'.split('/')
            b = b.date.split('-');                                         // gives ["YYYY", "MM", "DD"]
            return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
          });

          this.setState({
            showEditModal: false,
            calendar: calendarResponseData
          });
        }

    } catch(err){
      console.error(`Error: `, err)
    }
  }

  openAndEdit = (eventFromCalendar) => {
    this.setState({
      showEditModal: true,
      eventToEdit: {
        ...eventFromCalendar
      }
    })
  }

  eventDelete = async (id) => {

    const csrfCookie = getCookie('csrftoken');
    const eventDeleteResponse = await fetch('http://127.0.0.1:8000/events/' + id + '/delete/', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfCookie
      }
    });

    const eventDeleteParsed = await eventDeleteResponse;

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

        // this.createShowDownUser(newState.user_profile);

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
    return (
      <div className="App">
        {this.state.spotify_tokens.access_token && this.state.user_profile.spotify_id ? (
          <HeaderNav handleLogout={this.handleLogout} />
          ) : null
        }

        {this.state.showEditModal ? (
            <CalendarEdit open={this.state.showEditModal} eventToEdit={this.state.eventToEdit} 
            handleEventEditChange={this.handleEventEditChange} closeAndEdit={this.closeAndEdit}/>
            ) : null }

        <Grid centered>
        
          <Grid.Column width={5}>
            {this.state.spotify_tokens.access_token && this.state.user_profile.spotify_id ? (
              <div>
                <ProfileContainer spotify_tokens={this.state.spotify_tokens}
                          user_profile={this.state.user_profile}
                />
               <SideBar/>
             </div>
              ) : null
            }
          </Grid.Column>

          <Grid.Column width={9}>
            <Switch>
              <Route exact path="/" render={ Login } />

              {this.state.spotify_tokens.access_token && this.state.user_profile.spotify_id ? (
                <Route exact path="/home" render={ (props) =>
                    <Home {...props}
                          spotify_tokens={this.state.spotify_tokens}
                          user_profile={this.state.user_profile}
                    /> }
                /> ) : (
                <Route exact path="/home" render={ (props) =>
                    <Redirecting {...props}
                          spotify_tokens={this.state.spotify_tokens}
                          user_profile={this.state.user_profile}
                    /> }
                /> )
              }
              
              <Route exact path="/artists" render={ (props) => 
                <ArtistContainer {...props} 
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
                  artists={this.state.artists}
                  addEvent={this.addEvent}
                />}
              />

              <Route exact path="/calendar" render={ (props) => 
                <CalendarList {...props} 
                  calendar={this.state.calendar}
                  openAndEdit={this.openAndEdit}
                  eventDelete={this.eventDelete}
                />}
              />

              <Route component={ My404 }/>
            </Switch>
        </Grid.Column>
      </Grid>       
      </div>
    );
  }
}

export default withRouter(App);
