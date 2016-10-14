import Poll from '../models/poll'
import mongoose from 'mongoose'

export function addPoll(req, res) {
  console.log('createPoll called:', req.body)
  res.send({ message: 'response message' })
}

export function updatePoll(req, res) {
  console.log('your is authenticated:', req.isAuthenticated())
  console.log('yoru ip address:', req.connection.remoteAddress)
  // Poll.findOne({ cuid: req.body.pollID })
  //   .then(found => console.log('found with pollID :', found))
  //   .catch(err => console.log(err))

  res.send({ updatedPoll: req.body })
}
