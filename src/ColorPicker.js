import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { CompactPicker } from 'react-color'
import ConicGradient from './ConicGradient'
import chroma from 'chroma-js'

// import './ColorPicker.css'
const { ipcRenderer } = window.require('electron')

class ColorPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startColor: '#ffffff',
      endColor: '#000000',
      saved: false
    }
  }

  componentWillMount() {
    ipcRenderer.send('sync-gradient')

    ipcRenderer.on('sync-gradient-reply', (event, data) => {
      console.log('sync-gradient-reply', data);
      if (data.colors && data.colors[0] === this.state.startColor && data.colors[1] === this.state.endColor) {
        return this.setState({ saved: true })
      }

      this.setState({
        startColor: data.colors[0],
        endColor: data.colors[1]
      })

    })
  }

  saveStartColor = (color, event) => this.setState({startColor: color.hex, saved: false})
  saveEndColor = (color, event) => this.setState({endColor: color.hex, saved: false})

  saveColors = () => {
    const { startColor, endColor } = this.state
    ipcRenderer.send('save-gradient', [startColor, endColor])
  }

  render() {
    const { startColor, endColor, saved } = this.state
    const scale = chroma.scale([startColor, endColor])
        .mode('lch')

    const colors = scale.colors(12)
    const icon = saved ? 'checkmark' :'save'

    return (
      <div className='color-picker'>
        <ConicGradient colors={colors}/>
        <CompactPicker color={endColor} onChange={this.saveEndColor}/>
        <CompactPicker color={startColor} onChange={this.saveStartColor}/>
        <Button content='Save' icon={icon} labelPosition='left' onClick={this.saveColors}/>
      </div>

    )
  }
}

export default ColorPicker
