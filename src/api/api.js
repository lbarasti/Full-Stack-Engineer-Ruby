import config from '../config'

const marvelKey = config.marvelKey
const beginningOfTime = "1930-04-01"

const comicsUrl = (from, to, limit, offset, characterId) => {
  const queryString = `format=comic&formatType=comic&dateRange=${from}%2C${to}&limit=${limit}&noVariants=true&offset=${offset}&apikey=${marvelKey}`;
  return characterId ?
    `${config.comicsForCharacterUrl.replace(":characterId", characterId)}?${queryString}` :
    `${config.comicsUrl}?${queryString}`
}

const characterUrl = (name) =>
  `${config.characterUrl}?name=${name}&limit=1&apikey=${marvelKey}`

const upvotesUrl = (id) => `${config.upvotesUrl}/${id}`

const getComics = (to) => (offset, characterId) => {
  const url = comicsUrl(beginningOfTime, to, 20, offset, characterId);
  console.log(`GET ${url}`);
  return fetch(url).then(res => res.json())
    .then(wrapper => wrapper.data)
}

const findCharacter = (name) => {
  return fetch(characterUrl(name)).then(res => res.json())
    .then(wrapper => wrapper.data)
}

const toggleFavourite = (id) => {
  fetch(upvotesUrl(id), {
    method: "POST",
    credentials: "include"
  });
}

const Api = {
  getComics,
  toggleFavourite,
  findCharacter
}

export default Api