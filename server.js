require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');

const { PORT } = process.env;

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(fileUpload());

app.use(cors());

app.use(express.static('uploads'));
app.use(express.static('uploadsPhoto'));
app.use(express.static('uploadsCompleted'));

/**
 * #################
 * ## Middlewares ##
 * #################
 */

const authUser = require('./middlewares/authUser.js');

/**
 * ########################
 * ## Endpoints Usuarios ##
 * ########################
 */

const {
    registerUser,
    loginUser,
    getUser,
    manageProfile,
    getOwnUser,
} = require('./controllers/users');

// Registrar un usuario.
app.post('/users', registerUser);

// Iniciar sesión de un usuario.
app.post('/login', loginUser);

// Obtener información sobre un usuario registrado.
app.get('/users/:idUser', getUser);

// Gestionar el perfil de un usuario.
app.put('/users/:idUser', authUser, manageProfile);

// Obtener información sobre el usuario del token.
app.get('/users', authUser, getOwnUser);

/**
 * ########################
 * ## Endpoints Services ##
 * ########################
 */

const {
    listServices,
    createService,
    selectService,
    uploadFileCompleted,
    resolvedService,
    allComments,
} = require('./controllers/theServices');

// Obtener una lista de todos los servicios.
app.get('/services', listServices);

// Crear un nuevo servicio.
app.post('/services', authUser, createService);

// Seleccionar un servicio.
app.get('/services/:idService', selectService);

// Subir un fichero completado y añadir un comentario.
app.post('/services/:idService/filecompleted', authUser, uploadFileCompleted);

// Marcar el servicio finalizado como resuelto.
app.put('/services/:idService/resolved', authUser, resolvedService);

// Obtener comentarios de un servicio.
app.get('/services/:idService/comments', authUser, allComments);

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
