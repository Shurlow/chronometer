import React, { Component } from 'react';
import GradientButton from './GradientButton'
import Controls from './Controls'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'

import 'tachyons'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const buttonStyle = ' ma2 tc pa2 shadow-hover inline-flex items-center pointer ba b--white bw1 br-100'

    return (
      <div className='App athelas'>
        <nav>
          <h1 className='ma0'>Sundial</h1>
          <button className={buttonStyle} id='about'>
            <FontAwesomeIcon icon={faInfo} />
          </button>
        </nav>
        <GradientButton />
        <footer>
          <Controls />
        </footer>
      </div>
    );
  }
}

export default App;
