import React, { Component } from 'react';
import { Container, Header, Divider, Icon } from 'semantic-ui-react'
import CycleButton from './CycleButton'
import ActiveButton from './ActiveButton'
import ColorPicker from './ColorPicker'

import 'semantic-ui-css/semantic.min.css';
import './App.css'

class App extends Component {
  render() {
    return (
      <Container className="App">
        <Header as='h1'>Chronometer</Header>
        <Icon name='sun' />
        <ColorPicker />
        <Icon name='moon' />
        <ActiveButton/>
        {/* {
          this.state.active
            ? <Button negative content='Pause' icon='pause' labelPosition='left' onClick={this.stopCycle}/>
            : <Button primary content='Play' icon='play' labelPosition='left' onClick={this.startCycle}/>
        } */}
        <Divider horizontal>
          <CycleButton />
        </Divider>
      </Container>
    );
  }
}

export default App;
