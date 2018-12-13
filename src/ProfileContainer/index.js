import React from 'react';
import { Segment, Header, Image } from 'semantic-ui-react';

const ProfileContainer = (props) => {

	return (
		<Segment inverted>
			<Header as ='h2' textAlign='center'>{ props.user_profile.spotify_display_name }</Header>
			<Image size='small' centered rounded src={props.user_profile.spotify_image} />
		</Segment>
	)
}

export default ProfileContainer;
