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

        await connection.query(
            `
            INSERT INTO servicesAttended (idUser, idService, text, fileCompleted)
            VALUES (?, ?, ?, ?)
            `,
            [idUser, idService, text, fileCompletedName]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = uploadFileCompletedQuery;
