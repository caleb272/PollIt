import React, { PropTypes } from 'react'
import { CardActions, FlatButton } from 'material-ui'
import PollListItem from '../PollListItem/PollListItem'

function EditablePollListItem(props) {
  function deletePoll() {
    props.delete(props.poll)
  }


  function editPoll() {
    props.edit(props.poll)
  }

  const actions = (
    <CardActions>
      <FlatButton
        label="Edit"
        primary={true}
        onClick={editPoll}
      />
      <FlatButton
        label="Delete"
        secondary={true}
        onClick={deletePoll}
      />
    </CardActions>
  )

  return (
    <PollListItem
      poll={props.poll}
      innerElements={props.showModifyButtons ? actions : null}
    />
  )
}


EditablePollListItem.propTypes = {
  poll: PropTypes.object.isRequired,
  delete: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  showModifyButtons: PropTypes.bool.isRequired
}


export default EditablePollListItem
