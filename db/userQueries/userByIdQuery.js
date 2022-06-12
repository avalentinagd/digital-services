const getConnection = require('../getConnection');

const { generateError } = require('../../helpers');

const userByIdQuery = async (idUser) => {
    let connection;

    try {
        connection = await getConnection();

        const [users] = await connection.query(
            `SELECT id, name, email, biography, photo, password createdAt FROM users WHERE id = ?`,
            [idUser]
        );

        // Si no hay usuarios con ese id lanzamos un error.
        if (users.length < 1) {
            throw generateError('Usuario no encontrado', 404);
        }

        // Retornamos el usuario que está en la posición 0 del array "users".
        return users[0];
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userByIdQuery;
