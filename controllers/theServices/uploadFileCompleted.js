const path = require('path');
const { v4: uuid } = require('uuid');
const uploadFileCompletedQuery = require('../../db/serviceQueries/uploadFileCompletedQuery');
const { createPathIfNotExists, generateError } = require('../../helpers');

const uploadFileCompleted = async (req, res, next) => {
    try {
        const { idService } = req.params;
        const { fileCompleted } = req.files;
        const { text } = req.body;

        // Si el texto no existe o supera los 280 caracteres lanzamos un error.
        if (!text || text.length > 500) {
            throw generateError(
                'Falta el texto o la longitud supera los 500 caracteres',
                400
            );
        }

        // Variable donde almacenaremos el nombre con el que guardaremos el fichero finalizado.
        let fileCompletedName;

        if (!req.files || Object.keys(req.files).length === 0) {
            throw generateError('No se han subido archivos.', 400);
            //return res.status(400).send('No se han subido archivos.');
        }

        // Si existe el fichero le guardamos.
        if (req.files && req.files.fileCompleted) {
            // Creamos una ruta absoluta al directorio de descargas.
            let uploadsDir = path.join(__dirname + '../../../uploadsCompleted');

            // Creamos el directorio si no existe.
            await createPathIfNotExists(uploadsDir);

            //Creamos el nombre nuevo del fichero finalizado
            fileCompletedName = `${uuid()} - ${idService}${path.extname(
                req.files.fileCompleted.name
            )}`;

            const filePath = path.join(uploadsDir, fileCompletedName);

            //Guardamos el fichero que recibimos de req.file en la ruta filePath
            await fileCompleted.mv(filePath);
        }

        // Registramos el fichero finalizado.
        uploadFileCompletedQuery(
            req.idUser,
            idService,
            text,
            fileCompletedName
        );
        res.send({
            status: 'ok',
            message: 'Fichero completado subido',
        });
    } catch (err) {
        next(err);
    }
};
module.exports = uploadFileCompleted;
