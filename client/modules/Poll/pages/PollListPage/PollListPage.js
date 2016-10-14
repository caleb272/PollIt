import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import { getPolls } from '../../PollReducer'

import ChartList from '../../components/PollList'

class PollListPage extends Component {
  addPoll() {
    const poll = (this.props.polls[this.props.polls.length - 1] + 1)
    this.props.dispatch({
      type: 'ADD_POLL',
      poll
    })
  }


  render() {
    return (
      <div>
        <div>
          <a href="/api/auth/google">Sign In with Google</a>
        </div>
        <div>
          <a href="/api/auth/github">Sign In with Github</a>
        </div>
        <ChartList polls={this.props.polls} />
      </div>
    )
  }
}


PollListPage.propTypes = {
  polls: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}


function mapStateToProps(state) {
  return {
    polls: getPolls(state)
  }
}

export default connect(mapStateToProps)(PollListPage)
