const AccountMapper = require("../models/AccountDTO");
const { uuid } = require("uuidv4");
const generateuuidv4 = uuid;

const { Result, status } = require("../../helper/Result");

module.exports = (database, account) => {
  const query =
    'INSERT INTO "Accounts" ("id", "uuid", "user", "pwd", "createdAt", "updatedAt", "deletedAt") ' +
    'VALUES (DEFAULT, $1, $2, $3, NOW(), NOW(), NULL) RETURNING "id", "uuid", "user" AS "username", "createdAt", "updatedAt"';

  return new Promise((resolve, reject) => {
    database
      .query(query, [generateuuidv4(), account.username, account.password])
      .then(result => {
        resolve(
          new Result({
            status: status.SUCCESS,
            message: "Conta criada com sucesso",
            data: AccountMapper.toEntity(result.rows[0])
          })
        );
      })
      .catch(e => {
        reject(
          new Result({
            status: status.FAILED,
            message: "Falha ao criar conta",
            data: e
          })
        );
      });
  });
};
