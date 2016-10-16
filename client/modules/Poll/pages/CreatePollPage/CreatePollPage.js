import React, { Component } from 'react'
import { connect } from 'react-redux'

class CreatePollPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      entries: [],
    }
  }

  addEntry(name) {
    if (this.state.entries.indexOf(name) === -1) {
      this.state.entries.push(name)
    }
  }


  render() {
    return (
      <form>
        <label htmlFor="GET-name">Name:</label>
        <input id="GET-name" type="text" />
      </form>
    )
  }
}


// Actions required to provide data for this component to render in sever side.
CreatePollPage.need = [params => {
  return {}
}]

// CreatePollPage.propTypes = {}
// function mapStateToProps(state, props) {
//   get the user here
// }


// export default connect()(CreatePollPage)
export default CreatePollPage
