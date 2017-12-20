const alfy = require('alfy')
const getRhymes = require('get-rhymes')
const fuzzySearch = require('fuzzysearch')

const search = async (query = '', filter = '') => {
  const results = await getCachedResults(query)
  const filteredResults = filterResults(results, filter)
  alfy.output(filteredResults)
}

const getCachedResults = async query => {
  const cached = alfy.cache.get(query)
  if (cached) {
    return cached
  } else {
    const rhymes = getResults(query)
    const tenMinutes = 1000 * 60 * 10 // in milliseconds
    alfy.cache.set(query, rhymes, { maxAge: tenMinutes })
    return rhymes
  }
}

const getResults = async query => {
  const hits = await getRhymes(query)
  const allRhymes = hits.join('\n')
  const format = rhyme => {
    return {
      title: rhyme,
      arg: allRhymes,
      autocomplete: rhyme
    }
  }
  return hits.map(format)
}

const filterResults = (results, filter) => {
  if (isBlank(filter)) return results

  const isFuzzyMatch = result => fuzzySearch(filter, result.title)
  return results.filter(isFuzzyMatch)
}

const isBlank = word => word.trim().length === 0

const [query, filter] = alfy.input.split(' ')
search(query, filter)
