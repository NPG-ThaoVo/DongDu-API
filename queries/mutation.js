const { gql } = require('apollo-server-express');

const CREATE_SOCIAL_USER = gql`
mutation CreateUser(
  $socialId: String
  $fullname: String
  $provider: UserProviderType
  $email: String
  $socialInfo: String
) {
  createUser(
    data: {
      username: $socialId
      fullname: $fullname
      socialId: $socialId
      provider: $provider
      email: $email
      socialInfo: $socialInfo
    }
  ) {
    username
    socialId
    fullname
    provider
    email
    socialInfo
  }
}
`;

module.exports = { CREATE_SOCIAL_USER }