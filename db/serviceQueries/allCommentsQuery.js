const getConnection = require('../getConnection');

const allCommentsQuery = async (idService) => {
    let connection;

    try {
        connection = await getConnection();

        const [comments] = await connection.query(
            `
                SELECT id, idUser, idService, text, fileCompleted, createdAt FROM servicesAttended WHERE idService = ? 
                ORDER BY createdAt DESC
            `,
            [idService]
        );

        return comments;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = allCommentsQuery;
