import { Router } from 'express'
import { createPoll, updatePoll, deletePoll } from '../../controllers/poll.controller'
const router = new Router()

router.route('/polls').post(createPoll)
router.route('/polls').put(updatePoll)
router.route('/polls').delete(deletePoll)

export default router
