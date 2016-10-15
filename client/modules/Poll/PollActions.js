import callApi from '../../util/apiCaller'

export const UPDATE_POLL = 'UPDATE_POLL'

export function updatePollRequest(pollID, voterID, entryTitle) {
  console.log('pollID:', pollID)
  return function dispatchedRequest(dispatch) {
    return callApi('polls', 'PUT', { pollID, voterID, entryTitle })
      .then(response => dispatch(updatePoll(response.updatedPoll)))
      .catch(err => console.error(err))
  }
}


export function updatePoll(poll) {
  return {
    type: UPDATE_POLL,
    poll
  }
}
