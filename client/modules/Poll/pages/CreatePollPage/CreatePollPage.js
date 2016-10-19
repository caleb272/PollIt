import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { sortPollEntries, sortOptions } from '../../../../../tools/voting_tools.js'

import BarChart from '../../components/BarChart/BarChart'
import { createPollRequest } from '../../PollActions'


class CreatePollPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entryInput: '',
      poll: {
        title: '',
        author: '',
        authorID: '',
        sortOrder: 'None',
        entries: [],
        cuid: '0',
        dateCreated: Date.now()
      },
      triggerPollUpdate: () => {}
    }
  }


  setTriggerPollUpdate(triggerPollUpdate) {
    this.setState({ triggerPollUpdate })
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
    const entries = this.state.poll.entries
    if (this.findEntry(title) === -1 && title.length > 0) {
      entries.push(this.createEntry(title, entries.length))
    }
    sortPollEntries(this.state.poll)
    this.setState({ entryInput: '' })
    this.state.triggerPollUpdate()
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


  createEntry(title, originalEntryIndex) {
    return {
      title,
      votes: [],
      originalEntryIndex
    }
  }


  sortOrderChanged({ target: { value } }) {
    this.state.poll.sortOrder = value
    console.log('unsorted:', this.state.poll.entries)
    sortPollEntries(this.state.poll)
    console.log('sorted:', this.state.poll.entries)
    this.state.triggerPollUpdate()
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
          <BarChart pollData={this.state.poll} setTriggerUpdate={this.setTriggerPollUpdate.bind(this)} />
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

          <label htmlFor="sort-options">Sort By</label>
          <select
            id="sort-options"
            onChange={this.sortOrderChanged.bind(this)}
          >
            {sortOptions.map(option => <option value={option} key={option}>{option}</option>)}
          </select>

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
