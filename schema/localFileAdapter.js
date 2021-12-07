const { LocalFileAdapter } = require("@keystonejs/file-adapters");

const initFileAdapter = (src = "./public/resource", path = "/resource") => {
  const fileAdapter = new LocalFileAdapter({
    src,
    path,
  });

  const removeExistingFile = async ({ existingItem }) => {
    // this function is not working
    // console.log("existingItem", existingItem);
    if (existingItem && existingItem.image) {
      await fileAdapter.delete(existingItem.image);
    }
  };

  return { fileAdapter, hooks: { removeExistingFile } };
};

module.exports = {
  initFileAdapter,
};
