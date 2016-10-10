import { Router } from 'express'
import * as PollController from '../controllers/poll.controller'
const router = new Router()

router.route('/polls').put((req, res) => {
  console.log(req.body)
  res.send(req.body)
})

export default router
