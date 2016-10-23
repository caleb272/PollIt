import React, { PropTypes } from 'react'

import PollListItem from '../PollListItem/PollListItem'

function EditablePollListItem(props) {
  function deletePoll() {
    props.delete(props.poll)
  }


  function editPoll() {
    props.edit(props.poll)
  }


  return (
    <div>
      {props.showModifyButtons ?
        <button onClick={deletePoll}>Delete Poll</button>
        : null}
      {props.showModifyButtons ?
        <button onClick={editPoll}>Edit Poll</button>
        : null}
      <PollListItem poll={props.poll} />
    </div>
  )
}


EditablePollListItem.propTypes = {
  poll: PropTypes.object.isRequired,
  delete: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  showModifyButtons: PropTypes.bool.isRequired
}


export default EditablePollListItem
