import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import BarChart from './BarChart'
import { getUser } from '../../PollReducer'
import { updatePollRequest } from '../../PollActions'

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
    // votingTools.voteOnPollEntries(this.props.user.github_id, entry.title, this.props.poll.entries)
    votingTools.voteOnPollEntries(Math.floor(Math.random() * 999999), entry.title, this.props.poll.entries)
    sortPollEntries(this.props.poll)
    updateVotedOnBars()

    // use the data on the client side to figure out what changes on the chart
    // then once the server returns the data verify and update if necessary

    // this.props.dispatch(updatePollRequest(this.props.poll.cuid, entry.title, this.props.user.github_id))
    //   .then(() => {
    //     sortPollEntries(this.props.poll)
    //     updateVotedOnBars()
    //   })
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
  dispatch: PropTypes.func.isRequired
}


function mapStateToProps(state) {
  return {
    user: getUser(state)
  }
}


export default connect(mapStateToProps)(VoteableBarChart)
