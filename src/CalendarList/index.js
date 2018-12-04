import React from 'react';
// import { Link } from 'react-router-dom';
import { Segment, Header, List, Button } from 'semantic-ui-react';
// import serverURL from '../serverURL.js';


const CalendarList = (props) => {


    const user_events = props.calendar.map(userEvent => {

      let status = '';
      if (userEvent.going === 'going') {
        status = 'Going';
      } else if (userEvent.going === 'maybe') {
        status = 'Mmmmaybe...'
      }

      return (
        <List.Item size='small' key={ userEvent.uri }>
          <List.Content>
            <List.Header>
              <a href={ userEvent.uri }> { userEvent.display_name } </a>
            </List.Header>
          </List.Content>
          <br/>
          <List.Content>
            { userEvent.city }
          </List.Content>
          <br/>
          <List.Content>
            { userEvent.date }
          </List.Content>
          <br/>
          <List.Content>
            Going?: { status }
          </List.Content>
          <br/>
          <List.Content>
            <Button color="green" onClick={props.openAndEdit.bind(null, userEvent)}>Edit Status</Button>
          </List.Content>

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

export default CalendarList;
