import React, { Component } from 'react'
import ActiveButton from './ActiveButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo, faCircleNotch } from '@fortawesome/free-solid-svg-icons'

const { ipcRenderer } = window.require('electron')

class Controls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRunning: false,
    }
  }

  toggleCycle = () => {
    if (this.state.isRunning) {
      this.stopCycle()
    } else {
      this.startCycle()
    }
    this.setState({ isRunning: !this.state.isRunning })
  }

  componentWillMount() {
    ipcRenderer.send('sync-cycle')
    ipcRenderer.on('sync-cycle-reply', (event, data) => {
      this.setState({ isRunning: data.cycle })
    })
  }

  startCycle = () => {
    ipcRenderer.send('start-cycle')
  }

  stopCycle = () => {
    ipcRenderer.send('stop-cycle')
  }


  render() {
    const { isRunning } = this.state
    const activeStyle = isRunning ? "bg-black white" : ""
    const buttonStyle = "ba bw1 ma2 tc br1 pa2 b--black shadow-hover inline-flex items-center pointer " + activeStyle

    return (
      <div className='controls'>
        <ActiveButton/>
        <button className={buttonStyle} onClick={this.toggleCycle}>
          { isRunning
            ? <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
            : <FontAwesomeIcon icon={faRedo} />
          }
        </button> 
      </div>
    )
  }
}

export default Controls
