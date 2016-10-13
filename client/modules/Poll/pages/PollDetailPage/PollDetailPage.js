import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { getPoll } from '../../PollReducer'
import BarChart from '../../components/BarChart/BarChart'

function PollDetailPage(props) {
  return (
    <div>
      <center>
        <h3>{props.poll.title}</h3>
        <BarChart
          pollData={props.poll}
        />
      </center>
    </div>
  )
}

PollDetailPage.propTypes = {
  poll: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
    cuid: PropTypes.string.isRequired
  })
}

function mapStateToProps(state, props) {
  return {
    poll: getPoll(state, props.params.cuid)
  }
}

export default connect(mapStateToProps)(PollDetailPage)
