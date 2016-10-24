import React, { PropTypes } from 'react'
import { Dialog, FlatButton } from 'material-ui'

function IncompletePollDialog(props) {
  const closeButton = [
    <FlatButton
      label="OK"
      primary={true}
      onClick={props.close}
    />
  ]

  return (
    <Dialog
      title="Poll Incomplete"
      actions={closeButton}
      modal={false}
      open={!!props.dialog}
      onRequestClose={props.close}
    >
      {props.dialog}
    </Dialog>
  )
}

IncompletePollDialog.propTypes = {
  dialog: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
}

export default IncompletePollDialog
