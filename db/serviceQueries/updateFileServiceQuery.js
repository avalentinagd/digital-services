const getConnection = require('../getConnection');

const updateFileServiceQuery = async (idServices, fileName = '') => {
    let connection;

    try {
        connection = await getConnection();

        const [services] = await connection.query(
            `SELECT file FROM services WHERE id = ?`,
            [idServices]
        );

        if (services[0].file) {
            const err = new Error('El fichero se ha subido');
            err.statusCode = 403;
            throw err;
        }

        await connection.query(
            `UPDATE services SET file = fileName WHERE id = ? `,
            [idServices]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateFileServiceQuery;
