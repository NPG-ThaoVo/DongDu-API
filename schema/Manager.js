const {
  Text,
  Password,
  CalendarDay,
  Select,
  Relationship,
} = require("@keystonejs/fields");
const access = require("../access.control");
const User = {
  fields: {
    username: { type: Text, isUnique: true },
    password: {
      type: Password,
    },
    fullname: { type: Text },
    avatar: { type: Relationship, ref: "Image" },
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
    read: access.managerIsAdminOrStaff,
    update: access.managerIsAdminOrStaff,
    create: access.managerIsAdminOrStaff,
    delete: access.managerIsAdmin,
    auth: true,
  },
};

module.exports = User;
