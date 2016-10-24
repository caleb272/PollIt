import React, { PropTypes } from 'react'
import { Card, CardHeader, CardMedia } from 'material-ui/Card'
import { Link } from 'react-router'
import BarChart from '../BarChart/VoteableBarChart'

import styles from './PollListItem.css'

function PollListItem(props) {
  function subtitle() {
    return (
      <span>
        Created by
        <Link>{props.poll.author}</Link>
      </span>
    )
  }


  return (
    <div className={styles['page-padding']}>
      <Card expandable={null}>
        <CardHeader
          title={props.poll.title}
          subtitle={subtitle()}
        />
        <CardMedia>
          <center>
            <BarChart poll={props.poll} />
          </center>
        </CardMedia>
      </Card>
    </div>
  )
}

PollListItem.propTypes = {
  poll: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
    cuid: PropTypes.string.isRequired
  })
}

export default PollListItem
