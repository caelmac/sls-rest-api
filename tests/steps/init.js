// This file is where we load all of the environment variables for the tests such as cognito user pool

'use strict';

const init = async () => {
    require('dotenv').config();
}

module.exports = init;