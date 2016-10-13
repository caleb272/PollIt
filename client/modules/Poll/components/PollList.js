import React, { PropTypes } from 'react'
import PollListItem from './PollListItem/PollListItem'

function PollList(props) {
  return (
    <div>
      {props.polls.map((poll) => (
        <PollListItem
          poll={poll}
          key={poll.cuid}
        />
      ))}
    </div>
  )
}

PollList.propTypes = {
  polls: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
    cuid: PropTypes.string.isRequired
  }))
}

export default PollList
