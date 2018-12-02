import React, { Component } from 'react';
import getCookie from 'js-cookie';
import queryString from 'query-string'


class PlaylistContainer extends Component {
	constructor(){
    super();
    this.state = {
      playlists: [],
      playlistToEdit: {

      }
    }
	}

 //  getSpotifyTokens = async (props) => {
	//   const csrfCookie = getCookie('csrftoken');
 //    const values = queryString.parse(this.props.location.search)
	//   const tokens = await fetch('http://127.0.0.1:8000/tokens/?code=' + values.code, {
	//     'credentials': 'include',
	//     headers: {
	//       'X-CSRFToken': csrfCookie
	//     }
	//   });
	//   const tokensParsedJSON = await tokens.json();
	//   console.log(`---------- tokensParsedJSON ----------\n`, tokensParsedJSON);
	//   return tokensParsedJSON.data
 //  }

 //  componentDidMount(){
 //    this.getSpotifyTokens().then(tokens => {

 //    console.log(`---------- tokens ----------\n`, tokens);

 //      this.setState({
 //        spotify_tokens:{
 //          access_token: tokens.access_token,
 //          expires_in: tokens.expires_in,
 //          refresh_token: tokens.refresh_token,
 //          scope: tokens.scope,
 //          token_type: tokens.token_type
 //        }
 //      });

 //    }).catch((err) => {
 //      console.error(`---------- Error: ----------\n`, err);
 //    });
 //  }

  getPlaylists = async () => {
    const csrfCookie = getCookie('csrftoken');
    const playlists = await fetch('http://127.0.0.1:8000/playlists/?code=', {
      'credentials': 'include',
      headers: {
        'X-CSRFToken': csrfCookie
      }
    });
    const playlistsParsedJSON = await playlists.json();
    console.log(`---------- playlistsParsedJSON ----------\n`, playlistsParsedJSON);
    return playlistsParsedJSON.data  }

  render(){
    return(
      <div><h1>PLAYLIST CONTAINER</h1></div>
        
    )
  }
}
export default PlaylistContainer;
