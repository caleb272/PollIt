import Poll from '../models/poll'
import votingTools from '../../tools/voting_tools'
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
      votingTools.voteOnPollEntries(voterID, entryTitle, poll.entries)
      poll.markModified('entries')
      return poll.save()
        .then(updatedPoll => send(updatedPoll, 'updated poll'))
    })
    .catch(err => console.error(err)) // eslint-disable-line

    // console.log('your is authenticated:', req.isAuthenticated())
    // console.log('yoru ip address:', req.connection.remoteAddress)
  function send(updatedPoll, message) {
    res.send({ updatedPoll, message })
  }
}


export function deletePoll(req, res) {
  Poll.findOneAndRemove({ cuid: req.body.pollID })
    .then(() => res.send({ message: 'success' }))
    .catch(err => console.error(err)) // eslint-disable-line
}
