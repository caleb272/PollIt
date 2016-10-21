import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import LoginButton from '../Buttons/LoginButton/LoginButton'
import LogoutButton from '../Buttons/LogoutButton/LogoutButton'
import CreatePollButton from '../Buttons/CreatePollButton/CreatePollButton'
import MyPollsButton from '../Buttons/MyPollsButton/MyPollsButton'

import styles from './Header.css'

export function Header(props, context) {
  return (
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
            <MyPollsButton />
            <CreatePollButton />
          </div>
        }
      </div>
    </div>
  )
}


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
