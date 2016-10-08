import React, { PropTypes } from 'react'

function ClickCounter(props) {
  return <button onClick={props.addClickCount}>Click Counter: {props.currentClickCount}</button>
}

ClickCounter.propTypes = {
  addClickCount: PropTypes.func.isRequired,
  currentClickCount: PropTypes.number.isRequired
}

export default ClickCounter
