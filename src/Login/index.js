import React from 'react';
import { Button } from 'semantic-ui-react';
import serverURL from '../serverURL.js';

const Login = (props) => {

	const loginURL = serverURL + 'login/';

	return (
		<div >
			<Button size='massive' color='black'>
			<a href={ loginURL }>
				<b>ShowDown</b>
			</a></Button>
		</div>
	)
}

export default Login;
