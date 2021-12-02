const { Text, Relationship, CalendarDay } = require("@keystonejs/fields");
const access = require("../access.control");

const Comment = {
  fields: {
    content: { type: Text },
    user: { type: Relationship, ref: "User", many: false },
    blog: { type: Relationship, ref: "Blog.comment", many: false },
    createdAt: {
      type: CalendarDay,
      dateFrom: "2001-01-16",
    },
  },
  access: {
    read: true,
    update: access.userIsOwnerOrAdminOrStaff,
    create: access.userIsOwnerOrAdminOrStaff,
    delete: access.managerIsAdminOrStaff,
  },
};

module.exports = Comment;
