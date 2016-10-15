import { UPDATE_POLL } from './PollActions'

const initialState = []

function PollReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_POLL':
      return [...state, action.poll]

    case UPDATE_POLL:
      console.log('before:', action)
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

export default PollReducer
