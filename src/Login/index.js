import React from 'react';
import { Button } from 'semantic-ui-react';
import serverURL from '../serverURL.js';


const Login = (props) => {

	const loginURL = serverURL + 'login/';

	return (
		<div>
			<h1>ShowDown</h1>
			<Button><a href={ loginURL }>Begin</a></Button>
		</div>
	)
}

export default Login;
