import Express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override'
import path from 'path';
import IntlWrapper from '../client/modules/Intl/IntlWrapper';
import dotenv from 'dotenv'

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// Initialize the Express App
const app = new Express();
dotenv.config()
// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import { configureStore } from '../client/store';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

// Import required modules
import routes from '../client/routes'
import { fetchComponentData } from './util/fetchData'
import api from './routes/api/api.routes'
import dummyData from './dummyData'
import serverConfig from './config'


/* TEMP PASSPORT SETUP */
import UserModel from './models/user'
import passport from 'passport'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'

const MongoStore = connectMongo(session)

passport.serializeUser((user, done) => {
  done(null, user._id)
})


passport.deserializeUser((id, done) => {
  UserModel.findOne({ _id: id }, (err, user) => {
    done(err, user)
  })
})


passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET_ID,
    callbackURL: 'http://192.168.1.8:8000/api/auth/github/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      console.log('profile.id', profile.id)
      UserModel.findOne({ github_id: profile.id }, (err, user) => {
        if (!user) {
          new UserModel({
            username: profile.displayName,
            github_id: profile.id
          }).save((er, newUser) => {
            return done(er, newUser)
          })
        } else {
          return done(err, profile)
        }
      })
    })
  }
))


passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    console.log('loaded profile:', profile)
    return done(null, profile)
  }
))

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }

  // feed some dummy data in DB.
  dummyData();
});


const sessionSettings = {
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUnititialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}


// Apply body Parser and server public assets and routes
app.use(Express.static(path.resolve(__dirname, '../dist')));
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(bodyParser.json())
app.use(methodOverride())
// passport STUFF
app.use(session(sessionSettings))
app.use(passport.initialize())
app.use(passport.session())


app.get('/user', (req, res) => {
  res.send({
    authenticated: req.isAuthenticated(),
    user: req.user
  })
})

app.put('/user', (req, res) => {
  console.log({
    authenticated: req.isAuthenticated(),
    user: req.user
  })
  console.log('called the put user')
  res.send({
    authenticated: req.isAuthenticated(),
    user: req.user
  })
})

/* i making user that the passport user object wasnt working on put protocols */
// app.put('/api/polls', (req, res) => {
//   console.log('api called')
//   console.log({
//     authenticated: req.isAuthenticated(),
//     user: req.user
//   })
//
//   res.send({
//     authenticated: req.isAuthenticated(),
//     user: req.user
//   })
// })
app.use('/api', api)

// app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }))
app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }))
app.get('/api/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/failed' }),
    (req, res) => {
      res.redirect('/')
    }
  )

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    (req, res) => {
      console.log('google auth callback called')
      res.redirect('/')
    })

// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}

        ${process.env.NODE_ENV === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
        <link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${process.env.NODE_ENV === 'production' ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production' ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    function entry(title) {
      function randomVotes() {
        const votes = []
        const end = Math.floor(Math.random() * 10) + 1

        for (let i = 0; i < end; i++) {
          votes.push(Math.floor(Math.random() * 999999999))
        }
        return votes
      }

      return {
        title,
        votes: randomVotes()
      }
    }

    function testChartData() {
      const testData = [
        {
          title: 'Best Programming languages',
          author: 'Clowns',
          entries: ['C++', 'Javascript', 'Java', 'C#'].map(entry),
          // cuid: require('cuid').slug(), // eslint-disable-line
          cuid: '123456',
          dateCreated: Date.now()
        },
        {
          title: 'Best Names',
          author: 'Caleb Martin',
          entries: ['Caleb', 'Martin', 'Ethan', 'Blake'].map(entry),
          // cuid: require('cuid').slug(), // eslint-disable-line
          cuid: '123457',
          dateCreated: Date.now()
        }
      ]

      const TestPollSchema = require('./models/poll').default
      testData.forEach(current => new TestPollSchema(current).save())
      return testData
    }

    const store = configureStore({
      polls: testChartData()
    });

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <IntlWrapper>
              <RouterContext {...renderProps} />
            </IntlWrapper>
          </Provider>
        );

        const finalState = store.getState()

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage('', finalState));

        /* warning js?8a56:36Warning: React attempted to reuse markup in a
        container but the checksum was invalid. This generally means that
        you are using server rendering and the markup generated on the server was
        not what the client was expecting. React injected new markup to
        compensate which works but you have lost many of the benefits of server
        rendering. Instead, figure out why the markup being generated is different
        on the client or server:
        (client) <!-- react-empty: 1 -
        (server) <div data-reactroot=""
        // the line bellow is commented and replaced with the one above all these
        // .end(renderFullPage(initialView, finalState));
        comments due to this error
        */
      })
      .catch((error) => next(error));
  });
});

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
});

export default app;
