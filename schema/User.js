const {
  Text,
  Password,
  CalendarDay,
  Relationship,
  Checkbox,
  Select,
  File,
} = require("@keystonejs/fields");
const { managerIsAdminOrStaff } = require("../access.control");
const access = require("../access.control");
const { initFileAdapter } = require("./localFileAdapter");

const { fileAdapter, hooks } = initFileAdapter();

const User = {
  fields: {
    username: { type: Text, isUnique: true, isRequired: true },
    password: {
      type: Password,
    },
    fullname: { type: Text },
    email: { type: Text },
    avatar: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: hooks.removeExistingFile,
      },
    },
    gender: { type: Text },
    yearOfBirth: { type: Text },
    course: { type: Text },
    majorDetail: { type: Text },
    academicYear : { type: Text },
    note: { type: Text },
    major: {
      type: Relationship,
      ref: "Major.user",
      many: false,
    },
    createdAt: {
      type: CalendarDay,
      dateFrom: "2001-01-16",
      access: {
        update: false,
        delete: false,
      },
    },
    OBOG: {
      type: Checkbox,
      label: "OBOG",
      defaultValue: false,
      access: {
        // read: true,
        update: managerIsAdminOrStaff,
        delete: false,
      },
    },
    provider: {
      type: Select,
      defaultValue: "local",
      options: [
        { value: "local", label: "Signup with account" },
        { value: "facebook", label: "Signup with Facebook" },
        { value: "google", label: "Signup with Google" },
      ],
    },
    socialInfo: { type: Text },
  },
  labelField: "fullname",
  // List-level access controls
  access: {
    read: true,
    update: access.userIsOwnerOrAdminOrStaff,
    create: true,
    delete: access.managerIsAdminOrStaff,
    auth: true,
  },
  hooks: {
    afterDelete: hooks.removeExistingFile,
  },
};

module.exports = User;
