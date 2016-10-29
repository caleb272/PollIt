import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { TextField, SelectField, MenuItem, RaisedButton, Dialog } from 'material-ui'

import { sortPollEntries, sortOptions } from '../../../../../server/util/voting_tools.js'

import BarChart from '../../components/BarChart/BarChart'
import IncompletePollDialog from '../../components/IncompletePollDialog/IncompletePollDialog'
import { createPollRequest, updatePollRequest } from '../../PollActions'
import { getPoll, getUser } from '../../PollReducer'

class CreatePollPage extends Component {
  constructor(props) {
    super(props)

    const poll = props.poll || {
      title: '',
      author: '',
      authorID: '',
      sortOrder: 'None',
      entries: [],
      cuid: '0',
      dateCreated: Date.now()
    }

    this.state = {
      entryInput: '',
      dialog: null,
      poll,
      triggerPollUpdate: () => {}
    }
  }


  setTriggerPollUpdate(triggerPollUpdate) {
    this.setState({ triggerPollUpdate })
  }


  handleTitleInputChange(action) {
    action.preventDefault()
    this.state.poll.title = action.target.value
    this.setState({ poll: this.state.poll })
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
    let entries = this.state.poll.entries
    if (this.findEntry(title) === -1 && title.length > 0) {
      entries.push(this.createEntry(title, entries.length))
    } else {
      entries = this.deleteEntry(entries, title)
    }
    this.state.poll.entries = entries
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


  deleteEntry(entries, title) {
    const newEntries = entries.filter(current => current.title !== title)
      .sort((current, next) => current.originalEntryIndex > next.originalEntryIndex)

    // set the originalEntryIndexes to the right number
    for (let i = 0; i < newEntries.length; i++) {
      newEntries[i].originalEntryIndex = i
    }

    return newEntries
  }


  createEntry(title, originalEntryIndex) {
    return {
      title,
      votes: [],
      originalEntryIndex
    }
  }


  sortOrderChanged(event, index, value) {
    this.state.poll.sortOrder = value
    sortPollEntries(this.state.poll)
    this.state.triggerPollUpdate()
  }


  createPoll() {
    const poll = this.state.poll
    if (poll.title && poll.entries.length > 1) {
      this.props.dispatch(this.props.editToggled ?
          updatePollRequest(poll) : createPollRequest(poll))
      browserHistory.push('/')
    } else {
      this.alertIncompletePoll(poll)
    }
  }


  alertIncompletePoll(poll) {
    const openDialog = (message) => this.setState({ dialog: message })
    if (!poll.title) {
      openDialog('no title')
    } else {
      openDialog('you need atleast two entries')
    }
  }

  render() {
    return (
      <div>
        <TextField
          floatingLabelText="Poll Title"
          fullWidth={true}
          onChange={this.handleTitleInputChange.bind(this)}
          value={this.state.poll.title}
        />

        <div>
          <BarChart pollData={this.state.poll} setTriggerUpdate={this.setTriggerPollUpdate.bind(this)} />
        </div>

        <form onSubmit={action => action.preventDefault()}>
          <TextField
            floatingLabelText="Entry Name"
            onChange={this.handleEntryInputChange.bind(this)}
            onKeyDown={this.handleEntryInputKeyDown.bind(this)}
            value={this.state.entryInput}
            fullWidth={true}
          />
          <RaisedButton
            label="Add/Remove Entry"
            primary={true}
            fullWidth={true}
            onClick={this.addEntryButtonClicked.bind(this)}
          />

          <SelectField
            floatingLabelText="Sort by"
            value={this.state.poll.sortOrder}
            onChange={this.sortOrderChanged.bind(this)}
            autoWidth={false}
            fullWidth={true}
          >
            {sortOptions.map(option => <MenuItem value={option} key={option} primaryText={option} />)}
          </SelectField>

          <RaisedButton
            label="Save"
            primary={true}
            fullWidth={true}
            onClick={this.createPoll.bind(this)}
          />
        </form>


        <div>
          <IncompletePollDialog
            dialog={this.state.dialog ? this.state.dialog : ''}
            close={() => this.setState({ dialog: null })}
          />
        </div>
      </div>
    )
  }
}


CreatePollPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  editToggled: PropTypes.bool.isRequired,
  poll: PropTypes.object
}


function mapStateToProps(state, props) {
  const user = getUser(state) || {}
  let poll = getPoll(state, props.params.cuid) || {}
  poll = user.github_id === poll.authorID ? poll : null
  return {
    editToggled: !!poll,
    poll
  }
}


export default connect(mapStateToProps)(CreatePollPage)
