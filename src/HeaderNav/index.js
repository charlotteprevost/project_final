import React from 'react';
import { Header, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HeaderNav = (props) => {

return(
	<Header>
		<Menu inverted>
			<Menu.Item>
				<Link to="/home">Home</Link>
			</Menu.Item>

			<Menu.Item>
				<Link to="/profile">My Profile</Link>
			</Menu.Item>

			<Menu.Item>
				<Link to="/artists">My Artists</Link>
			</Menu.Item>

			<Menu.Item>
				<Link to="/playlists">My Playlists</Link>
			</Menu.Item>

			<Menu.Item>
				<Link to="/events">Events</Link>
			</Menu.Item>

			<Menu.Item>
				<Link to="/calendar">Calendar</Link>
			</Menu.Item>

			<Menu.Item position='right'>
				<Link to="/">Logout</Link>
			</Menu.Item>
		</Menu>
	</Header>
	)
}

export default HeaderNav;