const allServicesQuery = require('../../db/serviceQueries/allServicesQuery');

const listServices = async (req, res, next) => {
    try {
        const services = await allServicesQuery();

        res.send({
            status: 'ok',
            data: {
                services,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = listServices;
