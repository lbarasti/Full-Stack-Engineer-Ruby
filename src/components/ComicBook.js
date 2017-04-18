import React from 'react';
import styles from './ComicBook.css';
import Image from 'react-bootstrap/lib/Image';

class ComicBook extends React.Component {

  render()  {
    return (
      <div className={styles.comicbook}>
        <Image src={this.props.image} responsive />
        <div className={styles.infobar}>
          <div className={styles.upvotes}>{this.props.votes || ""}</div>
          <div className={`${this.props.favourite ? styles.heart_on : styles.heart_off} ${styles.heart}`}
               onClick={this.props.addFavourite(this.props.id)} />
        </div>
      </div>
    )
  }
}

export default ComicBook
