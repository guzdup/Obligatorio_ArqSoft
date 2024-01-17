const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const registerRoute = require('./routes/register.route.js');
const loginRoute = require('./routes/login.route.js');
const logoutRouter = require('./routes/logout.route.js');
const profileRouter = require('./routes/profile.route.js');
const verifyRouter = require('./routes/verify.route.js');
const userModification = require('./routes/update.route.js');
const registerEmployee = require('./routes/registerEmployee.route.js');
const readEmployees = require('./routes/readEmployees.route.js');
const deleteEmployee = require('./routes/deleteEmployee.route.js');
const { register, multerMiddleware } = require('./controller/register.controller.js');

app.use(express.json());
app.use(cookieParser());
app.use(multerMiddleware);

app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", logoutRouter);
app.use("/api", profileRouter);
app.use("/api", verifyRouter );
app.use("/api", userModification);
app.use("/api", registerEmployee);
app.use("/api", readEmployees);
app.use("/api", deleteEmployee);
module.exports = app;