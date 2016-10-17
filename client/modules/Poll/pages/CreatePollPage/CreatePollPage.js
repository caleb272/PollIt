import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import BarChart from '../../components/BarChart/BarChart'
import { createPollRequest } from '../../PollActions'


class CreatePollPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entryInput: '',
      refresh: false,
      poll: {
        title: '',
        author: '',
        authorID: '',
        entries: [],
        cuid: '0',
        dateCreated: Date.now()
      }
    }
  }


  handleTitleInputChange(action) {
    action.preventDefault()
    this.state.poll.title = action.target.value
  }


  handleEntryInputChange(action) {
    this.setState({ entryInput: action.target.value })
  }


  handleEntryInputKeyDown(action) {
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
      votes: []
    }
  }


  createPoll() {
    const poll = this.state.poll
    if (poll.title && poll.entries.length > 1) {
      this.props.dispatch(createPollRequest(poll))
    } else {
      this.alertIncompletePoll(poll)
    }
  }


  alertIncompletePoll(poll) {
    if (!poll.title) {
      alert('no title')
    } else {
      alert('you need atleast two entries')
    }
  }


  render() {
    return (
      <div>
        <form onSubmit={action => action.preventDefault()}>
          <label htmlFor="title-input">Title</label>
          <input
            id="title-input"
            type="text"
            autoComplete="off"
            onChange={this.handleTitleInputChange.bind(this)}
          />
        </form>

        <div>
          {!this.state.refresh ? <BarChart pollData={this.state.poll} /> : null}
        </div>

        <form onSubmit={action => action.preventDefault()}>
          <label htmlFor="add-entry">Entry Name</label>
          <input
            id="add-entry"
            type="text"
            onKeyDown={this.handleEntryInputKeyDown.bind(this)}
            onChange={this.handleEntryInputChange.bind(this)}
            value={this.state.entryInput}
          />

          <button onClick={this.addEntryButtonClicked.bind(this)}>Add Entry</button>
        </form>
        <button onClick={this.createPoll.bind(this)}>Create</button>
      </div>
    )
  }
}


CreatePollPage.propTypes = {
  dispatch: PropTypes.func.isRequired
}


// export default connect()(CreatePollPage)
export default connect()(CreatePollPage)
