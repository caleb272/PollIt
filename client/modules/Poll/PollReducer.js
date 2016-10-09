const initialState = []

function PollReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_POLL':
      return [...state, action.poll]
    default:
      return state
  }
}

export function getPolls(state) {
  return state.polls
}

export function getPoll(state, id) {
  return state.polls.data.filter(poll => poll.id === id)
}

export default PollReducer
