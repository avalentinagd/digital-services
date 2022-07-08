const allCommentsQuery = require('../../db/serviceQueries/allCommentsQuery');

const allComments = async (req, res, next) => {
    try {
        const { idService } = req.params;

        const comments = await allCommentsQuery(idService);

        res.send({
            status: 'ok',
            data: {
                comments,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = allComments;
