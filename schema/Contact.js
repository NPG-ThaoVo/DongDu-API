const { Text } = require("@keystonejs/fields");
const access = require("../access.control");

const Contact = {
  fields: {
    fullname: { type: Text },
    email: { type: Text },
    course: { type: Text },
    content: { type: Text },
  },
  access: {
    read: access.userIsAdmin,
    update: access.userIsAdmin,
    create: true,
    delete: access.userIsAdmin,
  },
};

module.exports = Contact;
