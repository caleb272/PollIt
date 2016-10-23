/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './modules/App/App';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./modules/Poll/pages/PollListPage/PollListPage')
  require('./modules/Poll/pages/CreatePollPage/CreatePollPage')
  require('./modules/Poll/pages/PollDetailPage/PollDetailPage')
  require('./modules/Poll/pages/UserPollsPage/UserPollsPage')
  require('./modules/Poll/pages/404/404')
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Poll/pages/PollListPage/PollListPage').default)
        });
      }}
    />

    <Route path="polls">
      <Route
        path="create(/:cuid)"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Poll/pages/CreatePollPage/CreatePollPage').default)
          })
        }}
      />
      <Route
        path=":cuid"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Poll/pages/PollDetailPage/PollDetailPage').default)
          })
        }}
      />
      <Route path="user">
        <Route
          path=":userid"
          getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('./modules/Poll/pages/UserPollsPage/UserPollsPage').default)
            })
          }}
        />
      </Route>
    </Route>

    <Route
      path="*"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Poll/pages/404/404').default)
        })
      }}
    />
  </Route>
);
