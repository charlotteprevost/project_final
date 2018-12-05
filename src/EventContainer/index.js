import React, { Component } from 'react';
import getCookie from 'js-cookie';
import { Segment, Dimmer, Loader, Image, Button, Form, Divider, Grid, Header } from 'semantic-ui-react';


// let cityOptions = []

class EventContainer extends Component {
	constructor(){
    super();
    this.state = {
      events: [],
      showLoading: true
    }
	}

  getEvents = async () => {                                                         // API call for events on load of EventContainer

    const allEvents = []

    for (let i = 0; i < this.props.artists.length; i++) {                           // Use for loop to get ALL Events of ALL Artists
      if (this.props.artists[i] !== null && this.state.events.length === 0) {

        const csrfCookie = getCookie('csrftoken');
        const events = await fetch(
          'http://127.0.0.1:8000/events/?artist=' + this.props.artists[i].name, {
            'method': 'POST',
            'credentials': 'include',
            headers: {
              'X-CSRFToken': csrfCookie
            }
        });

        const eventsParsedJSON = await events.json();
        const eventsParsedData = eventsParsedJSON.data[0].results.event

        if (eventsParsedData !== undefined) {
          for (let j = 0; j < eventsParsedData.length; j++) {
            allEvents.push(eventsParsedData[j])
          } 
        }
      }
    }

    allEvents.sort(function (a, b) {                      // Sort Events by date ascending
      a = a.start.date.split('-');                        // 'YYYY-MM-DD'.split('/')
      b = b.start.date.split('-');                        // gives ["YYYY", "MM", "DD"]
      return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
    });

    console.log(`---------- allEvents sorted by date ----------\n`, allEvents);

    return allEvents  
  }

  componentDidMount(){
    this.getEvents().then(events => {
      this.setState({
        events: events,
        showLoading: false                // Hide Loader 
      });
    }).catch((err) => {
      console.error(`Error: `, err);
    });
  }

  render(){

    const user_events = this.state.events.map(event => {
      const artists = event.performance.map(performance => {
        return (
          <div>
            <div key={ performance.artist.id }>
              <a href={ performance.artist.uri } target='_blank' rel="noopener noreferrer">{ performance.artist.displayName } </a>
            </div>
          </div>
        )
      })

      return (
        <div>
          <Form onSubmit={this.props.addEvent.bind(null, event)}>
            <Segment inverted >
              <Grid.Row key={ event.uri }>
                <Grid.Column>
                  <Header>
                    <a href={ event.uri } target='_blank' rel="noopener noreferrer"> { event.displayName } </a>
                  </Header>
                    <p style={{ color: 'white' }}>{ event.start.date } | { event.start.time }</p>
                    <p style={{ color: 'white' }}>{ event.location.city }</p>
                </Grid.Column>

                <Divider/>
                
                <Grid.Column>
                  { artists }
                </Grid.Column>

                <Divider/>

                <Grid.Column>
                  <Button fluid color='violet' type='Submit'>
                    Add to Calendar
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Segment>
            <br/>
          </Form>
        </div>
      )
    })

    return(
      <div>


        { this.state.showLoading ? 
          (<Segment>
             <Dimmer active>
               <Loader size='massive'>Scanning your playlists...<br/>Hold on tight, this might take a few minutes.</Loader>
             </Dimmer>

             <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' /><br/>
             <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' /><br/>
             <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' /><br/>
           </Segment> 
          ) : (
            <Grid columns={3}>
              { user_events }
            </Grid>
          )   
        }

      </div>
        
    )
  }
}
export default EventContainer;
