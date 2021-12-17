const {
  Text,
  Password,
  CalendarDay,
  Relationship,
  Checkbox,
  Select,
} = require("@keystonejs/fields");
const access = require("../access.control");

const User = {
  fields: {
    username: {
      type: Text,
      isUnique: true,
      access: { read: access.userIsOwnerOrAdminOrStaff },
    },
    password: {
      type: Password,
      access: { read: access.userIsOwnerOrAdminOrStaff },
    },
    fullname: { type: Text },
    email: { type: Text, isUnique: true, sparse: true },
    avatar: {
      type: Relationship,
      ref: "Image",
    },
    gender: { type: Text },
    yearOfBirth: { type: Text },
    course: { type: Text },
    majorDetail: { type: Text },
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
        update: access.managerIsAdminOrStaff,
        delete: false,
      },
    },
    socialId: {
      type: Text,
      access: { read: access.userIsOwnerOrAdminOrStaff },
    },
    provider: {
      type: Select,
      defaultValue: "local",
      options: [
        { value: "local", label: "Signup with account" },
        { value: "facebook", label: "Signup with Facebook" },
        { value: "google", label: "Signup with Google" },
      ],
      access: { read: access.userIsOwnerOrAdminOrStaff },
    },
    socialInfo: {
      type: Text,
      access: { read: access.userIsOwnerOrAdminOrStaff },
    },
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
};

module.exports = User;
