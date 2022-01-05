const { gql } = require('apollo-server-express');
const FIND_SOCIAL_USER = gql`
  query($email: String) {
    allUsers(where: { email: $email }) {
      id
      username
      password_is_set
      fullname
      email
      gender
      yearOfBirth
      course
      majorDetail
      note
      createdAt
      OBOG
      socialId
      provider
      socialInfo
    }
  }
`;

const FIND_USER_BY_EMAIL = gql`
  query($email: String) {
    allUsers(where: { email: $email }) {
      id
      email
      provider
    }
  }
`;



module.exports = { FIND_SOCIAL_USER, FIND_USER_BY_EMAIL }