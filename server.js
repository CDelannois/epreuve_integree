const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const buttonRouter = require('./routes/buttonRoutes');
const callHistoryRouter = require('./routes/callHistoryRoutes');
const careRouter = require('./routes/careRoutes');
const collaboratorHistoryRouter = require('./routes/collaboratorHistoryRoutes');
const collaboratorRouter = require('./routes/collaboratorRoutes');
const functionRouter = require('./routes/functionRoutes');
const roomIntercomRouter = require('./routes/roomIntercomRoutes');
const serviceIntercomRouter = require('./routes/serviceIntercomRoutes');
const serviceRouter = require('./routes/serviceRoutes');


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB connection successful!');
});

app.use(cors());
app.use(bodyParser.json());
app.use('/button', buttonRouter);
app.use('/callHistory', callHistoryRouter);
app.use('/care', careRouter);
app.use('/collaboratorHistory', collaboratorHistoryRouter);
app.use('/collaborator', collaboratorRouter);
app.use('/function', functionRouter);
app.use('/roomIntercom', roomIntercomRouter);
app.use('/serviceIntercom', serviceIntercomRouter);
app.use('/service', serviceRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}!`);
});