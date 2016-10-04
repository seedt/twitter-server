'use strict'

const express = require('express')
const router = express.Router()
const _request = require('request')
const twitterAccessHelper = require('../twitterAccessHelper')

router.get('/tweets/:screen_name', (request, response) => {
  const screenName = request.params.screen_name
  let count = request.query.count || 10
  count = count > 100 ? 100 : count

  if (!screenName) {
    response.status(404).send('BAD REQUEST')
  } else {
    twitterAccessHelper.getOAuthAccessToken()
    .then((accessToken) => {
      const options = {
        url: `https://api.twitter.com/1.1/statuses/user_timeline.json?include_rts=false&count=${count}&screen_name=${screenName}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }

      _request.get(options, (error, res, body) => {
        if (error) {
          response.status(500).send(error)
        } else {
          const json = JSON.parse(body)
          const wordMap = {}

          json.map((tweet) => {
            tweet.text.split(/(\s+)/).map((word) => {
              word = word.toLowerCase()
              wordMap[word] = wordMap[word] ? +wordMap[word] + 1 : 1
            })
          })

          const sortedWords = Object.keys(wordMap).sort((a, b) => {
            return wordMap[b] - wordMap[a]
          })

          const results = {}

          sortedWords.map((word) => {
            results[word] = wordMap[word]
          })

          response.status(200).send(results)
        }
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
})

module.exports = router
