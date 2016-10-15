import React from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'

import LoginButton from '../LoginButton/LoginButton'

// Import Style
import styles from './Header.css'

export function Header(props, context) {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles['site-title']}>
          <Link to="/" id="siteTitle">POLL IT</Link>
        </h1>
        {
          context.router.isActive('/', true)
            ? <LoginButton />
            : null
        }
      </div>
    </div>
  )
}

Header.contextTypes = {
  router: React.PropTypes.object,
}

export default Header;
