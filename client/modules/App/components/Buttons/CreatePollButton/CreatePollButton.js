import React from 'react'
import { Link } from 'react-router'

import styles from '../Buttons.css'

function CreatePollButton() {
  return (
    <Link to="/api/polls/create" >
      <span className={`${styles['header-button']} ${styles['left-button']}`}>
        CreatePoll
      </span>
    </Link>
  )
}


export default CreatePollButton
