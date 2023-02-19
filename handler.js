'use strict';

const dynamoDB = require("aws-sdk/clients/dynamodb")
const documentClient = new dynamoDB.DocumentClient({ region: "us-east-1" });
const NODES_TABLE_NAME = process.env.NODES_TABLE_NAME


const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};

module.exports.createNode = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let data = JSON.parse(event.body);
  try{
    const params = {
      TableName: NODES_TABLE_NAME,
      Item: {
        nodeId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: "attribute_not_exists(nodeId)"
    }
    await documentClient.put(params).promise();
    callback(null, send(201, data))

  } catch(err){
    callback(null, send(500, err.message)) 
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

exports.updateNode = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let nodeId = event.pathParameters.id
  let data = JSON.parse(event.body);
  try{
    const params = {
      TableName: NODES_TABLE_NAME,
      Key: { nodeId },
      UpdateExpression: "set #title = :title, #body = :body",
      ExpressionAttributeNames: {// we define the attributes here instead of the updateExpression because UpdateExpression might have saved words
        "#title": "title",
        "#body": "body"
      },
      ExpressionAttributeValues: {
        ":title": data.title,
        ":body": data.body
      },
      ConditionExpression: 'attribute_exists(nodeId)' //only update is item is available in the db
    }
    await documentClient.update(params).promise()
    callback(null, send(200, data));
  } catch (err) {
    callback(null, send(500, err.message));
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };dfgdf
};

module.exports.deleteNode = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let nodeId = event.pathParameters.id;
  try {
    const params = {
      TableName: NODES_TABLE_NAME,
      Key: { nodeId },
      ConditionExpression: "attribute_exists(nodeId)",
    };
    await documentClient.delete(params).promise();
    cb(null, send(200, nodeId));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};


module.exports.getAllNodes = async (event, context, cb) => {
  console.log(JSON.stringify(event)); //Event gets logged in cloudWatch
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = {
      TableName: NODES_TABLE_NAME,
    };
    const nodes = await documentClient.scan(params).promise();

    cb(null, send(200, nodes));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};
