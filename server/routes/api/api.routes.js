import { Router } from 'express'

import auth from './auth/auth'
import polls from './poll.routes'
import posts from './post.routes'

const router = new Router()

router.use(auth)
router.use(polls)
router.use(posts)

export default router
