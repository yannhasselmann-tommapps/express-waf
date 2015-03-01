describe("lfi", function(){
    var server, testdb, request, waf;

    it("should load properly", function(done){
        request = require('request');
        var express = require('express');

        var TestDB = require('./../database/emulated-db');
        testdb = new TestDB();

        var app = express();

        var ExpressWaf = require('./../express-waf').ExpressWAF;
        var BLOCK_TIME = 1000;
        waf = new ExpressWaf({
            db: testdb,
            blockTime: BLOCK_TIME
        });

        waf.addModule('lfi-module', {appInstance: app, publicPath: "./public"}, function(error) {
            console.log(error);
        });

        app.use(waf.check);
        app.use(express.static("./public"));

        app.get('/', function(req, res) {
            res.status(200).end();
        });

        app.get('/route', function(req, res) {
            res.status(200).end();
        });

        app.delete('/', function(req, res) {
            res.status(200).end();
        });

        app.post('/', function(req, res) {
            res.status(200).end();
        });

        app.put('/', function(req, res) {
            res.status(200).end();
        });

        server = app.listen(8080, function(){
            done();
        });
    });

    it("testGetParentDirParam", function(done){
        request.get('http://localhost:8080/spec?file="../../passwd"', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testGetParentDir", function(done){
        request.get('http://localhost:8080/../logger.js', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testGetParentDir", function(done){
        request.get('http://localhost:8080/subdir/../spec.html', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testGetValidFile", function(done){
        request.get('http://localhost:8080/test.html', function(err, res) {
            expect(res.statusCode).toEqual(200);
            done();
        });
    });

    it("testGetValidFile2", function(done){
        request.get('http://localhost:8080/subdir/test.html', function(err, res) {
            expect(res.statusCode).toEqual(200);
            done();
        });
    });

    it("testGetUnknownFile", function(done){
        request.get('http://localhost:8080/unknown.html', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testGetUnknownFile2", function(done){
        request.get('http://localhost:8080/subdir/unknown.html', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testGetUnknownRoute", function(done){
        request.get('http://localhost:8080/unknown', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testGetUnknownRoute", function(done){
        request.get('http://localhost:8080/unknown', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testGetValidRoute", function(done){
        request.get('http://localhost:8080/route', function(err, res) {
            expect(res.statusCode).toEqual(200);
            done();
        });
    });

    it("testPostValidRoute", function(done){
        request.post('http://localhost:8080/route', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testPostRoute", function(done){
        request.post('http://localhost:8080/unknown', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testPutValidRoute", function(done){
        request.put('http://localhost:8080/route', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testPutRoute", function(done){
        request.put('http://localhost:8080/unknown', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testDelParentDirParam", function(done){
        request.del('http://localhost:8080/spec?file="../../passwd"', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testDelParentDir", function(done){
        request.del('http://localhost:8080/../logger.js', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("testDelParentDir2", function(done){
        request.del('http://localhost:8080/subdir/../spec.html', function(err, res) {
            expect(res.statusCode).toEqual(403);
            testdb.remove("127.0.0.1", function(){
                done();
            });
        });
    });

    it("should close properly", function(done){
        waf.removeAll(function(){
            server.close(function(){
                done();
            });
        });
    });
});