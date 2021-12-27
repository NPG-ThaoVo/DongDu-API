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
      password: $socialId
      fullname: $fullname
      socialId: $socialId
      provider: $provider
      email: $email
      socialInfo: $socialInfo
    }
  ) {
    id
    username
    socialId
    fullname
    provider
    email
    socialInfo
  }
}
`;

const AUTHENTICATION_USER = gql`
  mutation authentication($username: String, $password: String) {
    authenticateUserWithPassword(username: $username, password: $password) {
      token
    } 
  }
`;

const UPDATE_USER = gql`
  mutation ($id: ID!, $data: UserUpdateInput) {
    userdata: updateUser(id: $id, data: $data) {
      email
      id
    }
}`

module.exports = { CREATE_SOCIAL_USER, AUTHENTICATION_USER, UPDATE_USER }