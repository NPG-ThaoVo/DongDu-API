const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const { StaticApp } = require("@keystonejs/app-static");
const extendGrapQL = require("./extendGraphQL");

const { PROJECT_NAME, COOKIE_SECRET, DB_CONNECTION } = require("./config");

const UserSchema = require("./schema/User");
const ManagerSchema = require("./schema/Manager");
const ContactSchema = require("./schema/Contact");
const MajorSchema = require("./schema/Major");
const CommentSchema = require("./schema/Comment");
const BlogSchema = require("./schema/Blog");
const StatisticalSchema = require("./schema/Statistical");
const ImageChema = require("./schema/Image");
const { initialAction } = require("./inital-data");
const router = require("./routes");
// const access = require("./access.control");

const mode = process.env.NODE_ENV == "development";

const mongoUri = mode ? DB_CONNECTION : DB_CONNECTION;

const adapterConfig = {
  mongoUri: mongoUri,
};

const adapter = new Adapter(adapterConfig);

const keystone = new Keystone({
  adapter,
  // sessionStore: ,
  onConnect: process.env.INIT_DATA && initialAction,
  cookieSecret: COOKIE_SECRET,
  cookie: {
    secure: false,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
  queryLimits: {
    maxTotalResults: 1000, //limit of the total results of all relationship subqueries
  },
});

const listSchema = [
  { name: "User", schema: UserSchema },
  { name: "Manager", schema: ManagerSchema },
  { name: "Major", schema: MajorSchema },
  { name: "Contact", schema: ContactSchema },
  { name: "Comment", schema: CommentSchema },
  { name: "Blog", schema: BlogSchema },
  { name: "Statistical", schema: StatisticalSchema },
  { name: "Image", schema: ImageChema },
];

listSchema.map(({ name, schema }) => keystone.createList(name, schema));

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "Manager",
  config: {
    identityField: "username",
    secretField: "password",
  },
});

const authUserStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "User",
  config: {
    identityField: "username",
    secretField: "password",
  },
});

const adminUIForUser = new AdminUIApp({
  name: PROJECT_NAME,
  enableDefaultRoute: true,
  authStrategy: authUserStrategy,
});

const adminUIForManager = new AdminUIApp({
  name: PROJECT_NAME,
  enableDefaultRoute: true,
  authStrategy,
  isAccessAllowed: ({ authentication: { item, listkey } }) => {
    // console.log(item);
    return !!item && item.role === "admin";
  },
});

// I dont know why it works, if we don't change the order based on ENV, we wont be able to access the AdminUI
const adminUI = mode
  ? [adminUIForManager, adminUIForUser]
  : [adminUIForUser, adminUIForManager];

keystone.extendGraphQLSchema(extendGrapQL);

module.exports = {
  keystone,
  apps: [new GraphQLApp(), ...adminUI],
  configureExpress: (app) => {
    app.set('keystoneInstance', keystone);
    app.use("/", router);
  },
};
