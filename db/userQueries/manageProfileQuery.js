const getConnection = require('../getConnection');
const { generateError } = require('../../helpers');

const manageProfileQuery = async (
    idUser,
    nameUser,
    emailUser,
    biographyUser,
    photoUser,
    passwordUser
) => {
    let connection;
    try {
        connection = await getConnection();

        // Se selecciona el usuario mediante id.
        const [users] = await connection.query(
            `SELECT * FROM users WHERE id = ?`,
            [idUser]
        );

        // Si no hay usuario se devuelve un error.
        if (users.length === 0)
            throw generateError('No se ha encontrado el usuario', 404);

        nameUser = nameUser || users[0].name;
        emailUser = emailUser || users[0].email;
        biographyUser = biographyUser || users[0].biography;
        photoUser = photoUser || users[0].photo;
        passwordUser = passwordUser || users[0].password;

        // Se actualizan los datos.
        await connection.query(
            `
            UPDATE users SET
            name = ?,
            email = ?,
            biography = ?,
            photo = ?,
            password = ?
            WHERE
            id=?
        `,
            [
                nameUser,
                emailUser,
                biographyUser,
                photoUser,
                passwordUser,
                idUser,
            ]
        );
        // Se devuelve al usuario.
        return users;
    } finally {
        if (connection) connection.release();
    }
};
module.exports = manageProfileQuery;
