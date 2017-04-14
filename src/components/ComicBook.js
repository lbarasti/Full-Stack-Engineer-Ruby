import React from 'react';
import styles from './ComicBook.css';
import Image from 'react-bootstrap/lib/Image';

class ComicBook extends React.Component {

  render()  {
    return (
      <div className={styles.comicbook}>
        <Image src={this.props.image} responsive />
        <div className={`${this.props.favourite ? styles.heart_on : styles.heart_off} ${styles.heart}`}
             onClick={this.props.toggleFavourite(this.props.id)} />
      </div>
    )
  }
}

export default ComicBook
