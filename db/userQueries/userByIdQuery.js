const getConnection = require('../getConnection');

const { generateError } = require('../../helpers');

const userByIdQuery = async (idUser) => {
    let connection;

    try {
        connection = await getConnection();

        const [users] = await connection.query(
            `SELECT id, name, email, biography, photo, password, createdAt FROM users WHERE id = ?`,
            [idUser]
        );

        // Si no hay usuarios con ese id lanzamos un error.
        if (users.length < 1) {
            throw generateError('User not found', 404);
        }

        // Hacemos destructuring de las propiedades del usuario.
        const { id, name, email, biography, photo, password, createdAt } =
            users[0];

        // Información básica que retornaremos a todo el mundo.
        const userInfo = {
            id,
            name,
            email,
            biography,
            photo,
            createdAt,
        };

        // Si somos el propio usuario agregamos más info.
        if (idUser === users[0].id) {
            userInfo.password = password;
        }

        // Retornamos el usuario que está en la posición 0 del array "users".
        return userInfo;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userByIdQuery;
