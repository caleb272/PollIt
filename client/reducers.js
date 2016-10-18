/**
 * Root Reducer
 */
import { combineReducers } from 'redux'

// Import Reducers
import app from './modules/App/AppReducer'
import posts from './modules/Post/PostReducer'
import intl from './modules/Intl/IntlReducer'
import polls from './modules/Poll/PollReducer'

/* temp till i create the user pages */
function user(state = null, action) {
  switch (action.type) {
    default:
      return state
  }
}

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  posts,
  intl,
  polls,
  user
});
