import { CREATE_POLL, UPDATE_POLL } from './PollActions'

const initialState = { polls: [], user: null }

function PollReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_POLL:
      return [...state, action.poll]

    case UPDATE_POLL:
      return state.map(currentPoll => (currentPoll.cuid === action.poll.cuid ? action.poll : currentPoll))

    default:
      return state
  }
}


export function getPolls(state) {
  return state.polls
}


export function getPoll(state, cuid) {
  return state.polls.filter(poll => poll.cuid === cuid)[0]
}

export function getUser(state) {
  return state.user
}

export default PollReducer
