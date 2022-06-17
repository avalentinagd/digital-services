const path = require('path');
const { v4: uuid } = require('uuid');
const updateFileServiceQuery = require('../../db/serviceQueries/updateFileServiceQuery');
const { createPathIfNotExists } = require('../../helpers');

const updateFileService = async (req, res, next) => {
    try {
        //const { id } = req.params;

        const file = req.files.file;
        // Variable donde almacenaremos el nombre con el que guardaremos el fichero.
        let fileName;

        // si no existe fichero lanzamos un error.
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No se han subido archivos.');
        }

        // Si existe el fichero le guardamos.
        if (req.files && req.files.file) {
            // Creamos una ruta absoluta al directorio de descargas.
            let uploadsDir = path.join(__dirname + '../../../filescompleted');

            // Creamos el directorio si no existe.
            await createPathIfNotExists(uploadsDir);
            //Creamos el nombre nuevo del fichero
            fileName = `${uuid()}.${path.extname(
                req.files.file.name
            )} - Fichero completado`;

            const filePath = path.join(uploadsDir, fileName);
            await file.mv(filePath);
            //Guardamos el fichero que recibimos de req.file en la constante
        }

        // Registramos fichero completado
        updateFileServiceQuery(id, req.idUser, fileName);
        res.send({
            status: 'ok',
            message: 'Fichero completado y subido',
        });
    } catch (err) {
        next(err);
    }
};
module.exports = updateFileService;
