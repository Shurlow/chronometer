import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
const { ipcRenderer } = window.require('electron')

class ActiveButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
  }

  toggleActive = () => {
    const { active } = this.state
    // console.log('Active', active);
    
    if(active) {
      this.stopBackground()
    } else {
      this.startBackground()
    }

    this.setState({ active: !active })
  }

  componentWillMount() {
    ipcRenderer.send('sync-background')
    ipcRenderer.on('sync-background-reply', (event, data) => {
      this.setState({ active: data.active })
    })
  }

  startBackground = () => {
    ipcRenderer.send('start-background')
  }

  stopBackground = () => {
    ipcRenderer.send('stop-background')
  }

  render() {
    const { active } = this.state
    const radioStyle = "tc br1 mr2 b--black inline-flex items-center pointer bn shadow-hover"

    return (
      <button id="active-button" className={radioStyle} onClick={this.toggleActive}>
        <span className="ma1">Clock Sync </span>
        <FontAwesomeIcon className="shadow-hover" icon={active ? faToggleOn : faToggleOff} size="lg" />
      </button>
    )
  }
}

export default ActiveButton
