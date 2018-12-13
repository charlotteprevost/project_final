import React, { Component } from 'react';
import { Grid, Segment, Image, List } from 'semantic-ui-react';

export default class ArtistContainer extends Component {            // 'Dumb' Component, only renders Artists

  render() {
    console.log(`Number of artists: `, this.props.artists.length);

    const artists_list = this.props.artists.map((artist, i) => {

      if (artist){
        if (artist.images[0]){

        	return(
        		<Grid.Row>
          		<Grid.Column width={3}>
          		<Segment inverted>
          		<List.Item>
                <List.Content>
                  <List.Header>
                  	<Image src={artist.images[0].url} size='small' rounded inline/>
                  </List.Header>
                </List.Content>
          		</List.Item>
          		</Segment>
        		</Grid.Column>

        		<Grid.Column width={3}>
          		<Segment inverted>
          		<List.Item>
                <List.Content>
                  <List.Header>
                    <a href={ artist.external_urls.spotify } target='_blank' rel='noopener noreferrer'> { artist.name } </a>
                  </List.Header>
                </List.Content>
          		</List.Item>
          		</Segment>
        		</Grid.Column>
      		</Grid.Row>
        	)
        }
      }
    })

    return (
    	<Segment inverted>
    		<List>
    		<Grid columns={4} divided>
	    		{ artists_list }
    		</Grid>
    		</List>
			</Segment>
    )
  }
}