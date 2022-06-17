const getConnection = require('../getConnection');

const insertServiceQuery = async (
    idUser,
    title,
    description,
    fileName = ''
) => {
    let connection;
    console.log(fileName);
    try {
        connection = await getConnection();

        await connection.query(
            `
                INSERT INTO services (idUser, title, description, file)
                VALUES (?, ?, ?, ?)
            `,
            [idUser, title, description, fileName]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertServiceQuery;
