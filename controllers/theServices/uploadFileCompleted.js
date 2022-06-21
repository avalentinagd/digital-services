const path = require('path');
const { v4: uuid } = require('uuid');
const uploadFileCompletedQuery = require('../../db/serviceQueries/uploadFileCompletedQuery');
const { createPathIfNotExists, generateError } = require('../../helpers');

const uploadFileCompleted = async (req, res, next) => {
    try {
        const { idService } = req.params;
        const { fileCompleted } = req.files;
        const { text } = req.body;

        // Si el texto no existe o supera los 500 caracteres se lanza un error.
        if (!text || text.length > 500) {
            throw generateError(
                'Falta el texto o la longitud supera los 500 caracteres',
                400
            );
        }

        // Variable donde se almacenará el nombre con el que se guardará el fichero finalizado.
        let fileCompletedName;

        if (!req.files || Object.keys(req.files).length === 0) {
            throw generateError('No se han subido archivos.', 400);
        }

        // Si existe el fichero se guardará.
        if (req.files && req.files.fileCompleted) {
            // Se crea una ruta absoluta al directorio de descargas.
            let uploadsDir = path.join(__dirname + '../../../uploadsCompleted');

            // Se crea el directorio si no existe.
            await createPathIfNotExists(uploadsDir);

            // Se crea el nombre nuevo del fichero finalizado.
            fileCompletedName = `${uuid()} - ${idService}${path.extname(
                req.files.fileCompleted.name
            )}`;

            const filePath = path.join(uploadsDir, fileCompletedName);

            // Se guarda el fichero recibido de req.file en la ruta filePath.
            await fileCompleted.mv(filePath);
        }

        // Se registra el fichero finalizado.
        uploadFileCompletedQuery(
            req.idUser,
            idService,
            text,
            fileCompletedName
        );
        res.send({
            status: 'ok',
            message: 'El fichero completado se ha subido',
        });
    } catch (err) {
        next(err);
    }
};
module.exports = uploadFileCompleted;
