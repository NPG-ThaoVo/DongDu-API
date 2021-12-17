const { FIND_SOCIAL_USER } = require("./queries/query");
const { CREATE_SOCIAL_USER } = require("./queries/mutation");

module.exports = {
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
          }
          const item = data.allUsers[0];
          const token = await context.startAuthedSession({
            item,
            list: { key: "User" },
          });

          return { item, token };
        } catch (err) {
          throw err;
        }
      },
    },
  ],
};
