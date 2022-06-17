const resolvedServiceQuery = require('../../db/serviceQueries/resolvedServiceQuery');

const resolvedService = async (req, res, next) => {
    try {
        const { idService } = req.params;

        await resolvedServiceQuery(idService);

        res.send({
            status: 'ok',
            message: 'Servicio resuelto',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = resolvedService;
