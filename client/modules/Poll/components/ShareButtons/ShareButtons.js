import React, { PropTypes } from 'react'
import FlatButton from 'material-ui/FlatButton'

function ShareButtons(props) {
  const baseURL = 'http://192.168.1.8:8000/polls/'
  const facebook = 'http://www.facebook.com/sharer.php?u='
  const googlePlus = 'https://plus.google.com/share?url='
  const twitter = 'https://twitter.com/share?url='

  function shareOn(socialMediaLink) {
    openUrlInNewTab(buildShareURL(socialMediaLink))
  }


  function buildShareURL(socialMediaLink) {
    return `${socialMediaLink}${baseURL}${props.poll.cuid}`
  }


  function openUrlInNewTab(url) {
    const win = window.open(url, '_blank')
    win.focus()
  }


  return (
    <div>
      <span>
        Share On:
      </span>
      <span>
        <FlatButton
          label="Facebook"
          onClick={() => shareOn(facebook)}
          primary={true}
        />
        <FlatButton
          label="Google+"
          onClick={() => shareOn(googlePlus)}
          primary={true}
        />
        <FlatButton
          label="Twitter"
          onClick={() => shareOn(twitter)}
          primary={true}
        />
      </span>
    </div>
  )
}

ShareButtons.propTypes = {
  poll: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
    cuid: PropTypes.string.isRequired
  })
}

export default ShareButtons
