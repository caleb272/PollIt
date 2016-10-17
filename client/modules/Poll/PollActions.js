import callApi from '../../util/apiCaller'

export const UPDATE_POLL = 'UPDATE_POLL'
export const CREATE_POLL = 'CREATE_POLL'

export function updatePollRequest(pollID, voterID, entryTitle) {
  return function dispatchedRequest(dispatch) {
    return callApi('polls', 'PUT', { pollID, voterID, entryTitle })
      .then(response => dispatch(updatePoll(response.updatedPoll)))
      .catch(err => console.error(err)) // eslint-disable-line
  }
}


export function createPollRequest(poll) {
  return function dispatchedRequest(dispatch) {
    return callApi('polls', 'POST', poll)
      .then(({ createdPoll }) => {
        if (createdPoll) {
          dispatch(createPoll(createdPoll))
        } else {
          dispatch(noChange())
        }
      })
      .catch(err => console.error(err)) // eslint-disable-line
  }
}


export function updatePoll(poll) {
  return {
    type: UPDATE_POLL,
    poll
  }
}


export function createPoll(poll) {
  return {
    type: CREATE_POLL,
    poll
  }
}


export function noChange() {
  return {
    type: "NO_CHANGE"
  }
}
