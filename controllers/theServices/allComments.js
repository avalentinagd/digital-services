const allCommentsQuery = require('../../db/serviceQueries/allCommentsQuery');

const allComments = async (req, res, next) => {
    try {
        const comments = await allCommentsQuery();

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
