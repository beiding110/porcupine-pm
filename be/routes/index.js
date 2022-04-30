module.exports = function (app) {
    app.use('/user', require('./user'));
    app.use('/project', require('./project'));

    return app;
};
