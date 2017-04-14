import React from 'react';

import Navbar from 'react-bootstrap/lib/Navbar';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

import styles from './TopBar.css';

class TopBar extends React.Component {
  handleKeyPress(evt) {
    if(evt.charCode==13){
      this.props.onInput(evt.target.value);
    }
  }

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Marvellous</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form pullLeft>
            <FormControl type="text"
                         placeholder="Search for characters"
                         onKeyPress={this.handleKeyPress.bind(this)} />
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default TopBar