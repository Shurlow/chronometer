import React, { Component } from 'react';
import { Container, Header, Divider } from 'semantic-ui-react'
import CycleButton from './CycleButton'
import ActiveButton from './ActiveButton'
import ColorPicker from './ColorPicker'

import 'semantic-ui-css/semantic.min.css';
import './App.css'

class App extends Component {
  render() {
    return (
      <Container className="App">
        <nav>
          <Header as='h1'>Chronometer</Header>
          <ActiveButton/>
        </nav>
        <ColorPicker />
        <Divider horizontal>
          <CycleButton />
        </Divider>
      </Container>
    );
  }
}

export default App;
