import React from 'react';
import { Segment, Header } from 'semantic-ui-react';

const Home = (props) => {

	return (
	    <Segment>
	    	<Header as='h1' textAlign='center'>Welcome to ShowDown!</Header>
	    	<br/>
	    	<Header as='h4' textAlign='center'> Get started by clicking on the links on the left.</Header>	
	    </Segment>
   	)
}

export default Home;
