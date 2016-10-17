import Poll from '../models/poll'
import { slug } from 'cuid'

export function createPoll(req, res) {
  if (!req.user) {
    res.redirect('/api/auth/github')
  }

  const poll = req.body
  poll.author = req.user.username
  poll.authorID = req.user.github_id
  poll.cuid = slug()
  poll.dateCreated = Date.now()

  doesPollExist(poll)
    .then((doesExist) => {
      console.log('does exist:', doesExist)
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


export function updatePoll(req, res) {
  console.log('your is authenticated:', req.isAuthenticated())
  console.log('yoru ip address:', req.connection.remoteAddress)
  // Poll.findOne({ cuid: req.body.pollID })
  //   .then(found => console.log('found with pollID :', found))
  //   .catch(err => console.log(err))

  res.send({ updatedPoll: req.body })
}


function doesPollExist(poll) {
  return Poll.findOne({ title: poll.title })
    .then(found => !!found)
}


function createPollInDB(poll) {
  return new Poll(poll).save()
}
