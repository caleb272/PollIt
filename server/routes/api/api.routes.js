import { Router } from 'express'

import polls from './poll.routes'
import posts from './post.routes'

const router = new Router()

router.use(polls)
router.use(posts)

export default router
