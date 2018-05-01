import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
const { ipcRenderer } = window.require('electron')

class ActiveButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
  }

  componentWillMount() {
    ipcRenderer.send('sync-state-background')
    ipcRenderer.on('sync-reply', (event, data) => {
      this.setState({ active: data.active })
    })
  }

  toggleActive = () => this.setState({ active: !this.state.active })

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
        <Button
          active={active}
          content={active ? 'On' : 'Off'}
          onClick={active ? this.stopBackground : this.startBackground}
        />
      </div>

    )
  }
}

export default ActiveButton
