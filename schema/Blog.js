const {
  Text,
  Checkbox,
  CalendarDay,
  Relationship,
  File,
} = require("@keystonejs/fields");
const access = require("../access.control");
const { initFileAdapter } = require("./localFileAdapter");

const { fileAdapter, hooks } = initFileAdapter();

const Blog = {
  fields: {
    title: { type: Text },
    content: { type: Text },
    shortDescription: { type: Text },
    image: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: hooks.removeExistingFile,
      },
    },
    author: { type: Relationship, ref: "Manager", many: false },
    status: { type: Checkbox },
    major: { type: Relationship, ref: "Major", many: false },
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
  hooks: {
    afterDelete: hooks.removeExistingFile,
  },
};

module.exports = Blog;
