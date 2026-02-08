const AWS = require('aws-sdk');
const { buildResponse } = require('../lib/response');
const { v4: uuidv4 } = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();
const CONTACTS_TABLE = process.env.CONTACTS_TABLE;

const parseBody = (event) => {
  try {
    return JSON.parse(event.body || '{}');
  } catch (err) {
    return {};
  }
};

// Submit contact form
module.exports.submit = async (event) => {
  const { name, email, message } = parseBody(event);
  
  if (!name || !email || !message) {
    return buildResponse(400, { message: 'name, email, and message are required' });
  }

  try {
    const contact = {
      id: uuidv4(),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    await dynamo.put({
      TableName: CONTACTS_TABLE,
      Item: contact
    }).promise();

    return buildResponse(201, { message: 'Message received! We will respond within 2 hours.' });
  } catch (error) {
    console.error('Contact submit error:', error);
    return buildResponse(500, { message: 'Internal error' });
  }
};
