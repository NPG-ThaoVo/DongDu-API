const PROJECT_NAME = "DongDuCMS";
const COOKIE_SECRET =
  "f7745f4df4394027716de160fb2acd6aac36699576a8be586b75ac09acf6a0df"; //P@ssw0rd1
const HOST = "localhost";
const HOST_DB = "database";
const PORT_DB = "27017";
const ROOT_USERNAME = "root";
const ROOT_PASSWORD = "Password1";

const DB_CONNECTION = `mongodb+srv://${ROOT_USERNAME}:${ROOT_PASSWORD}@cluster0.vsfsl.gcp.mongodb.net/dongdudatabase?retryWrites=true&w=majority`;
// uri cloud           mongodb+srv://root:Password1@cluster0.vsfsl.gcp.mongodb.net/dongdudatabase?retryWrites=true&w=majority

module.exports = {
  PROJECT_NAME,
  COOKIE_SECRET,
  DB_CONNECTION,
};
