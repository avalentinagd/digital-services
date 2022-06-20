const getConnection = require('../getConnection');

const allServicesQuery = async () => {
    let connection;

    try {
        connection = await getConnection();

        const [services] = await connection.query(
            `
                SELECT S.id, S.title, S.description, S.file, S.statusService, S.idUser, S.createdAt
                FROM services S
                LEFT JOIN users U 
                ON S.idUser = U.id
                ORDER BY S.createdAt DESC
                `
        );

        return services;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = allServicesQuery;
