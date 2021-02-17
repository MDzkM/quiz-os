var express = require('express');
const { GatewayTimeout } = require('http-errors');
var router = express.Router();

const messagesData = []

const updateMessages = (userID, message, time) => {
    messagesData.push({
        user: userID,
        userColor: '#BBBBBB',
        message: message,
        time: time
    })
}

exports.updateMessages = updateMessages

router.get('/', function(req, res, next) {
    res.json(messagesData);
});

exports.router = router;