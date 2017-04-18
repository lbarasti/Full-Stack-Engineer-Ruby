import React from 'react';
import styles from './App.css';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Alert from 'react-bootstrap/lib/Alert';
import InfiniteScroll from 'react-infinite-scroller';
import ComicBook from './ComicBook';
import TopBar from './TopBar';
import Api from '../api/api.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = (new Date()).toJSON().slice(0,10);
    Api.getFavourites().then(comic_ids => {
      const favourites = {};
      comic_ids.forEach(comic_id => { favourites[comic_id] = true });
      this.setState({favourites});
    });
    this.getComics = Api.getComics(currentDate);
    this.itemsPerPage = 20;
    this.state = {
      offset: 0,
      hasMoreItems: true,
      items: [],
      characterId: null,
      showAlert: false,
      favourites: {}
    };
  }

  loadMoreComics(page) {
    if(this.state.loading) { // avoid issuing multiple calls for the same offset
      return null
    }
    
    this.setState({ loading: true });
    this.getComics(this.state.offset, this.state.characterId).then(({count, offset, limit, total, results}) => {
      console.log(`count: ${count}, offset: ${offset}, total: ${total}`);

      const comics = results.map(({id, title, thumbnail}) => {
        return {
          id,
          title,
          image: `${thumbnail.path}.${thumbnail.extension}`,
          key: id,
          favourite: this.state.favourites[id]
        }
      });

      const ids = comics.map(comic => comic.id);
      Api.getVotes(ids).then(votes => {
        const idToVote = ids.reduce((obj, id, idx) => {return Object.assign(obj, {[id]: votes[idx]})}, {});
        this.setState({
          items: this.state.items.map(comic => idToVote[comic.id] ? Object.assign(comic, {votes: idToVote[comic.id]}) : comic)
        });
      });

      this.setState({
        offset: this.state.offset + count,
        hasMoreItems: count + offset < total,
        items: this.state.items.concat(comics),
        loading: false
      })
    });
  }

  handleInput(token) {
    if(token === "") {
      this.setState({
        characterId: null,
        items: [],
        hasMoreItems: true,
        offset: 0,
        showAlert: false
      })
    } else {
      Api.findCharacter(token).then(res => {
        if(res.count == 0) {
          this.setState({
            characterId: null,
            showAlert: true,
            offset: 0,
            hasMoreItems: false,
            items: []
          });
        } else {
          const characterId = res.results[0].id
          if(characterId !== this.state.characterId)
            this.setState({
              characterId: characterId,
              offset: 0,
              hasMoreItems: true,
              items: [],
              showAlert: false
            });
        }
      })
    }
  }

  addFavourite(id) {
    return (evt) => {
      const comic = this.state.items.find((comic) => comic.id == id);
      if (!comic.favourite) {
        Api.addFavourite(id);
        // optimistic update
        this.setState({
          items: this.state.items.map((item) => {
            return item.id == id ?
              Object.assign({}, item, {
                favourite: true,
                votes: item.votes ? item.votes + 1 : 1
              }) :
              item
          }),
          favourites: Object.assign({[id]: true}, this.state.favourites)
        })
      }
    }
  }

  characterNotFound() {
    return <Alert bsStyle="warning">
      <strong>Oh no!</strong> I could not find that character :(
    </Alert>
  }

  render() {
    const alert = this.state.showAlert ? this.characterNotFound() : undefined;

    return (
      <div className={styles.app}>
        <TopBar onInput={this.handleInput.bind(this)}/>
        <Grid>
          {alert}
          <InfiniteScroll
            className={"row"}
            pageStart={0}
            loadMore={this.loadMoreComics.bind(this)}
            hasMore={this.state.hasMoreItems}
            loader={"Loading"}>
              {this.state.items.map((props, idx) => (
              <Col key={`${idx}:${props.key}`} xs={6} md={4}>
                <ComicBook {...props}
                           addFavourite={this.addFavourite.bind(this)} />
              </Col>
              ))}
          </InfiniteScroll>
        </Grid>
      </div>
    )
  }
}

export default App;