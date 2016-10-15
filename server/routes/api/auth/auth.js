import { Router } from 'express'
import connectMongo from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import UserModel from '../../../models/user'
import mongoose from 'mongoose'

import envVariables from '../../../util/envVariables'
import { strategy as githubStrategy, authRoutes as githubAuthRoutes } from './strategies/github'

function verifyCallback(accessToken, refreshToken, profile, done) {
  process.nextTick(() => {
    UserModel.findOne({ github_id: profile.id }, (err, user) => {
      if (!user) {
        new UserModel({
          username: profile.displayName,
          [`${profile.provider}_id`]: profile.id
        }).save(done)
      } else {
        done(err, user)
      }
    })
  })
}


const MongoStore = connectMongo(session)
const router = new Router()

const sessionSettings = {
  secret: envVariables('EXPRESS_SESSION_SECRET'),
  resave: false,
  saveUnititialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}

passport.serializeUser((user, done) => {
  done(null, user._id)
})


passport.deserializeUser((id, done) => {
  UserModel.findOne({ _id: id }, (err, user) => {
    done(err, user)
  })
})

passport.use(githubStrategy(verifyCallback))

router.use(session(sessionSettings))
router.use(passport.initialize())
router.use(passport.session())

router.use('/auth', githubAuthRoutes(passport))

export default router
