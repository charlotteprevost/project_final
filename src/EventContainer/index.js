import React, { Component } from 'react';
import getCookie from 'js-cookie';
import { List, Segment, Dimmer, Loader, Image, Button, Form } from 'semantic-ui-react';
// import queryString from 'query-string'


class EventContainer extends Component {
	constructor(){
    super();
    this.state = {
      events: [],
      eventToEdit: {

      },
      showLoading: true
    }
	}

  getEvents = async () => {

    console.log(`---------- this.props.artists ----------\n`, this.props.artists);

    const allEvents = []

    for (let i = 0; i < 10; i++) {
      if (this.props.artists[i] !== null) {

        console.log('---------- artist['+ i +'] ----------');
        console.log('---------- typeof: ', typeof this.props.artists[i]);
        console.log('---------- artist: ', this.props.artists[i]);
        console.log('---------- name: ', this.props.artists[i].name);


        const csrfCookie = getCookie('csrftoken');
        const events = await fetch('http://127.0.0.1:8000/events/?artist=' + this.props.artists[i].name, {
          'method': 'POST',
          'credentials': 'include',
          headers: {
            'X-CSRFToken': csrfCookie
          }
        });
        const eventsParsedJSON = await events.json();
        // console.log(`---------- eventsParsedJSON ----------\n`, eventsParsedJSON);

        const eventsParsedData = eventsParsedJSON.data[0].results.event

        // console.log(`---------- eventsParsedData ----------\n`, eventsParsedData);
        if (eventsParsedData !== undefined) {
          for (let j = 0; j < eventsParsedData.length; j++) {
            allEvents.push(eventsParsedData[j])
          } 
        }
      }
    }
    console.log(`---------- allEvents ----------\n`, allEvents);

    return allEvents  
  }

  componentDidMount(){
    this.getEvents().then(events => {

      this.setState({
        events: events,
        showLoading: false
      });

    }).catch((err) => {
      console.error(`---------- Error: ----------\n`, err);
    });
  }


  render(){

    const user_events = this.state.events.map(event => {
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
                <Button color='violet' floated='right' type='Submit'>
                  Add to Calendar
                </Button>
            </List.Content>
          </Form>

        </List.Item>
      )
    })


    return(
      <div>
        { this.state.showLoading ? 
          (<Segment>
             <Dimmer active>
               <Loader size='massive'>Scanning your playlists...</Loader>
             </Dimmer>

             <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' /><br/>
             <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' /><br/>
             <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' /><br/>
           </Segment> 
          ) : (
            <List >
              { user_events }
            </List>

          )   
        }
      </div>
        
    )
  }
}
export default EventContainer;
