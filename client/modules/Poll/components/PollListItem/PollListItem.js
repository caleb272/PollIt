import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import BarChart from '../BarChart/BarChart'

function PollListItem(props) {
  return (
    <div><center>
      <h3>
        <Link to={`/polls/${props.poll.cuid}`}>
          {props.poll.title}
        </Link>
      </h3>
      <BarChart pollData={props.poll} />
    </center></div>
  )
}

PollListItem.propTypes = {
  poll: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
    cuid: PropTypes.string.isRequired
  })
}

export default PollListItem
