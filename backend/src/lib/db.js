const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

const getUserByEmail = async (email) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: { email }
  };
  const result = await dynamo.get(params).promise();
  return result.Item || null;
};

const putUser = async (user) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Item: user,
    ConditionExpression: 'attribute_not_exists(email)'
  };
  await dynamo.put(params).promise();
  return user;
};

module.exports = { getUserByEmail, putUser };
