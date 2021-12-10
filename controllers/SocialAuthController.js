const { CLIENT_URL } = require('../config');
const { keystone } = require('../index');
const { FIND_SOCIAL_USER } = require('../queries/query');
const { CREATE_SOCIAL_USER } = require('../queries/mutation');
const context = keystone.createContext().sudo()


class SocialAuthController {
  async authenticate(req, res, next) {
    const authUser = req?.user;
    const { data, errors } = await context.executeGraphQL({
      query: FIND_SOCIAL_USER,
      variables: {
        socialId: req?.user?.id
      },
    });
    if (data?.allUsers?.length === 0) {
      const { data, errors } = await context.executeGraphQL({
        query: CREATE_SOCIAL_USER,
        variables: {
          socialId: authUser.id,
          fullname: authUser.provider === 'google' ? authUser.displayName : `${authUser.name.familyName} ${authUser.name.givenName}`,
          provider: authUser.provider,
          email: authUser.emails[0].value,
          socialInfo: JSON.stringify(authUser),
        },
      });
      console.log('new user', data);
    } else {
      console.log('old user', data?.allUsers[0]);
    }
    res.redirect(CLIENT_URL)
  }
}

module.exports = new SocialAuthController();
