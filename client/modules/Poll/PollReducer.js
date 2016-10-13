import { UPDATE_POLL } from './PollActions'

const initialState = []

function PollReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_POLL':
      return [...state, action.poll]

    case UPDATE_POLL:
      console.log('before:', action)
      // console.log('after:', state.map(currentPoll => currentPoll.id === action.poll.id ? action.poll : currentPoll))
      return state.map(currentPoll => currentPoll.cuid === action.poll.cuid ? action.poll : currentPoll)

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
