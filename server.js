require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const token = require('./middlewares/authUser.js');

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

const {
    listServices,
    createService,
    newServiceRequest,
    uploadFileCompleted,
    resolvedService,
} = require('./controllers/theServices');

// Listar todos los services.
app.get('/services', listServices);

// Crear un servicio
app.post('/services', token, createService);

// Escoger un servicio
app.get('/services/:idService', newServiceRequest);

// Subir un fichero completado y añadir un comentario
app.post('/services/:idService/filecompleted', token, uploadFileCompleted);

// Marcar el servicio finalizado como resuelto
app.put('/services/:idService/resolved', token, resolvedService);

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
