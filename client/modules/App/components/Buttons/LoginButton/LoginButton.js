import React from 'react'

import styles from '../Buttons.css'

function LoginButton() {
  return (
    <a href="/api/auth/github/" className={`${styles['header-button']} ${styles['right-button']}`}>
      <span>
        Login With Github
      </span>
    </a>
  )
}

export default LoginButton
