import React, { Component } from 'react'
import { TwitterPicker } from 'react-color'
import chroma from 'chroma-js'
import './ConicGradient.css'
const { ipcRenderer } = window.require('electron')

class ColorPicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      startColor: '#ffffff',
      endColor: '#000000',
      startPalletOpen: false,
      endPalletOpen: false
    }
  }

  componentWillMount() {
    ipcRenderer.send('sync-gradient')
    ipcRenderer.on('sync-gradient-reply', (event, data) => {
      this.setState({ startColor: data.colors[0], endColor: data.colors[1] })
    })
  }

  saveStartColor = (color, event) => {
    ipcRenderer.send('save-gradient', [color.hex, this.state.endColor])
    this.setState({ startColor: color.hex, startPalletOpen: false })
  }

  saveEndColor = (color, event) => {
    ipcRenderer.send('save-gradient', [this.state.startColor, color.hex])
    this.setState({ endColor: color.hex, endPalletOpen: false })
  }

  toggleStartPallet = (e) => {
    e.stopPropagation()
    this.setState({ startPalletOpen: !this.state.startPalletOpen, endPalletOpen: false })
  }

  toggleEndPallet = (e) => {
    e.stopPropagation()
    this.setState({ endPalletOpen: !this.state.endPalletOpen, startPalletOpen: false })
  }

  closePallets = (e) => this.setState({ startPalletOpen: false, endPalletOpen: false })

  render() {
    const { startColor, endColor, startPalletOpen, endPalletOpen } = this.state
    const scale = chroma.scale([startColor, endColor])
      .mode('lch')

    const colorsHalf = scale.colors(24)
    const colors = [...colorsHalf, ...colorsHalf.reverse()]
    
    return (
      <div className='gradient-container'>
        {startPalletOpen && <TwitterPicker className="start-pallet" onChange={this.saveStartColor} />}
        {endPalletOpen && <TwitterPicker className="end-pallet" onChange={this.saveEndColor}/>}
        {(startPalletOpen || endPalletOpen) && <div className="veil" onClick={this.closePallets}></div>}
        <div className='circle' style={{ background: `linear-gradient(45deg, ${startColor}, ${endColor})` }}>
          <div className='click-slice-top' onClick={this.toggleStartPallet}></div>
          <div className='click-slice-bottom' onClick={this.toggleEndPallet}></div>
        </div>
      </div>
    )
  }
}

export default ColorPicker
