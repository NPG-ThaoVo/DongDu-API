const { Text, Password, CalendarDay, Select } = require("@keystonejs/fields");
const { CloudinaryImage } = require("@keystonejs/fields-cloudinary-image");
const access = require("../access.control");
const { imageSet } = require("./ImageCloud");
const orgImgAdapter = imageSet("OBDDImage");

const User = {
  fields: {
    username: { type: Text, isUnique: true },
    password: {
      type: Password,
    },
    fullname: { type: Text },
    avatar: { type: CloudinaryImage, adapter: orgImgAdapter },
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
};

module.exports = User;
