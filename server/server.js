// "start": "cross-env BABEL_DISABLE_CACHE=1 NODE_ENV=development nodemon index.js",
// "start": "NODE_ENV=production MONGO_URL=mongodb://caleb-db:123Dog@ds023560.mlab.com:23560/fcc-project-database node index.js",

import Express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override'
import path from 'path';

// Webpack Requirements
import webpack from 'webpack'
import config from '../webpack.config.dev'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
// Initialize the Express App
const app = new Express();
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
import serverConfig from './config'

import auth from './routes/api/auth/auth'
import api from './routes/api/api.routes'

// temp imports figure out how to do this proper
import pollSymbol from '../client/icons/poll-symbol.svg'

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
})


// Apply body Parser and server public assets and routes
app.use(Express.static(path.resolve(__dirname, '../dist')));
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(bodyParser.json())
app.use(methodOverride())

app.use(auth)
app.use('/api', api)

// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);


  // <link rel="shortcut icon" href='${process.env.NODE_ENV === 'production' ? assetsManifest['/poll-symbol.png'] : pollSymbol}' />
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
        <link rel="shortcut icon" href='${pollSymbol}' />
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // this might fix the react attempted to reuse markup in container error try out later
          // window.APP_STATE
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${process.env.NODE_ENV === 'production' ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>

        <script src="https://use.fontawesome.com/cae23e1025.js"></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `
}

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production' ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {``
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    /* THIS IS TEMP TILL I SETUP THE NEED STUFF */
    require('./models/poll').default.find({})
      .then(polls => sendAppToClient({
        polls,
        user: {
          userProfile: req.user,
          clientIP: req.connection.remoteAddress
        },
      }))
      .catch(err => console.error(err))

    /* this works but it doesnt do server side rendering */
    /* this also fixes the refresh not working on the CreatePollPage */
    /* it also stops need woring on the components */
    function sendAppToClient(startingData) {
      const store = configureStore(startingData)
      const finalState = store.getState()

      res
        .set('Content-Type', 'text/html')
        .status(200)
        .end(renderFullPage('', finalState))
    }
    // return fetchComponentData(store, renderProps.components, renderProps.params)
    //   .then(() => {
    //     const initialView = renderToString(
    //       <Provider store={store}>
    //         <IntlWrapper>
    //           <RouterContext {...renderProps} />
    //         </IntlWrapper>
    //       </Provider>
    //     );
    //
    //     const finalState = store.getState()
    //
    //     res
    //       .set('Content-Type', 'text/html')
    //       .status(200)
    //       .end(renderFullPage('', finalState));

      /* this should fix the error being throw specifically data={window.APP_STATE}
        render((
            <ContextWrapper data={window.APP_STATE}>
            <Router history={createHistory()}>
            {routes}
            </Router>
            </ContextWrapper>
        ), document.querySelectorAll('[data-ui-role="content"]')[0]);
    */
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
      // })
      // .catch((error) => next(error));
  });
});

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
});

export default app;
