import config from '../config'

const marvelKey = config.marvelKey
const beginningOfTime = "2017-04-01"

const comicsUrl = (from, to, limit, offset) =>
 `${config.comicsUrl}?format=comic&formatType=comic&dateRange=${from}%2C${to}&limit=${limit}&noVariants=true&offset=${offset}&apikey=${marvelKey}`

const characterUrl = (token) =>
  `${config.characterUrl}?nameStartsWith=${token}&limit=1&apikey=${marvelKey}`

const upvotesUrl = (id) => `${config.upvotesUrl}/${id}`

const getComics = (to) => (offset) => {
  return fetch(comicsUrl(beginningOfTime, to, 20, offset)).then(res => res.json())
    .then(wrapper => wrapper.data)
}

const findCharacter = (token) => {
  return fetch(characterUrl(token)).then(res => res.json())
    .then(wrapper => wrapper.data)
}

const toggleFavourite = (id) => {
  fetch(upvotesUrl(id), {
    method: "POST",
    credentials: "include"
  });
}

const Api = {
  comicsUrl,
  getComics,
  toggleFavourite,
  findCharacter
}

export default Api