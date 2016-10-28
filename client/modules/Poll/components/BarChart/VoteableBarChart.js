import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import BarChart from './BarChart'
import { getUser, getClientIP } from '../../PollReducer'
import { voteOnPollRequest } from '../../PollActions'

import votingTools, { sortPollEntries } from '../../../../../tools/voting_tools'

class VoteableBarChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      triggerChartUpdate: null
    }
  }


  setTriggerChartUpdate(triggerChartUpdate) {
    this.setState({ triggerChartUpdate })
  }


  barClickedEvent(entry, updateVotedOnBars) {
    const voterID = this.props.user ? this.props.user.github_id : this.props.clientIP
    votingTools.voteOnPollEntries(voterID, entry.title, this.props.poll.entries)
    sortPollEntries(this.props.poll)
    updateVotedOnBars()

    // use the data on the client side to figure out what changes on the chart
    // then once the server returns the data verify and update if necessary
    this.props.dispatch(voteOnPollRequest(this.props.poll.cuid, entry.title))
      .then(() => {
        /*
          you could update the users end with the response from the server
          but its not realy necessary
        */

        // sortPollEntries(this.props.poll)
        // updateVotedOnBars()
      })
  }


  render() {
    return (
      <div>
        <BarChart
          pollData={this.props.poll}
          barClickedEvent={this.barClickedEvent.bind(this)}
          setTriggerUpdate={this.setTriggerChartUpdate.bind(this)}
        />
      </div>
    )
  }
}


VoteableBarChart.propTypes = {
  poll: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    authorID: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    cuid: PropTypes.string.isRequired,
    dateCreated: PropTypes.number.isRequired
  }),
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    github_id: PropTypes.string.isRequired
  }),
  clientIP: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}


function mapStateToProps(state) {
  return {
    user: getUser(state),
    clientIP : getClientIP(state)
  }
}


export default connect(mapStateToProps)(VoteableBarChart)
