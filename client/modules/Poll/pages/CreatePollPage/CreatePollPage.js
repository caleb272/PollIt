import React, { Component } from 'react'
import { connect } from 'react-redux'

import BarChart from '../../components/BarChart/BarChart'


class CreatePollPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entryInput: '',
      refresh: false,
      poll: {
        title: '',
        author: '',
        entries: [],
        cuid: '0',
        dateCreated: Date.now()
      }
    }
  }


  onEntryInputChange(action) {
    this.setState({ entryInput: action.target.value })
  }


  onEntryInputKeyDown(action) {
    if (action.which === 13) {
      this.addEntry(this.state.entryInput)
    }
  }


  addEntryButtonClicked() {
    this.addEntry(this.state.entryInput)
  }


  addEntry(title) {
    if (this.findEntry(title) === -1 && title.length > 0) {
      this.state.poll.entries.push(this.createEntry(title))
      this.setState({ refresh: true })
      setTimeout(() => this.setState({ refresh: false }), 10)
    }
    this.setState({ entryInput: '' })
  }


  findEntry(title) {
    const entries = this.state.poll.entries
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].title === title) {
        return i
      }
    }
    return -1
  }


  createEntry(title) {
    return {
      title,
      votes: [123123, 123123]
    }
  }


  render() {
    return (
      <div>
        {!this.state.refresh ? <BarChart pollData={this.state.poll} /> : null}
        <form onSubmit={action => action.preventDefault()}>
          <label htmlFor="add-entry">Entry Name</label>
          <input
            id="add-entry"
            type="text"
            onKeyDown={this.onEntryInputKeyDown.bind(this)}
            onChange={this.onEntryInputChange.bind(this)}
            value={this.state.entryInput}
          />
        <button onClick={this.addEntryButtonClicked.bind(this)}>Add Entry</button>
        </form>
      </div>
    )
  }
}


// CreatePollPage.propTypes = {}
// function mapStateToProps(state, props) {
//   get the user here
// }


// export default connect()(CreatePollPage)
export default CreatePollPage
