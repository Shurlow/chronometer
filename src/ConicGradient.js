import React from 'react'
import './ConicGradient.css'

const ColorSlice = (color, i, array) => (
  <div key={i} className='circle gradient-clip'>
    <div
      className='circle gradient-slice'
      style={{
        backgroundColor: color,
        transform: `rotate(${(360/array.length) * (1+i)}deg)`,
        zIndex: array.length - i
      }}>
        {/* <span style={{ transform: `translate(${(360 / array.length) * (1 + i)}deg)` }}>{i}</span> */}
    </div>
  </div>
)

const ConicGradient = ({ colors }) => (
  <div className='circle'>
    <div className='blur'>
      { colors.map(ColorSlice) }
    </div>
  </div>
)

export default ConicGradient
