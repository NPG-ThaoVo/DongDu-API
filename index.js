const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");

const { PROJECT_NAME, COOKIE_SECRET, DB_CONNECTION } = require("./config");

const UserSchema = require("./schema/User");
const ManagerSchema = require("./schema/Manager");
const ContactSchema = require("./schema/Contact");
const MajorSchema = require("./schema/Major");
const CommentSchema = require("./schema/Comment");
const BlogSchema = require("./schema/Blog");
const { initialAction } = require("./inital-data");
const access = require("./access.control");

const mongoUri =
  process.env.NODE_ENV == "development" ? DB_CONNECTION : DB_CONNECTION;

const adapterConfig = {
  mongoUri: mongoUri,
};

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
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

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      authStrategy,
      isAccessAllowed: ({ authentication: { item, listkey } }) => {
        // console.log(item);
        return !!item && item.role === "admin";
      },
    }),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy: authUserStrategy,
    }),
  ],
};
