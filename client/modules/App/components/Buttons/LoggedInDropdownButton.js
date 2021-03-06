import React, { PropTypes } from 'react'
import { browserHistory } from 'react-router'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import MenuItem from 'material-ui/MenuItem'

const styles = {
  dropdownMenu: {
    width: '200px',
    anchor: 'center'
  }
}

function LoggedInDropdownButton(props) {
  function logout() {
    window.location.href = '/auth/logout'
  }


  function user() {
    redirect(`/polls/user/${props.userID}`)
  }


  function redirect(url) {
    browserHistory.push(url)
  }

  return (
    <IconMenu
      iconButtonElement={
        <IconButton><MoreVertIcon /></IconButton>
      }
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      menuStyle={styles.dropdownMenu}
    >
      <MenuItem primaryText="Create Poll" onClick={() => redirect('/polls/create')} />
      <MenuItem primaryText="My Polls" onClick={user} />
      <MenuItem primaryText="Logout" onClick={logout} />
    </IconMenu>
  )
}


LoggedInDropdownButton.propTypes = {
  userID: PropTypes.string.isRequired
}


export default LoggedInDropdownButton
