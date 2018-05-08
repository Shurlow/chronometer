import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
const { ipcRenderer } = window.require('electron')

class CycleButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRunning: false
    }
  }

  toggleCycle = () => this.setState({ isRunning: !this.state.isRunning })

  componentWillMount() {
    ipcRenderer.send('sync-cycle')
    ipcRenderer.on('sync-cycle-reply', (event, data) => {
      this.setState({ isRunning: data.cycle })
    })
  }

  startCycle = () => {
    ipcRenderer.send('start-cycle')
    this.toggleCycle()
  }

  stopCycle = () => {
    ipcRenderer.send('stop-cycle')
    this.toggleCycle()
  }

  render() {
    return (
      <div>
        {
          this.state.isRunning
            ? <Button negative content='Pause' icon='pause' labelPosition='left' onClick={this.stopCycle}/>
            : <Button primary content='Play' icon='play' labelPosition='left' onClick={this.startCycle}/>
        }
      </div>

    )
  }
}

export default CycleButton
