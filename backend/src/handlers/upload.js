const AWS = require('aws-sdk');
const { buildResponse } = require('../lib/response');

const s3 = new AWS.S3();

const parseBody = (event) => {
  try {
    return JSON.parse(event.body || '{}');
  } catch (err) {
    return {};
  }
};

module.exports.handleUpload = async (event) => {
  const auth = (event.requestContext && event.requestContext.authorizer) || {};
  const email = auth.email || auth.principalId;
  if (!email) {
    return buildResponse(401, { message: 'Unauthorized' });
  }

  const { filename, contentType } = parseBody(event);
  if (!filename || !contentType) {
    return buildResponse(400, { message: 'filename and contentType are required' });
  }

  try {
    const key = `${email}/${Date.now()}-${filename}`;
    const uploadUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.UPLOAD_BUCKET,
      Key: key,
      ContentType: contentType,
      Expires: 300
    });

    return buildResponse(200, { uploadUrl, objectKey: key });
  } catch (err) {
    console.error('Upload error', err);
    return buildResponse(500, { message: 'Internal error' });
  }
};
