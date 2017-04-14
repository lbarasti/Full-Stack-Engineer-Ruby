import React from 'react';
import styles from './App.css';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import InfiniteScroll from 'react-infinite-scroller';
import ComicBook from './ComicBook';
import TopBar from './TopBar';
import Api from '../api/api.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = (new Date()).toJSON().slice(0,10);
    this.getComics = Api.getComics(currentDate);
    this.itemsPerPage = 20;
    this.state = {offset: 0, hasMoreItems: true, items: [], characterId: null};
  }

  loadMoreComics(page) {
    this.getComics(this.state.offset, this.state.characterId).then(({count, offset, limit, total, results}) => {
      console.log(`count: ${count}, offset: ${offset}, total: ${total}`);
      const comics = results.map(({id, title, thumbnail}) => {
        return {id, title, image: `${thumbnail.path}.${thumbnail.extension}`}
      }).map(({id, title, image}) => {
        return {id, title, image, key: id, favourite: false}
      });

      this.setState({
        offset: this.state.offset + count,
        hasMoreItems: count + offset < total,
        items: this.state.items.concat(comics)
      })
    });
  }

  handleInput(token) {
    Api.findCharacter(token).then(res => {
      if(res.count == 0) {
        // TODO display notification
      } else {
        this.setState({
          characterId: res.results[0].id,
          offset: 0,
          hasMoreItems: true,
          items: []
        });

      }
    })
  }

  toggleFavourite(id) {
    return (evt) => {
      const comic = this.state.items.find((comic) => comic.id == id);
      if (!comic.favourite) {
        Api.toggleFavourite(id);
        // optimistic update
        this.setState({
          items: this.state.items.map((item) => {
            return item.id == id ? Object.assign({}, item, {favourite: true}) : item
          })
        })
      }
    }
  }

  render() {
    return (
      <div className={styles.app}>
        <TopBar onInput={this.handleInput.bind(this)}/>
        <Grid>
          <InfiniteScroll
            className={"row"}
            pageStart={0}
            loadMore={this.loadMoreComics.bind(this)}
            hasMore={this.state.hasMoreItems}
            loader={"Loading"}>
              {this.state.items.map((props, idx) => (
              <Col key={`${idx}:${this.props.key}`} xs={6} md={4}>
                <ComicBook {...props}
                           toggleFavourite={this.toggleFavourite.bind(this)} />
              </Col>
              ))}
          </InfiniteScroll>
        </Grid>
      </div>
    )
  }
}

export default App;