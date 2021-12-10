const {
  Text,
  Password,
  CalendarDay,
  Select,
  File,
} = require("@keystonejs/fields");
const access = require("../access.control");
const { initFileAdapter } = require("./localFileAdapter");

const { fileAdapter, hooks } = initFileAdapter();

const User = {
  fields: {
    username: { type: Text, isUnique: true },
    password: {
      type: Password,
    },
    fullname: { type: Text },
    avatar: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: hooks.removeExistingFile,
      },
    },
    gender: { type: Text },
    yearOfBirth: { type: Text },
    createdAt: {
      type: CalendarDay,
      dateFrom: "2001-01-16",
    },
    role: {
      type: Select,
      defaultValue: "staff",
      options: [
        { value: "admin", label: "Administrator" },
        { value: "staff", label: "Staff" },
      ],
    },
    note: { type: Text },
  },
  labelField: "fullname",
  // List-level access controls
  access: {
    read: access.managerIsAdmin,
    update: access.managerIsAdmin,
    create: access.managerIsAdmin,
    delete: access.managerIsAdmin,
    auth: true,
  },
  hooks: {
    afterDelete: hooks.removeExistingFile,
  },
};

module.exports = User;
