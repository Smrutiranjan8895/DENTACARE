const AWS = require('aws-sdk');
const { buildResponse } = require('../lib/response');
const { v4: uuidv4 } = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();
const APPOINTMENTS_TABLE = process.env.APPOINTMENTS_TABLE;

const parseBody = (event) => {
  try {
    return JSON.parse(event.body || '{}');
  } catch (err) {
    return {};
  }
};

const getUserEmail = (event) => {
  return (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.email) || null;
};

// List appointments for logged-in user
module.exports.list = async (event) => {
  const email = getUserEmail(event);
  if (!email) {
    return buildResponse(401, { message: 'Unauthorized' });
  }

  try {
    const result = await dynamo.query({
      TableName: APPOINTMENTS_TABLE,
      KeyConditionExpression: 'userEmail = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();

    return buildResponse(200, { appointments: result.Items || [] });
  } catch (error) {
    console.error('List error:', error);
    return buildResponse(500, { message: 'Internal error' });
  }
};

// Create new appointment
module.exports.create = async (event) => {
  const email = getUserEmail(event);
  if (!email) {
    return buildResponse(401, { message: 'Unauthorized' });
  }

  const { name, date, service } = parseBody(event);
  if (!name || !date || !service) {
    return buildResponse(400, { message: 'name, date, and service are required' });
  }

  try {
    const appointment = {
      id: uuidv4(),
      userEmail: email,
      name,
      date,
      service,
      createdAt: new Date().toISOString()
    };

    await dynamo.put({
      TableName: APPOINTMENTS_TABLE,
      Item: appointment
    }).promise();

    return buildResponse(201, { appointment });
  } catch (error) {
    console.error('Create error:', error);
    return buildResponse(500, { message: 'Internal error' });
  }
};

// Delete appointment
module.exports.remove = async (event) => {
  const email = getUserEmail(event);
  if (!email) {
    return buildResponse(401, { message: 'Unauthorized' });
  }

  const appointmentId = event.pathParameters && event.pathParameters.id;
  if (!appointmentId) {
    return buildResponse(400, { message: 'Appointment ID required' });
  }

  try {
    await dynamo.delete({
      TableName: APPOINTMENTS_TABLE,
      Key: {
        userEmail: email,
        id: appointmentId
      }
    }).promise();

    return buildResponse(200, { message: 'Appointment deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return buildResponse(500, { message: 'Internal error' });
  }
};
