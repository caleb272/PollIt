import React, { PropTypes } from 'react'
import { Card, CardHeader, CardMedia } from 'material-ui/Card'
import { Link } from 'react-router'
import BarChart from '../BarChart/VoteableBarChart'

import styles from './PollListItem.css'

function PollListItem(props) {
  const title = (
    <Link href={`/polls/${props.poll.cuid}`}>{props.poll.title}</Link>
  )

  const subtitle = (
    <span>
      Created by <Link href={`/polls/user/${props.poll.authorID}`}>{props.poll.author}</Link>
    </span>
  )

  return (
    <div className={`${styles['poll-list-item']} ${styles['page-padding']}`}>
      <Card expandable={null}>
        <CardHeader
          title={title}
          subtitle={subtitle}
        />
        <CardMedia>
          <center>
            <BarChart poll={props.poll} />
          </center>
        </CardMedia>
        {props.innerElements}
      </Card>
    </div>
  )
}

PollListItem.propTypes = {
  poll: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    authorID: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
    cuid: PropTypes.string.isRequired
  }),
  innerElements: PropTypes.object,
}

export default PollListItem
