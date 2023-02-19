// when you invoke certian methods

"use strict";

const _ = require("lodash");
const Promise = this.Promise || require("promise");
const agent = require("superagent-promise")(require("superagent"), Promise);

const makeHttpRequest = async (path, method, options) => {
    let root = process.env.TEST_ROOT;
    let url = options.nodeId ? `${root}/${path}/${options.nodeId}` : `${root}/${path}`;
    let httpReq = agent(method, url);
    let body = _.get(options,"body");
    let idToken = _.get(options,"idToken");
    console.log(`invoking HTTP ${method} ${url}`);

    try{
        //Set Authorization Header
        httpReq.set("Authorization", idToken)
        console.log(body)
        if(body){
            httpReq.send(body);
        }

        let response = await httpReq;
        return {
            statusCode: response.statusCode,
            body: response.body
        }
    } catch(err) {
        console.log(err.message)
        return {
            statusCode: err.statusCode,
            body: null
        }
    }
}

exports.we_invoke_createNode = (options) => {
    let response = makeHttpRequest("notes", "POST", options);
    return response;
}

exports.we_invoke_updateNode = (options) => {
    let response = makeHttpRequest("notes", "PUT", options);
    return response;
}

exports.we_invoke_deleteNode = (options) => {
    let response = makeHttpRequest("notes", "DELETE", options);
    return response;
}