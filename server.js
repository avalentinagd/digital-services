require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const { PORT } = process.env;

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(fileUpload());

/**
 * #################
 * ## Middlewares ##
 * #################
 */

/**
 * ########################
 * ## Endpoints Usuarios ##
 * ########################
 */

const { registerUser, loginUser, getUser } = require('./controllers/users');
//Registro de usuario.
app.post('/users', registerUser);

// Login de usuario.
app.post('/login', loginUser);

// Información sobre un usuario.
app.get('/users/:idUser', getUser);

/**
 * ########################
 * ## Endpoints Services ##
 * ########################
 */

const { listServices } = require('./controllers/theServices');

// Listar todos los services.
app.get('/services', listServices);

/**
 * ######################
 * ## Middleware Error ##
 * ######################
 */

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).send({
        status: 'error',
        message: err.message,
    });
});

/**
 * ##########################
 * ## Middleware Not Found ##
 * ##########################
 */

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found!',
    });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
