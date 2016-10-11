import { Router } from 'express'
import { authGithubCallback } from '../controllers/auth.controller'
const router = new Router()

router.route('/auth/github/callback/').get(authGithubCallback)

export default router
