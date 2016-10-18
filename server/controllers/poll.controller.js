import Poll from '../models/poll'
import { slug } from 'cuid'

export function createPoll(req, res) {
  if (!req.user) {
    res.redirect('/api/auth/github')
    return
  }

  const poll = req.body
  poll.author = req.user.username
  poll.authorID = req.user.github_id
  poll.cuid = slug()
  poll.dateCreated = Date.now()

  checkIfPollExists(poll)
    .then((doesExist) => {
      if (doesExist) {
        send(null, 'poll already exists')
      } else {
        createPollInDB(poll)
          .then(createdPoll => send(createdPoll, 'success'))
      }
    })
    .catch((err) => {
      console.error(err) // eslint-disable-line
      send(null, 'couldnt create poll')
    })

  function send(createdPoll, message) {
    res.send({ createdPoll, message })
  }
}


function checkIfPollExists(poll) {
  return Poll.findOne({ title: poll.title })
    .then(found => !!found)
}


function createPollInDB(poll) {
  return new Poll(poll).save()
}


export function updatePoll(req, res) {
  if (!voterID && !req.user) {
    send(null, 'no voter id')
    return
  }

  const voterID = req.body.voterID || req.user.github_id
  const entryTitle = req.body.entryTitle
  const query = { cuid: req.body.cuid }

  Poll.findOne(query)
    .then((poll) => {
      return voteOnPoll(voterID, entryTitle, poll)
        .then(updatedPoll => send(updatedPoll, 'it works'))
    })
    .catch(err => console.error(err))

    // console.log('your is authenticated:', req.isAuthenticated())
    // console.log('yoru ip address:', req.connection.remoteAddress)
  function send(updatedPoll, message) {
    res.send({ updatedPoll, message })
  }
}


function voteOnPoll(voterID, entryTitle, poll) {
  const lastVotedOnEntry = getVotedOnEntryByVoter(voterID, poll)
  if (lastVotedOnEntry) {
    const votedOnEntry = getEntryByTitle(entryTitle, poll)

    lastVotedOnEntry.votes = lastVotedOnEntry.votes.filter(vote => vote !== voterID)
    if (votedOnEntry !== lastVotedOnEntry) {
      votedOnEntry.votes.push(voterID)
    }
  } else {
    getEntryByTitle(entryTitle, poll).votes.push(voterID)
  }

  poll.markModified('entries')
  return poll.save()
}


function getVotedOnEntryByVoter(voterID, { entries }) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (entry.votes.includes(voterID)) {
      return entry
    }
  }

  return null
}


function getEntryByTitle(entryTitle, { entries }) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (entry.title === entryTitle) {
      return entry
    }
  }

  return null
}
