import React, { Component } from 'react';
import getCookie from 'js-cookie';
import { List } from 'semantic-ui-react';
// import queryString from 'query-string'


class ArtistContainer extends Component {
	constructor(){
	    super();
	    this.state = {
	      artists: [],
	    }
	}

  getPlaylistsTracks = async () => {

 //    const csrfCookie = getCookie('csrftoken');

 //    const playlists = await fetch('http://127.0.0.1:8000/playlists-tracks/?access_token=' + this.props.spotify_tokens.access_token, {
 //      'credentials': 'include',
 //      headers: {
 //        'X-CSRFToken': csrfCookie
 //      }
 //    });

 //    const playlistsParsedJSON = await playlists.json();
 //    console.log(`---------- playlistsParsedJSON.data ----------\n`, playlistsParsedJSON.data);

 //    const playlists = playlistsParsedJSON.data;

 //    let artistsArray = [];

 //    for (let i = 0; i < playlists.length; i++) {
 //    	for (let j = 0; j < playlists[i].items.length; j++) {
 //    		for (let k = 0; k < playlists[i].items[j].track.artists.length; k++) {
 //    			const artist = {
 //    				name: playlists[i].items[j].track.artists[k].name,
 //    				href: playlists[i].items[j].track.artists[k].href
 //    			}
 //    			artistsArray.push(artist)
 //    		}
 //    	}
 //    }

 //    console.log(`---------- artistsArray ----------\n`, artistsArray);

 //    // ---------- Remove artist duplicates from artistsArray ---------- //
    
	// let artistObject = {};

	// for ( let i = 0, len = artistsArray.length; i < len; i++ ){
	//     artistObject[artistsArray[i]['name']] = artistsArray[i];
	// }

	// const uniqueArtistsArray = [];

	// for ( let key in artistObject ){
	// 	    uniqueArtistsArray.push(artistObject[key]);
	// }

 //    console.log(`---------- uniqueArtistsArray ----------\n`, uniqueArtistsArray);



    // return playlistsParsedJSON.data  
  }

  componentDidMount(){
    this.getPlaylistsTracks().then( playlists => {

    // console.log(`---------- playlists FULL ----------\n`, playlists);

    // let artistsArray = [];

 //    for (let i = 0; i < playlists.length; i++) {
 //    	for (let j = 0; j < playlists[i].items.length; j++) {
 //    		for (let k = 0; k < playlists[i].items[j].track.artists.length; k++) {
 //    			const artist = {
 //    				name: playlists[i].items[j].track.artists[k].name,
 //    				href: playlists[i].items[j].track.artists[k].href
 //    			}
 //    			artistsArray.push(artist)
 //    		}
 //    	}
 //    }

 //    console.log(`---------- artistsArray ----------\n`, artistsArray);

 //    // const uniqueArtistsArray = artistsArray.filter(function(artist, i, self){
 //    // 	return self.indexOf(artist) == i;
 //    // })

 //    // console.log(`---------- uniqueArtistsArray ----------\n`, uniqueArtistsArray);

	// let artistObject = {};

	// for ( let i = 0, len = artistsArray.length; i < len; i++ ){
	//     artistObject[artistsArray[i]['name']] = artistsArray[i];
	// }

	// const uniqueArtistsArray = [];

	// for ( let key in artistObject ){
	// 	    uniqueArtistsArray.push(artistObject[key]);
	// }

 //    console.log(`---------- uniqueArtistsArray ----------\n`, uniqueArtistsArray);

    // this.setState({artists: uniqueArtistsArray})

    }).catch((err) => {
      console.error(`---------- Error: ----------\n`, err);
    });
  }

  // getArtists = async () => {
  //   const csrfCookie = getCookie('csrftoken');
  //   const artists = await fetch('http://127.0.0.1:8000/artists/' + this.props.spotify_tokens.access_token, {
  //     'credentials': 'include',
  //     headers: {
  //       'X-CSRFToken': csrfCookie
  //     }
  //   });
  //   const artistsParsedJSON = await artists.json();
  //   console.log(`---------- artistsParsedJSON ----------\n`, artistsParsedJSON);
  //   return artistsParsedJSON.data  
  // }

  // componentDidUpdate(){
  //   if (this.props.artists === ''){
  //     this.getArtists().then(artists => {

  //     console.log(`---------- artists ----------\n`, artists);

  //       this.setState({
  //         artists: artists
  //       });

  //     }).catch((err) => {
  //       console.error(`---------- Error: ----------\n`, err);
  //     });
  //   }
  // }


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
export default ArtistContainer;
