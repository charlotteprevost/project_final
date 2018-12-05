import React from 'react';
import { Header, Menu } from 'semantic-ui-react';

const HeaderNav = (props) => {

return(
	<Header>
		<Menu inverted>
			<Menu.Item position='right' onClick={ props.handleLogout }>
				Logout
			</Menu.Item>
		</Menu>
	</Header>
	)
}

export default HeaderNav;