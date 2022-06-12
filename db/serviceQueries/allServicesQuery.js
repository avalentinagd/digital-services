const getConnection = require('../getConnection');

const allServicesQuery = async (keyword) => {
    let connection;

    try {
        connection = await getConnection();

        let services;

        // Si hay palabra clave "keyword" buscamos los services que contengan esa palabra
        // clave. De lo contrario retornamos todos los services.
        if (keyword) {
            [services] = await connection.query(
                `
                    SELECT S.id, S.title, S.description, S.file,S.status, S.idUser, S.createdAt
                    FROM services S
                    LEFT JOIN users U 
                    ON S.idUser = U.id
                    WHERE S.description LIKE ?
                    ORDER BY S.createdAt DESC
                `,
                [`%${keyword}%`]
            );
        } else {
            [services] = await connection.query(
                `
                SELECT S.id, S.title, S.description, S.file,S.status, S.idUser, S.createdAt
                FROM services S
                LEFT JOIN users U 
                ON S.idUser = U.id
                ORDER BY S.createdAt DESC
                `
            );
        }

        return services;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = allServicesQuery;
