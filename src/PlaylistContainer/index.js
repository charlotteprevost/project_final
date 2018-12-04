import React, { Component } from 'react';
import getCookie from 'js-cookie';
import { List, Image } from 'semantic-ui-react';
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

      this.setState({
        playlists: playlists
      });

    }).catch((err) => {
      console.error(`---------- Error: ----------\n`, err);
    });
  }


  render(){

    const user_playlists = this.state.playlists.map( playlist => {
      const playlist_image = playlist.images.map((image, i) => {
        if (i === 0){
          return (
            <Image rounded key={ image.url } floated='left' verticalAlign='middle' size='small' src={ image.url } />
          )
        }
      })

      return (
        <List.Item size='small' key={ playlist.id }>
            { playlist_image }
            <List.Content>
              <List.Header>
              { playlist.name }
              </List.Header>
            </List.Content>
        </List.Item>
      )
    })


    return(
      <List inverted>
        <h1>PLAYLIST CONTAINER</h1>
        { user_playlists }


      </List>
        
    )
  }
}
export default PlaylistContainer;
