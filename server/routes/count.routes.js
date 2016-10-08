import { Router } from 'express'
import * as CountController from '../controllers/count.controller'
const router = new Router()

router.route('/count').post(CountController.incrementCount)

export default router
