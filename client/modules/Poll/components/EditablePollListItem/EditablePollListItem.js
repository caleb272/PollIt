import React, { PropTypes } from 'react'
import { CardActions, FlatButton } from 'material-ui'
import PollListItem from '../PollListItem/PollListItem'
import ShareButtons from '../ShareButtons/ShareButtons'

function EditablePollListItem(props) {
  function deletePoll() {
    props.delete(props.poll)
  }


  function editPoll() {
    props.edit(props.poll)
  }

  const actions = (
    <CardActions>
      <ShareButtons poll={props.poll} />
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

  const shareButtons = (
    <CardActions>
      <ShareButtons poll={props.poll} />
    </CardActions>
  )

  return (
    <PollListItem
      poll={props.poll}
      innerElements={props.showModifyButtons ? actions : shareButtons}
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
