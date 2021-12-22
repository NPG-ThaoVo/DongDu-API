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
    username: { type: Text, isUnique: true, access: { read: access.managerIsAdminOrStaff } },
    password: {
      type: Password,
      access: { read: access.managerIsAdminOrStaff } 
    },
    fullname: { type: Text },
    avatar: { type: Relationship, ref: "Image", access: { read: access.managerIsAdminOrStaff } },
    gender: { type: Text, access: { read: access.managerIsAdminOrStaff } },
    yearOfBirth: { type: Text, access: { read: access.managerIsAdminOrStaff } },
    createdAt: {
      type: CalendarDay,
      dateFrom: "2001-01-16",
      access: { read: access.managerIsAdminOrStaff }
    },
    role: {
      type: Select,
      defaultValue: "staff",
      options: [
        { value: "admin", label: "Administrator" },
        { value: "staff", label: "Staff" },
      ],
      access: { read: access.managerIsAdminOrStaff }
    },
    note: { type: Text, access: { read: access.managerIsAdminOrStaff } },
  },
  labelField: "fullname",
  // List-level access controls
  access: {
    read: true,
    update: access.managerIsAdminOrStaff,
    create: access.managerIsAdminOrStaff,
    delete: access.managerIsAdmin,
    auth: true,
  },
};

module.exports = User;
