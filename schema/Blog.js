const {
  Text,
  Checkbox,
  CalendarDay,
  Relationship,
} = require("@keystonejs/fields");
const access = require("../access.control");

const Blog = {
  fields: {
    title: { type: Text },
    content: { type: Text },
    shortDescription: { type: Text },
    image: { type: Relationship, ref: "Image" },
    author: { type: Text },
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
  // hooks: {
  //   resolveInput: ({ resolvedData, context, operation, ...others }) => {
  //     if (operation === "create") resolvedData.author = context.authedItem.id;
  //     return resolvedData;
  //   },
  // },
};

module.exports = Blog;
