import React from 'react';
// import { Link } from 'react-router-dom';
import { Segment, Header, List, Form, Button, Dropdown } from 'semantic-ui-react';
// import serverURL from '../serverURL.js';


const CalendarContainer = (props) => {

	const status = [
		{ key: 'going', value: 'going', text: 'Going!' },
		{ key: 'maybe', value: 'maybe', text: 'Mmmmaybe...' },
		{ key: 'not_going', value: 'not_going', text: 'Can\'t go :(' }
	]

    const user_events = props.calendar.map(event => {
      const artists = event.performance.map(performance => {
        return (
          <div>
            <List.Description key={ performance.artist.id }>
              <a href={ performance.artist.uri }>{ performance.artist.displayName } </a>
            </List.Description>
          </div>
        )
      })

      return (
        <List.Item size='small' key={ event.uri }>
          <List.Content>
            <List.Header>
              <a href={ event.uri }> { event.displayName } </a>
            </List.Header>
          </List.Content>

          <List.Content>
            { artists }
          </List.Content>

          <Form onSubmit={this.props.addEvent.bind(null, event)}>
            <List.Content>
							<Dropdown placeholder='Going' options={ status } />
            </List.Content>
          </Form>

        </List.Item>
      )
    })

	return (
		<Segment>
			<Header as ='h2'>
				My Events
			</Header>
      <List >
        { user_events }
      </List>
		</Segment>
	)
}

export default CalendarContainer;
