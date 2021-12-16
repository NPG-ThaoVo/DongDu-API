const { Text, Url } = require("@keystonejs/fields");
const access = require("../access.control");

const Image = {
  fields: {
    filename: { type: Text, defaultValue: "Image does not have name" },
    originalFilename: { type: Text, defaultValue: "Image does not have name" },
    publicUrl: { type: Url },
    createDate: { type: Text, defaultValue: Date.now() },
  },
  labelField: "filename",
  access: {
    read: true,
    create: true,
    update: true,
    delete: access.managerIsAdminOrStaff,
  },
};

module.exports = Image;
