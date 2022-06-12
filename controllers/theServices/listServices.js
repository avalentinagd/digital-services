const allServicesQuery = require('../../db/serviceQueries/allServicesQuery');

const listServices = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        const services = await allServicesQuery(keyword);

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
