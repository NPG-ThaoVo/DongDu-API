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
    username: { type: Text, isUnique: true, access: { read: access.userIsOwnerOrAdminOrStaff } },
    password: {
      type: Password,
      access: { read: access.userIsOwnerOrAdminOrStaff }
    },
    fullname: { type: Text, access: { read: true } },
    email: { type: Text, access: { read: true } },
    avatar: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: hooks.removeExistingFile,
      },
      access: { read: true }
    },
    gender: { type: Text, access: { read: true } },
    yearOfBirth: { type: Text, access: { read: true } },
    course: { type: Text, access: { read: true } },
    majorDetail: { type: Text, access: { read: true } },
    note: { type: Text, access: { read: true } },
    major: {
      type: Relationship,
      ref: "Major.user",
      many: false,
      access: { read: true }
    },
    createdAt: {
      type: CalendarDay,
      dateFrom: "2001-01-16",
      access: {
        read: access.userIsOwnerOrAdminOrStaff,
        update: false,
        delete: false,
      },
    },
    OBOG: {
      type: Checkbox,
      label: "OBOG",
      defaultValue: false,
      access: {
        read: true,
        update: managerIsAdminOrStaff,
        delete: false,
      },
    },
    socialId: { type: Text, access: { read: access.userIsOwnerOrAdminOrStaff }},
    provider: {
      type: Select,
      defaultValue: "local",
      options: [
        { value: "local", label: "Signup with account" },
        { value: "facebook", label: "Signup with Facebook" },
        { value: "google", label: "Signup with Google" },
      ],
      access: { read: access.userIsOwnerOrAdminOrStaff }
    },
    socialInfo: { type: Text, access: { read: access.userIsOwnerOrAdminOrStaff } },
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
