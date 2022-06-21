const path = require('path');
const { v4: uuid } = require('uuid');
const insertServiceQuery = require('../../db/serviceQueries/insertServiceQuery');
const { generateError, createPathIfNotExists } = require('../../helpers');

const createService = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const file = req.files.file;

        // Variable donde se almacena el nombre con el que se guardará el fichero.
        let fileName;

        // Si no existe title, description y file, se lanza un error.
        if (!title && !description && !file) {
            throw generateError('Falta información por ingresar', 400);
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No se han subido archivos.');
        }

        // Si existe el fichero se guarda.
        if (req.files && req.files.file) {
            // Se crea una ruta absoluta al directorio de descargas.
            let uploadsDir = path.join(__dirname + '../../../uploads');

            // Se crea el directorio si no existe.
            await createPathIfNotExists(uploadsDir);

            // Se crea el nombre nuevo del fichero.
            fileName = `${uuid()}${path.extname(req.files.file.name)}`;

            // Se guarda el fichero que recibimos de req.files en una constante.
            const filePath = path.join(uploadsDir, fileName);
            await file.mv(filePath);
        }

        // Se registra el servicio requerido.
        insertServiceQuery(req.idUser, title, description, fileName);
        res.send({
            status: 'ok',
            message: 'Servicio creado',
        });
    } catch (err) {
        next(err);
    }
};
module.exports = createService;
