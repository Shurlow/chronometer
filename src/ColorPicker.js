import React, { Component } from 'react'
import { TwitterPicker } from 'react-color'
import ConicGradient from './ConicGradient'
import chroma from 'chroma-js'

const { ipcRenderer } = window.require('electron')

class ColorPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startColor: '#ffffff',
      endColor: '#000000',
      startColorOpen: false,
      endColorOpen: false
    }
  }

  saveStartColor = (color, event) => {
    this.setState({ startColor: color.hex })
    ipcRenderer.send('save-gradient', [color.hex, this.state.endColor])
  }
  saveEndColor = (color, event) => {
    this.setState({ endColor: color.hex })
    ipcRenderer.send('save-gradient', [this.state.startColor, color.hex])
  }

  toggleStartPallet = () => this.setState({ startColorOpen: !this.state.startColorOpen, endColorOpen: false })
  toggleEndPallet = () => this.setState({ endColorOpen: !this.state.endColorOpen, startColorOpen: false })

  componentWillMount() {
    ipcRenderer.send('sync-gradient')
    ipcRenderer.on('sync-gradient-reply', (event, data) => {
      this.setState({ startColor: data.colors[0], endColor: data.colors[1] })
    })
  }

  render() {
    const { startColor, endColor, startColorOpen, endColorOpen } = this.state
    const scale = chroma.scale([startColor, endColor])
        .mode('lch')

    const colorsHalf = scale.colors(24)
    const colors = [...colorsHalf, ...colorsHalf.reverse()]

    return (
      <div className='color-picker'>
        <div className="gradient-with-icons">
          <div className='icon-picker'>
            <img
              className="sun"
              src="sun_custom.svg"
              alt="sun by Nanda Ririz from the Noun Project"
              onClick={this.toggleStartPallet}
            />
            { startColorOpen && <TwitterPicker color={endColor} onChange={this.saveEndColor}/> }
          </div>
          <ConicGradient colors={colors}/>
          <div className='icon-picker picker-right'>
            <img
              className="moon"
              src="moon_custom.svg"
              alt="crescent moon by Nanda Ririz from the Noun Project"
              onClick={this.toggleEndPallet}
            />
            { endColorOpen && <TwitterPicker className='picker-right' color={startColor} onChange={this.saveStartColor} triangle='top-right' /> }
          </div>
        </div>
      </div>
    )
  }
}

export default ColorPicker
