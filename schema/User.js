const {
  Text,
  Password,
  CalendarDay,
  Relationship,
  Checkbox,
  Select,
} = require("@keystonejs/fields");
const { CloudinaryImage } = require("@keystonejs/fields-cloudinary-image");
const { managerIsAdminOrStaff } = require("../access.control");
const access = require("../access.control");
const { imageSet } = require("./ImageCloud");
const orgImgAdapter = imageSet("OBDDImage");

const User = {
  fields: {
    username: { type: Text, isUnique: true, isRequired: true },
    password: {
      type: Password,
      isRequired: true,
    },
    fullname: { type: Text },
    email: { type: Text, isRequired: true },
    avatar: { type: CloudinaryImage, adapter: orgImgAdapter },
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
        update: false,
        delete: false,
      },
    },
    OBDD: {
      type: Checkbox,
      label: "OBDD",
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
