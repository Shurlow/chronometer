import React from 'react'
import './ConicGradient.css'

const ColorSlice = (color, i, array) => (
  <div key={i} className='circle gradient-clip'>
    <div
      className='circle gradient-slice'
      style={{
        backgroundColor: color,
        transform: `rotate(${30 * (1+i)}deg)`,
        zIndex: array.length - i
      }}>
    </div>
  </div>
)

const ConicGradient = ({ colors }) => (
  <div className='circle gradient-container'>
    <div className='blur'>
      { colors.map(ColorSlice) }
    </div>
  </div>
)

export default ConicGradient
