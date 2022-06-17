const insertCommentQuery = require('../../db/serviceQueries/insertCommentQuery');

const { generateError } = require('../../helpers');

const commentsService = async (req, res, next) => {
    try {
        const { idService } = req.params;
        const { text } = req.body;

        // Si el texto no existe o supera los 280 caracteres lanzamos un error.
        if (!text || text.length > 500) {
            throw generateError(
                'Falta el texto o la longitud supera los 500 caracteres',
                400
            );
        }

        // Agregamos el comentario
        insertCommentQuery(req.idUser, idService, text);

        res.send({
            status: 'ok',
            message: 'Comentario añadido',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = commentsService;
