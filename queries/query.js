const { gql } = require('apollo-server-express');
const FIND_SOCIAL_USER = gql`
  query($socialId: String) {
    allUsers(where: { socialId: $socialId }) {
      id
      username
      password_is_set
      fullname
      email
      avatar {
        path
        filename
        id
        originalFilename
        mimetype
        encoding
        publicUrl
      }
      email
      gender
      yearOfBirth
      course
      majorDetail
      note
      major {
        id
        name
      }
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