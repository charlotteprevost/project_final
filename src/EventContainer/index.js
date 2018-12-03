import React, { Component } from 'react';
import getCookie from 'js-cookie';
import { List } from 'semantic-ui-react';
// import queryString from 'query-string'


class EventContainer extends Component {
	constructor(){
    super();
    this.state = {
      events: [],
      eventToEdit: {

      }
    }
	}

  getPlaylistsTracks = async () => {
    const csrfCookie = getCookie('csrftoken');
    const playlists = await fetch('http://127.0.0.1:8000/playlists/tracks/?access_token=' + this.props.spotify_tokens.access_token, {
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
    this.getPlaylistsTracks().then( playlists => {

    console.log(`---------- playlists FULL ----------\n`, playlists);

    // const artistsArray

    // for (let i = 0; i < playlists.length; i++) {

    // }

    // const artists = artists.map( playlist => {

    // })

    }).catch((err) => {
      console.error(`---------- Error: ----------\n`, err);
    });
  }

  getEvents = async () => {
    const csrfCookie = getCookie('csrftoken');
    const events = await fetch('http://127.0.0.1:8000/events/' + this.props.spotify_tokens.access_token, {
      'credentials': 'include',
      headers: {
        'X-CSRFToken': csrfCookie
      }
    });
    const eventsParsedJSON = await events.json();
    console.log(`---------- eventsParsedJSON ----------\n`, eventsParsedJSON);
    return eventsParsedJSON.data  
  }

  componentDidUpdate(){
    if (this.props.artists === ''){
      this.getEvents().then(events => {

      console.log(`---------- events ----------\n`, events);

        this.setState({
          events: events
        });

      }).catch((err) => {
        console.error(`---------- Error: ----------\n`, err);
      });
    }
  }


  render(){

    // const user_events = this.state.events.map( event => {
    //   const event_image = event.images.map((image, i) => {
    //     if (i === 0){
    //       return (
    //         <Image fluid rounded id={ image.url } floated='left' verticalAlign='middle' size='small' src={ image.url } />
    //       )
    //     }
    //   })
      
    //   return (
    //     <List.Item size='small' id={  }>
    //         {  }
    //         <List.Content>
    //           <List.Header>
    //           {  }
    //           </List.Header>
    //         </List.Content>
    //     </List.Item>
    //   )
    // })


    return(
      <List>

      </List>
        
    )
  }
}
export default EventContainer;
