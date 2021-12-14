const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const { StaticApp } = require("@keystonejs/app-static");
// const express = require("express");

const { PROJECT_NAME, COOKIE_SECRET, DB_CONNECTION } = require("./config");

const { FIND_SOCIAL_USER } = require("./queries/query");
const { CREATE_SOCIAL_USER } = require("./queries/mutation")

const UserSchema = require("./schema/User");
const ManagerSchema = require("./schema/Manager");
const ContactSchema = require("./schema/Contact");
const MajorSchema = require("./schema/Major");
const CommentSchema = require("./schema/Comment");
const BlogSchema = require("./schema/Blog");
const StatisticalSchema = require("./schema/Statistical");
const { initialAction } = require("./inital-data");
// const access = require("./access.control");

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
  { name: "Statistical", schema: StatisticalSchema },
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

keystone.extendGraphQLSchema({
  mutations: [
    {
      schema:
        "authenticateUserWithSocialId(id: String!, user: UserCreateInput): authenticateUserOutput",
      resolver: async (parent, { id, user }, context, info, extra) => {
        try {
          const { data, error, ...others } = await context.executeGraphQL({
            query: FIND_SOCIAL_USER,
            variables: {
              socialId: id,
            },
            context: context.createContext({ skipAccessControl: true }),
          });
          if (error) {
            throw error;
          }
          if (!data?.allUsers[0]) {
            const { data, error, ...others } = await context.executeGraphQL({
              query: CREATE_SOCIAL_USER,
              variables: {
                socialId: id,
                fullname: user.fullname,
                provider: user.provider,
                email: user.email,
                socialInfo: user.socialInfo,
              },
              context: context.createContext({ skipAccessControl: true }),
            });
            if (error) {
              throw error;
            }
            // console.log(data.createUser);
            const item = data.createUser;
            const token = await context.startAuthedSession({
              item,
              list: { key: "User" },
            });
            return { item, token };
          };
          const item = data.allUsers[0];
          const token = await context.startAuthedSession({
            item,
            list: { key: "User" },
          });

          return { item, token };
        } catch (err) { throw err }
      },
    },
  ],
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
    // new AdminUIApp({
    //   enableDefaultRoute: true,
    //   authStrategy: authSocialUserStrategy,
    // }),
    new StaticApp({
      path: "/",
      src: "public",
      // fallback: 'index.html',
    }),
  ],
  // configureExpress: (app) => {
  //   app.use(express.static("public"));
  // },
};
