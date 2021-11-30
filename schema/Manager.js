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
        createdAt: {
            type: CalendarDay,
            dateFrom: "2001-01-16"
        },
        role: { type: Boolean },
        note: { type: Text }
    },
    // List-level access controls
    access: {
        read: access.userIsAdmin,
        update: access.userIsAdmin,
        create: access.userIsAdmin,
        delete: access.userIsAdmin,
        auth: true
    }
}

module.exports = User
