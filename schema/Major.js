const { Text, Relationship } = require("@keystonejs/fields");
const access = require("../access.control");

const Major = {
  fields: {
    // id: { type: AutoIncrement },
    name: { type: Text },
    user: {
      type: Relationship,
      ref: "User.major",
      many: true,
      access: {
        create: false,
        update: false,
        delete: false,
      },
    },
  },
  access: {
    read: true,
    update: access.managerIsAdmin,
    create: access.managerIsAdmin,
    delete: access.managerIsAdmin,
  },
};

module.exports = Major;
