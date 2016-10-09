import React, { PropTypes } from 'react'
import BarChart from './BarChart/BarChart'

function ChartList(props) {
  return (
    <div>
      {
        props.polls.map((poll) => (<BarChart pollData={poll} key={poll.id} />))
      }
    </div>
  )
}

ChartList.propTypes = {
  polls: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    votes: PropTypes.array.isRequired,
    createdBy: PropTypes.string.isRequired,
    dateCreated: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
  }))
}

export default ChartList
