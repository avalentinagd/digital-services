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
                message: 'No need to solve, it has already been solved.',
            });
        } else {
            await resolvedServiceQuery(idService);

            res.send({
                status: 'ok',
                message: 'Service resolved',
            });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = resolvedService;
