import React, { PropTypes } from 'react'
import BarChart from './BarChart/BarChart'

function ChartList(props) {
  return (
    <div>
      {props.polls.map((poll) => (<BarChart pollData={poll} key={poll.cuid} />))}
    </div>
  )
}

ChartList.propTypes = {
  polls: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
    cuid: PropTypes.string.isRequired
  }))
}

export default ChartList
