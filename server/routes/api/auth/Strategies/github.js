import { Strategy as GithubStrategy } from 'passport-github2'
import { Router } from 'express'
import envVariables from '../../../../util/envVariables'

const router = new Router()

export function strategy(verifyCallback) {
  return new GithubStrategy(
    {
      clientID: envVariables('GITHUB_CLIENT_ID'),
      clientSecret: envVariables('GITHUB_CLIENT_SECRET_ID'),
      callbackURL: envVariables('GITHUB_CALLBACK_URL')
    },
    verifyCallback
  )
}


export function authRoutes(passport) {
  router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
  router.get('/github/callback',
      passport.authenticate('github', { failureRedirect: '/failed' }),
      (req, res) => {
        res.redirect('/')
      }
    )
  return router
}
