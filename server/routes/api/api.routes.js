import ( Router ) from 'express'

import polls from './poll.routes'
import posts from './post.routes'

router.use(polls)
router.use(posts)

const router = new Router()
