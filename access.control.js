// Access control functions
const managerIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.role === "admin");

const managerIsStaff = ({ authentication: { item: user } }) =>
  Boolean(user && user.role === "staff");

const managerIsAdminOrStaff = (auth) => {
  const isAdmin = access.managerIsAdmin(auth);
  const isStaff = access.managerIsStaff(auth);
  return isAdmin || isStaff;
};

const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) return false;

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsOwnerOrAdminOrStaff = (auth) => {
  return userOwnsItem(auth) || managerIsAdminOrStaff(auth);
};

const access = {
  managerIsAdmin,
  managerIsStaff,
  managerIsAdminOrStaff,
  userOwnsItem,
  userIsOwnerOrAdminOrStaff,
};

module.exports = access;
