import callApi from '../../util/apiCaller'

export const UPDATE_POLL = 'UPDATE_POLL'
export const CREATE_POLL = 'CREATE_POLL'

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


export function updatePollRequest(cuid, entryTitle, voterID) {
  return function dispatchedRequest(dispatch) {
    return callApi('polls', 'PUT', { cuid, entryTitle, voterID })
    .then(({ updatedPoll }) => {
      if (updatedPoll) {
        console.log('updatedPoll:', updatedPoll)
        dispatch(updatePoll(updatedPoll))
      } else {
        dispatch(noChange())
      }
    })
    .catch(err => console.error(err)) // eslint-disable-line
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


export function noChange() {
  return {
    type: 'NO_CHANGE'
  }
}
