import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import { getPolls } from '../../PollReducer'

import ChartList from '../../components/PollList'

class PollListPage extends Component {
  render() {
    console.log(this.props.polls)
    return (
      <div>
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
