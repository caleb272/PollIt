import React from 'react'
import { Link } from 'react-router'

function LoginButton() {
  return (
    <h1>
      <Link to={'/api/auth/github'}>
        Login With Github
      </Link>
    </h1>
  )
}

export default LoginButton
