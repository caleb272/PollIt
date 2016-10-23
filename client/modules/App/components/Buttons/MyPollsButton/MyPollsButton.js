import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import styles from '../Buttons.css'

function MyPollsButton(props) {
  return (
    <Link to={`/polls/user/${props.userID}`}>
      <span className={`${styles['header-button']}`}>
        My Polls
      </span>
    </Link>
  )
}


MyPollsButton.propTypes = {
  userID: PropTypes.string.isRequired
}


export default MyPollsButton
