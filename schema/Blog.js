const {
  Text,
  Checkbox,
  CalendarDay,
  Relationship,
} = require("@keystonejs/fields");
const { CloudinaryImage } = require("@keystonejs/fields-cloudinary-image");
const access = require("../access.control");
const { imageSet } = require("./ImageCloud");
const orgImgAdapter = imageSet("OBDDImage");

const Blog = {
  fields: {
    title: { type: Text },
    content: { type: Text },
    shortDescription: { type: Text },
    image: { type: CloudinaryImage, adapter: orgImgAdapter },
    author: { type: Relationship, ref: "Manager", many: false },
    status: { type: Checkbox },
    major: { type: Relationship, ref: "Major", many: true },
    majorDetails: { type: Text },
    comment: { type: Relationship, ref: "Comment.blog", many: true },
    publishedAt: {
      type: CalendarDay,
      dateFrom: "2001-01-16",
    },
  },
  // List-level access controls
  access: {
    read: true,
    update: access.managerIsAdminOrStaff,
    create: access.managerIsAdminOrStaff,
    delete: access.managerIsAdmin,
    // auth: true,
  },
};

module.exports = Blog;
