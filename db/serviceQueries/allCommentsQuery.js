const getConnection = require('../getConnection');

const allCommentsQuery = async () => {
    let connection;

    try {
        connection = await getConnection();

        const [comments] = await connection.query(
            `
                SELECT SA.idUser, SA.text, SA.fileCompleted, SA.createdAt
                FROM servicesAttended SA
                LEFT JOIN services S 
                ON SA.idService = S.id
                ORDER BY S.createdAt DESC
            `
        );

        return comments;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = allCommentsQuery;
