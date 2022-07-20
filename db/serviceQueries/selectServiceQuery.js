const getConnection = require('../getConnection');
const { generateError } = require('../../helpers');

const selectServiceQuery = async (idService) => {
    let connection;

    try {
        connection = await getConnection();

        const [services] = await connection.query(
            `
                SELECT S.id, S.title, S.description, S.file, S.statusService, S.idUser, S.createdAt
                FROM services S
                LEFT JOIN users U 
                ON S.idUser = U.id 
                WHERE S.id = ?
            `,
            [idService]
        );

        if (services.length === 0) {
            throw generateError(
                'There is no service with the selected id',
                409
            );
        }
        return services;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectServiceQuery;
