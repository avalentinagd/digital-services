const bcrypt = require('bcrypt');
const getConnection = require('../getConnection');

const { generateError } = require('../../helpers');

const registerUserQuery = async (
    name,
    email,
    biography,
    photoName,
    password
) => {
    let connection;

    try {
        connection = await getConnection();

        // Se obtiene un array de usuarios que cumplan la condición establecida.
        const [users] = await connection.query(
            `SELECT id FROM users WHERE email = ?`,
            [email]
        );

        // Si el array de usuarios tiene algún usuario quiere decir que el email
        // ya está vinculado a otro usuario, en ese caso se lanza un error.
        if (users.length > 0) {
            throw generateError(
                'Ya existe un usuario con ese email en la base de datos',
                409
            );
        }

        // Se encripta la contraseña.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Se crea el usuario.
        const [newUser] = await connection.query(
            `INSERT INTO users (name, email, biography, photo, password) VALUES(?, ?, ?, ?, ?)`,
            [name, email, biography, photoName, hashedPassword]
        );

        // Se retorna el id del elemento creado.
        return newUser.insertId;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = registerUserQuery;
