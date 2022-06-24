const resolvedServiceQuery = require('../../db/serviceQueries/resolvedServiceQuery');
const selectServiceQuery = require('../../db/serviceQueries/selectServiceQuery');

const resolvedService = async (req, res, next) => {
    try {
        const { idService } = req.params;
        const service = await selectServiceQuery(idService);
        const actualStatus = service[0].statusService;

        if (actualStatus === 'resolved') {
            res.send({
                status: 'ok',
                message: 'No es necesario resolver, ya ha sido resuelto',
            });
        } else {
            await resolvedServiceQuery(idService);

            res.send({
                status: 'ok',
                message: 'Servicio resuelto',
            });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = resolvedService;
