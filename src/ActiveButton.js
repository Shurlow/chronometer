import React, { Component } from 'react'
import { Radio } from 'semantic-ui-react'
const { ipcRenderer } = window.require('electron')

class ActiveButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
  }

  toggleActive = () => this.setState({ active: !this.state.active })

  componentWillMount() {
    ipcRenderer.send('sync-background')
    ipcRenderer.on('sync-background-reply', (event, data) => {
      this.setState({ active: data.active })
    })
  }

  startBackground = () => {
    ipcRenderer.send('start-background')
    this.toggleActive()
  }

  stopBackground = () => {
    ipcRenderer.send('stop-background')
    this.toggleActive()
  }

  render() {
    const { active } = this.state
    return (
      <div>
        <Radio
          floated='right'
          toggle
          checked={active}
          label='Update hourly'
          onClick={active ? this.stopBackground : this.startBackground}
        />
      </div>

    )
  }
}

export default ActiveButton
