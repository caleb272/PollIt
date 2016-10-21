import React, { PropTypes } from 'react'

import PollListItem from '../PollListItem/PollListItem'

function EditablePollListItem(props) {
  function deletePoll() {
    props.delete(props.poll)
  }


  return (
    <div>
      {props.showDeleteButton ?
        <button onClick={deletePoll}>Delete Poll</button>
        : null}
      <PollListItem poll={props.poll} />
    </div>
  )
}


EditablePollListItem.propTypes = {
  poll: PropTypes.object.isRequired,
  delete: PropTypes.func.isRequired,
  showDeleteButton: PropTypes.bool
}


export default EditablePollListItem
