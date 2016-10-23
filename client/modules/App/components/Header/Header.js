import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import LoginButton from '../Buttons/LoginButton'
import LoggedInDropdownButton from '../Buttons/LoggedInDropdownButton'

import AppBar from 'material-ui/AppBar'

export function Header(props) {
  function loggedIn() {
    return (
      <LoggedInDropdownButton
        userID={props.user.github_id}
      />
    )
  }
  return (
    <AppBar
      title="Poll IT"
      onTitleTouchTap={() => browserHistory.push('/')}
      showMenuIconButton={false}
      iconElementRight={props.user ? loggedIn() : <LoginButton />}
    />
  )
}


/* old shit */
/*
<div className={styles.header}>
  <div className={styles.content}>
    <h1 className={styles['site-title']}>
      <Link to="/" id="siteTitle">POLL IT</Link>
    </h1>
    {
      // use this for the polls/user page to change to 404 if the user isnt found
      // context.router.isActive('/', true)
      //   ? <LoginButton />
      //   : null
    }
    {!props.user ?
      <LoginButton />
      :
      <div>
        <LogoutButton />
        <MyPollsButton userID={props.user.github_id} />
        <CreatePollButton />
      </div>
    }
  </div>
</div>
*/


Header.contextTypes = {
  router: React.PropTypes.object
}


Header.propTypes = {
  user: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired
}


function mapStateToProps(state) {
  return {
    user: state.user
  }
}


export default connect(mapStateToProps)(Header);
