import React, { Component } from 'react';
import getCookie from 'js-cookie';
// import queryString from 'query-string'


class PlaylistContainer extends Component {
	constructor(){
    super();
    this.state = {
      playlists: [],
      playlistToEdit: {

      }
    }
	}

  getPlaylists = async () => {
    const csrfCookie = getCookie('csrftoken');
    const playlists = await fetch('http://127.0.0.1:8000/playlists/?access_token=' + this.props.spotify_tokens.access_token, {
      'credentials': 'include',
      headers: {
        'X-CSRFToken': csrfCookie
      }
    });
    const playlistsParsedJSON = await playlists.json();
    console.log(`---------- playlistsParsedJSON ----------\n`, playlistsParsedJSON);
    return playlistsParsedJSON.data  
  }

  componentDidMount(){
    this.getPlaylists().then(playlists => {

    console.log(`---------- playlists ----------\n`, playlists);

      // this.setState({
      //   spotify_tokens:{
      //     access_token: tokens.access_token,
      //     expires_in: tokens.expires_in,
      //     refresh_token: tokens.refresh_token,
      //     scope: tokens.scope,
      //     token_type: tokens.token_type
      //   }
      // });

    }).catch((err) => {
      console.error(`---------- Error: ----------\n`, err);
    });
  }


  render(){
    return(
      <div><h1>PLAYLIST CONTAINER</h1></div>
        
    )
  }
}
export default PlaylistContainer;
