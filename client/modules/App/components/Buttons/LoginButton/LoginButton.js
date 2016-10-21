import React from 'react'
import styles from '../Buttons.css'

function LoginButton() {
  return (
    <a href="/auth/github" className={`${styles['header-button']} ${styles['left-button']} ${styles['right-button']}`}>
      <span>
        Login with Github
      </span>
    </a>
  )
}

export default LoginButton
