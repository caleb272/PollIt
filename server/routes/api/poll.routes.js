import { Router } from 'express'
import { createPoll, updatePoll } from '../../controllers/poll.controller'
const router = new Router()

router.route('/polls').post(createPoll)
router.route('/polls').put(updatePoll)

export default router
