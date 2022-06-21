const getConnection = require('../getConnection');

const resolvedServiceQuery = async (idService) => {
    let connection;

    try {
        connection = await getConnection();

        const [services] = await connection.query(
            `SELECT statusService FROM services WHERE id = ?`,
            [idService]
        );

        // Si el atributo "statusService" esta como pendiente se lanza un error.
        if (!services[0].statusService) {
            const err = new Error('El servicio aun no se ha resuelto');
            err.statusCode = 403;
            throw err;
        }

        await connection.query(
            `UPDATE services SET statusService = 'resolved' WHERE id = ?`,
            [idService]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = resolvedServiceQuery;
