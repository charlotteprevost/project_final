import React from 'react';
import { Segment, Dimmer, Loader, Image } from 'semantic-ui-react';

const Redirecting = (props) => {

	return (
	    <Segment>

	      <Dimmer active>
	        <Loader size='massive' >Redirecting you to <br/> ShowDown</Loader>
	      </Dimmer>

	      <Image fluid src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
	      <br/>
	      <br/>
	      <Image fluid src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
	      <br/>
	      <br/>
	      <Image fluid src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
	      
	    </Segment>
   	)
}

export default Redirecting;
