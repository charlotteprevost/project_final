import React from 'react';
import { Segment, Header, Grid, Divider, Label } from 'semantic-ui-react';


const CalendarList = (props) => {

  const user_events = props.calendar.map( userEvent => {

    return (
      <Grid.Row key={ userEvent.uri }>
        <Grid.Column>
          <Segment inverted>

          <Header>
            <a href={ userEvent.uri }> { userEvent.display_name } </a>
            <p>{ userEvent.date }</p>
            <p>{ userEvent.city }</p>
          </Header>

        <Divider/>

          { userEvent.going === 'going' ? (
            <Label as='button' color='olive' ribbon onClick={props.openAndEdit.bind(null, userEvent)}>
              Going
            </Label>
                ) : (
            <Label as='button' color='yellow' ribbon onClick={props.openAndEdit.bind(null, userEvent)}>
              Mmmmaybe...
            </Label>
            )
          }
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  })

  return (
    <Segment>
      <Header as ='h2' textAlign='center'>
        My Events
      </Header>
      <Grid>
        { user_events }
      </Grid>
    </Segment>
  )
}

export default CalendarList;
