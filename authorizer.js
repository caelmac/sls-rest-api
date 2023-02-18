
//policy that is generated after user sends request -> api gateway
//api gateway -> lamba authorizer -> sends back policy
//ie - admin policy, guest policy

//effect is the permission verb - resource is the endpoint/arn
const { CognitoJwtVerifier } = require("aws-jwt-verify");

const COGNTIO_USERPOOL_ID = process.env.COGNTIO_USERPOOL_ID
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNTIO_USERPOOL_ID,
    tokenUse: "id",
    clientId: COGNITO_WEB_CLIENT_ID,
})

const generatePolicy = (principalId, effect, resource) => {
    var authResponse = {};

    authResponse.principalId = principalId;

    if (effect && resource) {
     let policyDocument = {
        Version: '2012-10-17',
        Statement: [
            {
                Effect: effect,
                Resource: resource,
                Action: "execute-api:Invoke" // why this?
            }
        ] 
     }
     authResponse.policyDocument = policyDocument
    }

    authResponse.context = {
        foo: "bar"
    }
    console.log(JSON.stringify(authResponse))
    return authResponse;
}

module.exports.handler = async (event, context, callback) => {
    //lamba authorizer

    //by default, authorizer will use token
    var token = event.authorizationToken; //"allow or deny"

    //validate the token:
    try{
        const payload = await jwtVerifier.verify(token)
        console.log(JSON.stringify(payload));
        callback(null, generatePolicy("user", "Allow", event.methodArn))

    } catch(err){
        callback("error: invalid token");
    }
    // switch(token) {
    //     case "allow":
    //         callback(null, generatePolicy("user", "Allow", event.methodArn))
    //         break;
    //     case "deny":
    //         callback(null, generatePolicy("user", "Deny", event.methodArn))
    //         break;
    //     default:
    //         callback("Error: Invalid Token")

    // }
}