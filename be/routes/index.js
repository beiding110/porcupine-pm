module.exports = function (app) {
    app.use('/user', require('./user'));
    app.use('/project', require('./project'));
    app.use('/taskgroup', require('./task-group'));

    return app;
};
