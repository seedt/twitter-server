'use strict'

const OAuth = require('OAuth')

// You will need to use your own twitter dev keys here as I'm not going to publish mine to github!
// Put them in a .env file and they will be loaded
const consumerKey = process.env.CONSUMER_KEY
const consumerSecret = process.env.CONSUMER_SECRET

let accessToken

module.exports = {
  getOAuthAccessToken: () => {
    return new Promise((resolve, reject) => {
      if (accessToken) {
        console.log('Returning cached access token')
        return resolve(accessToken)
      } else {
        console.log('Fetching access token')
        const OAuth2 = OAuth.OAuth2

        const oauth2 = new OAuth2(
           consumerKey,
           consumerSecret,
           'https://api.twitter.com/',
           null,
           'oauth2/token',
           null
        )

        oauth2.getOAuthAccessToken(
          '',
          {'grant_type': 'client_credentials'},
          (error, access_token, refresh_token, results) => {
            if (error) {
              return reject(error)
            }

            accessToken = access_token
            return resolve(accessToken)
          }
        )
      }
    })
  }
}
