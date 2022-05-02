module.exports = function (app) {
    app.use('/user', require('./user'));
    app.use('/project', require('./project'));
    app.use('/projectmember', require('./project-member'));
    app.use('/taskgroup', require('./task-group'));
    app.use('/task', require('./task'));

    return app;
};
