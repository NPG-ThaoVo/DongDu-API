const { Text, Integer, File } = require("@keystonejs/fields");
const access = require("../access.control");
const { initFileAdapter } = require("./localFileAdapter");

const { fileAdapter, hooks } = initFileAdapter();

const Statistical = {
  fields: {
    title: { type: Text },
    lesson: { type: Integer },
    icon: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: hooks.removeExistingFile,
      },
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
  hooks: {
    afterDelete: hooks.removeExistingFile,
  },
};

module.exports = Statistical;
