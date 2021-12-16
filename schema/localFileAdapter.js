const { LocalFileAdapter } = require("@keystonejs/file-adapters");

const mode = process.env.NODE_ENV == "development";
const pathToSave = mode ? "./public/resource" : "./dist/public/resource";

const initFileAdapter = (src = pathToSave, path = "/resource") => {
  const fileAdapter = new LocalFileAdapter({
    src,
    path,
  });

  const removeExistingFile = async ({ existingItem }) => {
    // this function is not working
    // console.log("existingItem", existingItem);
    if (existingItem && existingItem.image) {
      try {
        await fileAdapter.delete(existingItem.image);
      } catch (e) {
        console.warn("[Warning] Unable delete file: ", e);
      }
    }
  };

  return { fileAdapter, hooks: { removeExistingFile } };
};

module.exports = {
  initFileAdapter,
};
