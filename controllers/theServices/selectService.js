const selectServiceQuery = require('../../db/serviceQueries/selectServiceQuery');

const selectService = async (req, res, next) => {
    try {
        const { idService } = req.params;

        const service = await selectServiceQuery(idService);

        res.send({
            status: 'ok',
            data: {
                service,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = selectService;
