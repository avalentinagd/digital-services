const getConnection = require('../getConnection');

const uploadFileCompletedQuery = async (
    idUser,
    idService,
    text = '',
    fileCompletedName = ''
) => {
    let connection;

    try {
        connection = await getConnection();

        const [newComment] = await connection.query(
            `
            INSERT INTO servicesAttended (idUser, idService, text, fileCompleted)
            VALUES (?, ?, ?, ?)
            `,
            [idUser, idService, text, fileCompletedName]
        );

        return newComment.insertId;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = uploadFileCompletedQuery;
