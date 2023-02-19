// General test file

"use strict";

let init = require("./steps/init");
let{an_autheticated_user} = require("./steps/given");
let { we_invoke_createNode, we_invoke_updateNode, we_invoke_deleteNode } = require("./steps/when")
let idToken;

describe(`Given an authenticated user`, () => {

    beforeAll( async() => {
        init();
        let user = await an_autheticated_user();
        idToken = user.AuthenticationResult.IdToken
        console.log(idToken)

    })

    describe(`When POST /nodes endpoint is invoked`, () => {
        it('Should create a new node', async () => {
            const body = {
                id: "1000",
                title: "My test Node",
                body: "Node body"
            };
            let result = await we_invoke_createNode({idToken, body});
            expect(result.statusCode).toEqual(201);
            expect(result.body).not.toBeNull();
        });
    });

    describe(`When PUT /nodes/:id endpoint is invoked`, () => {
        it('Should update node', async () => {
            const nodeId = 1000
            const body = {
                title: "My updated test Node",
                body: "Node body"
            };
            let result = await we_invoke_updateNode({idToken, body, nodeId});
            expect(result.statusCode).toEqual(200);
            expect(result.body).not.toBeNull();
        });
    });

    describe(`When DELETE /nodes/:id endpoint is invoked`, () => {
        it('Should delete node', async () => {
            const nodeId = 1000
            let result = await we_invoke_deleteNode({idToken, nodeId});
            expect(result.statusCode).toEqual(200);
            expect(result.body).not.toBeNull();
        });
    });

})
