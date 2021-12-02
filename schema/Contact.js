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
    read: access.managerIsAdminOrStaff,
    update: access.managerIsAdmin,
    create: true,
    delete: access.managerIsAdmin,
  },
};

module.exports = Contact;
