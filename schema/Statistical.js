const { Text, Integer, Relationship } = require("@keystonejs/fields");
const access = require("../access.control");

const Statistical = {
  fields: {
    title: { type: Text },
    lesson: { type: Integer },
    icon: {
      type: Relationship,
      ref: "Image",
    },
    order: {
      type: Integer,
    },
  },
  access: {
    read: true,
    update: access.managerIsAdminOrStaff,
    create: access.managerIsAdminOrStaff,
    delete: access.managerIsAdmin,
  },
};

module.exports = Statistical;
