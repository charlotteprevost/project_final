import React from 'react';
// import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import serverURL from '../serverURL.js';


const Login = (props) => {

  return (
    <div>
		<h1>ShowDown</h1>
		<Button><a href={serverURL}>Begin</a></Button>
    </div>
    )
}

export default Login;
