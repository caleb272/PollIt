import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import EditablePollListItem from '../../components/EditablePollListItem/EditablePollListItem'

import { deletePollRequest } from '../../PollActions'
import { getUser, getUsersPolls } from '../../PollReducer'

function UserPollsPage(props) {
  function deletPoll({ cuid }) {
    props.dispatch(deletePollRequest(cuid))
  }


  function pollList() {
    return props.polls.map(poll =>
      (
      <EditablePollListItem
        poll={poll}
        delete={deletPoll}
        showDeleteButton={props.user && poll.authorID === props.user.github_id}
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


function mapStateToProps(state, props) {
  const user = getUser(state) || null
  return {
    polls: getUsersPolls(state, props.params.userid),
    user
  }
}


export default connect(mapStateToProps)(UserPollsPage)
