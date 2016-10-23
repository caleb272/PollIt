import React from 'react'
import FlatButton from 'material-ui/FlatButton'

function LoginButton() {
  function login() {
    window.location.href = '/auth/github'
  }

  return (
    <FlatButton label="Login with Github" onClick={login} />
  )
}

export default LoginButton
