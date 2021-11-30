const { Text } = require("@keystonejs/fields");
const access = require("../access.control");
const { reply } = require("../emails");

const Contact = {
  fields: {
    name: { type: Text },
  },
  access: {
    read: true,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
  },
};

module.exports = Contact;
