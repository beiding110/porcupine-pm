module.exports = function (app) {
    app.use('/user', require('./user'));
    app.use('/project', require('./project'));
    app.use('/taskgroup', require('./task-group'));
    app.use('/task', require('./task'));

    return app;
};
