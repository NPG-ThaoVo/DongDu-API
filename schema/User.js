const { Text, Password, Checkbox, CalendarDay, Relationship } = require('@keystonejs/fields')
const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image')
const access = require('../access.control');
const orgImgAdapter = imageSet("OBDDImage");
const User = {
  fields: {
    username: { type: Text },
    password: {
      type: Password
    },
    fullname: { type: Text },
    avatar: { type: CloudinaryImage, adapter: orgImgAdapter },
    gender: { type: Text },
    yearOfBirth: { type: Text },
    course: { type: Text },
    majorDetail: { type: Text },
    note: { type: Text },
    major: { type: Relationship, ref: "Major", many: false },
    createdAt: {
      type: CalendarDay,
      dateFrom: "2001-01-16"
    },
    OBDD: { type: Boolean }
  },
  // List-level access controls
  access: {
    read:  access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdminOrOwner,
    delete: access.userIsAdmin,
  }
}

module.exports = User
