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

const userOwnsItem = ({ existingItem, authentication: { item: user } }) => {
  if (!user) return false;

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  // return { id: user.id };
  return existingItem.id == user.id;
};

const userIsOwnerOrAdminOrStaff = (auth) => {
  return managerIsAdminOrStaff(auth) || userOwnsItem(auth);
};

const userAuthed = ({ authentication: { item: user } }) => {
  console.log(user ? user.username : "undefined");
  return Boolean(user);
};

const userIsPublic = () => {
  return { OBOG: true };
};

const userIsOwnerOrPublic = (auth) => {
  return userOwnsItem(auth) || { OBOG: true };
};

const access = {
  managerIsAdmin,
  managerIsStaff,
  managerIsAdminOrStaff,
  userOwnsItem,
  userIsOwnerOrAdminOrStaff,
  userAuthed,
  userIsPublic,
  userIsOwnerOrPublic,
};

module.exports = access;
