import express = require("express");

export default function (router: express.Router) {
    router.get('/', function (req, res) {
        res.render("index",{});
    });
    
    router.get('/index', function (req, res) {
        res.render("index",{});
    });
};