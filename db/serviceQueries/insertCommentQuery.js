const getConnection = require('../getConnection');

const insertCommentQuery = async (idUser, idService, text = '') => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(
            `
                INSERT INTO comments (idUser, idService, text)
                VALUES (?, ?, ?)
            `,
            [idUser, idService, text]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertCommentQuery;
