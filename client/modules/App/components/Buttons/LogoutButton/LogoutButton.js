import React from 'react'
import { Link } from 'react-router'

import styles from '../Buttons.css'

function LogoutButton() {
  return (
    <a href="/auth/logout" className={`${styles['header-button']} ${styles['right-button']}`}>
      <span>
        Logout
      </span>
    </a>
  )
}


export default LogoutButton
