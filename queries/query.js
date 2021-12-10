const { gql } = require('apollo-server-express');
const FIND_SOCIAL_USER = gql`
  query ($socialId: String) {
    allUsers(where: { socialId: $socialId }) {
      id
      username
    }
  }
`


module.exports = { FIND_SOCIAL_USER }