import React from 'react'

import styles from './LoginButton.css'

function LoginButton() {
  return (
    <h5>
      <a href="/api/auth/github/" className={styles['login-button']}>
        Login With Github
      </a>
    </h5>
  )
}

export default LoginButton
