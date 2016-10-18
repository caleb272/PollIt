import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import { getPolls } from '../../PollReducer'

import ChartList from '../../components/PollList'

export function PollListPage(props) {
  return (
    <div>
      <ChartList polls={props.polls} />
    </div>
  )
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
