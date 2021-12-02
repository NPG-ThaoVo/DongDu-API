const { createItems } = require("@keystonejs/server-side-graphql-client");

const UserInitialData = [
  {
    data: {
      fullname: "Administrator",
      username: "Admin",
      password: "admin@123",
      role: "admin",
    },
  },
];

const initialAction = async (keystone) => {
  await createItems({ keystone, listKey: "Manager", items: UserInitialData });
};

module.exports = { UserInitialData, initialAction };
