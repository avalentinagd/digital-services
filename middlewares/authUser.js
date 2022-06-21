const jwt = require('jsonwebtoken');

const { generateError } = require('../helpers');

const authUser = (req, res, next) => {
    try {
        // Se obtiene el token.
        const { authorization } = req.headers;

        // Si no hay token se lanza un error.
        if (!authorization) {
            throw generateError('Falta la cabecera de autorización', 401);
        }

        // Variable que contendrá la información del token (paylaod).
        let token;

        try {
            // Se obtiene la info del token.
            token = jwt.verify(authorization, process.env.SECRET);
        } catch {
            throw generateError('Token incorrecto', 401);
        }

        // Se agrega una nueva propiedad a la request.
        req.idUser = token.id;

        // Saltar al siguiente controlador.
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authUser;
