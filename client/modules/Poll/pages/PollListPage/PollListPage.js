import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import { getPolls } from '../../PollReducer'

import ChartList from '../../components/ChartList'

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
        YOA BOI: <button onClick={this.addPoll.bind(this)}>Add up</button>
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
