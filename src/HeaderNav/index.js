import React from 'react';
import { Header, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HeaderNav = (props) => {

return(
	<Header>
		<Menu>
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

			<Menu.Item>
				<Link to="/" onClick={props.handleLogout}>Logout</Link>
			</Menu.Item>
		</Menu>
	</Header>
	)
}

export default HeaderNav;