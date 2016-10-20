import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import EditablePollListItem from '../../components/EditablePollListItem/EditablePollListItem'

import { getUser, getUsersPolls } from '../../PollReducer'

function UserPollsPage(props) {
  function deletPoll({ cuid }) {
    console.log('deleting the poll:', cuid)
  }


  function pollList() {
    return props.polls.map(poll =>
      (
      <EditablePollListItem
        poll={poll}
        delete={deletPoll}
        showDeleteButton={poll.authorID === props.user.github_id}
        key={poll.cuid}
      />
      )
    )
  }


  return (
    <div>
      {pollList()}
    </div>
  )
}


UserPollsPage.propTypes = {
  polls: PropTypes.array.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    github_id: PropTypes.string.isRequired
  })
}


function mapStateToProps(state) {
  return {
    polls: getUsersPolls(state, getUser(state).github_id),
    user: getUser(state)
  }
}


export default connect(mapStateToProps)(UserPollsPage)
