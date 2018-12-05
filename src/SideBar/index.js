import React, { Component } from 'react';
import { Header, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class SideBar extends Component {
	constructor(){
	    super();
	    this.state = {
			activeSection: ''
	    }
	}

	render(){
		return(
			<Header>
				<Menu inverted vertical fluid>
					<Menu.Item href="">
						<Link to="/artists">My Artists</Link>
					</Menu.Item>

					<Menu.Item href="">
						<Link to="/playlists">My Playlists</Link>
					</Menu.Item>

					<Menu.Item href="">
						<Link to="/events">Events</Link>
					</Menu.Item>

					<Menu.Item href="">
						<Link to="/calendar">Calendar</Link>
					</Menu.Item>
				</Menu>
			</Header>
			)
	}

}

export default SideBar;