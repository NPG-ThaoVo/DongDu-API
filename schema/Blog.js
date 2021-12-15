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
    author: { type: Relationship, ref: "Manager" },
    status: { type: Checkbox },
    major: { type: Relationship, ref: "Major" },
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
    resolveInput: ({ resolvedData, context, operation, ...others }) => {
      if (operation === "create") resolvedData.author = context.authedItem.id;
      return resolvedData;
    },
    afterDelete: hooks.removeExistingFile,
  },
};

module.exports = Blog;
