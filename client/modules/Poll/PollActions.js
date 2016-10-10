import callApi from '../../util/apiCaller'

export const UPDATE_POLL = 'UPDATE_POLL'

export function updatePollRequest(poll) {
  return function dispatchedRequest(dispatch) {
    return callApi('polls', 'put', poll)
      .then(response => dispatch(updatePoll(response.poll)))
      .catch(err => console.error(err))
  }
}


export function updatePoll(poll) {
  return {
    type: UPDATE_POLL,
    poll
  }
}
