import React from 'react'
import { Modal, Form, Button, Header, List, Dropdown } from 'semantic-ui-react';

const statusOptions = [
	{ value: 'going', text: 'Going!' },
	{ value: 'maybe', text: 'Mmmmaybe...' },
	{ value: 'not', text: 'Can\'t go :(' }
];

const CalendarEdit = (props) => {
  console.log(props)
	console.log(`---------- event from edit ----------\n`, props.eventToEdit);
  return (
    <Modal open={props.open}>
      <Header>Sooo... You comin'?</Header>
      <Modal.Content>
          <Form onSubmit={ props.closeAndEdit }>
	          <Form.Input>
	            <List.Content>
					<Dropdown selection options={ statusOptions } name='going' onChange={props.handleEventEditChange}/>
	            </List.Content>
	          </Form.Input>
            <br/>
            <br/>
			<Modal.Actions>
			<Button color='green' type='Submit'>Edit Status</Button>
			</Modal.Actions>
        </Form>
      </Modal.Content>
    </Modal>
    )
}

export default CalendarEdit;
