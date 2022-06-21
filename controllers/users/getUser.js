const userByIdQuery = require('../../db/userQueries/userByIdQuery');

const getUser = async (req, res, next) => {
    try {
        // Se obtiene el id del usuario del cual se quiere tener la información.
        const { idUser } = req.params;

        // Se obtiene la información del usuario.
        const user = await userByIdQuery(idUser);

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

module.exports = getUser;
