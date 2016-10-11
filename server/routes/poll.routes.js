import { Router } from 'express'
import { updatePoll } from '../controllers/poll.controller'
const router = new Router()

router.route('/polls').put(updatePoll)

export default router
