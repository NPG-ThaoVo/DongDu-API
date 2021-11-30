const { Text, Relationship, CalendarDay } = require("@keystonejs/fields");
const access = require("../access.control");
const { reply } = require("../emails");

const Contact = {
    fields: {
        content: { type: Text },
        user: { type: Relationship, ref: "User", many: false },
        blog: { type: Relationship, ref: "Blog", many: false },
        createdAt: {
            type: CalendarDay,
            dateFrom: "2001-01-16"
        },
    },
    access: {
        read: true,
        update: access.userIsAdminOrOwner,
        create: access.userIsAdminOrOwner,
        delete: access.userIsAdminOrOwner,
    },
};

module.exports = Contact;
