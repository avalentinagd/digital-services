const userByIdQuery = require('../../db/userQueries/userByIdQuery');

const getOwnUser = async (req, res, next) => {
    try {
        const user = await userByIdQuery(req.idUser);

        res.send({
            status: 'ok',
            data: {
                user,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getOwnUser;
