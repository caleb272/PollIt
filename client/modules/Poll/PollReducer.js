import { CREATE_POLL, UPDATE_POLL, DELETE_POLL } from './PollActions'
import { sortPollEntries } from '../../../tools/voting_tools'

const initialState = []

function PollReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_POLL:
      return [...state, action.poll]

    case UPDATE_POLL:
      return state.map(currentPoll => (currentPoll.cuid === action.poll.cuid ? action.poll : currentPoll))

    case DELETE_POLL:
      return state.filter(poll => poll.cuid !== action.pollID)

    default:
      return state
  }
}


export function getPolls(state) {
  const polls = state.polls.map(sortPollEntries)
  return sortPollsNewestToOldest(polls)
}


export function getPoll(state, cuid) {
  return sortPollEntries(state.polls.filter(poll => poll.cuid === cuid)[0])
}


export function getUsersPolls(state, userId) {
  let usersPolls = state.polls.filter(poll => poll.authorID === userId)
  usersPolls = usersPolls.map(sortPollEntries)
  return sortPollsNewestToOldest(usersPolls)
}


export function getUser(state) {
  return state.user.userProfile
}


export function getClientIP(state) {
  return state.user.clientIP
}


function sortPollsNewestToOldest(polls) {
  return polls.sort((poll1, poll2) => poll1.dateCreated < poll2.dateCreated)
}


export default PollReducer
