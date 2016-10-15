import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class CreatePollPage extends Component {
  render() {
    return (
      <div>Hello world</div>
    )
  }
}

CreatePollPage.propTypes = {
  userProfile: PropTypes.shape({
    username: PropTypes.string.isRequired,
    github_id: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired
  })
}

function mapStateToProps(state, props) {
  // get the user here
}

export default CreatePollPage
