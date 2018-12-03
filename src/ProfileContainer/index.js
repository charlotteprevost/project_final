import React from 'react';
// import { Link } from 'react-router-dom';
import { Segment, Header, Image } from 'semantic-ui-react';
// import serverURL from '../serverURL.js';


const ProfileContainer = (props) => {

	return (
		<Segment>
			<Header as ='h2'>
				<Image circular src={props.user_profile.spotify_image} /> 
				{ props.user_profile.spotify_display_name }
			</Header>

		</Segment>
	)
}

export default ProfileContainer;
