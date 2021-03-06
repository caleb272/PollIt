import callApi from '../../util/apiCaller'

export const UPDATE_POLL = 'UPDATE_POLL'
export const CREATE_POLL = 'CREATE_POLL'
export const DELETE_POLL = 'DELETE_POLL'

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


export function updatePollRequest(poll) {
  return function dispatchRequest(dispatch) {
    return callApi('polls', 'PUT', poll)
      .then(({ updatedPoll }) => {
        if (updatedPoll) {
          dispatch(updatePoll(poll))
        } else {
          dispatch(noChange)
        }
      })
  }
}


export function voteOnPollRequest(cuid, entryTitle) {
  return function dispatchedRequest(dispatch) {
    return callApi('polls/vote', 'PATCH', { cuid, entryTitle })
      .then(({ votedOnPoll }) => {
        if (votedOnPoll) {
          dispatch(updatePoll(votedOnPoll))
        } else {
          dispatch(noChange())
        }
      })
    .catch(err => console.error(err)) // eslint-disable-line
  }
}


export function deletePollRequest(pollID) {
  return function dispatchedRequest(dispatch) {
    dispatch(deletePoll(pollID))
    callApi('polls', 'DELETE', { pollID })
      .catch(err => console.error(err))
  }
}


export function createPoll(poll) {
  return {
    type: CREATE_POLL,
    poll
  }
}


export function updatePoll(poll) {
  return {
    type: UPDATE_POLL,
    poll
  }
}


export function deletePoll(pollID) {
  return {
    type: DELETE_POLL,
    pollID
  }
}


export function noChange() {
  return {
    type: 'NO_CHANGE'
  }
}
