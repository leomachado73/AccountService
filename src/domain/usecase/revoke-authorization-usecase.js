const db = require("../../database");
const { findAuthorizationByUsername } = require("../authorizations/services");
const { findAccountByUsername } = require("../accounts/services");
const { softRemoveAuthorization } = require("../authorizations/services");
const { AccountNotFound, AuthorizationNotFound } = require("../../errors");

module.exports = class RevokeAuthorizationUseCase {
  constructor(validators) {
    ({ usernameValidator: this.usernameValidator } = validators);
  }

  async revoke(username) {
    this.usernameValidator.validate(username);

    const account = await findAccountByUsername(db, username);

    if (!account) {
      throw new AccountNotFound(username);
    }

    const authorization = await findAuthorizationByUsername(db, username);

    if (!authorization) {
      throw new AuthorizationNotFound(username);
    }

    const response = await softRemoveAuthorization(db, username);

    return response;
  }
};
