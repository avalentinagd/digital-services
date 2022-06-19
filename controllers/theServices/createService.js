const path = require('path');
const { v4: uuid } = require('uuid');
const insertServiceQuery = require('../../db/serviceQueries/insertServiceQuery');
const { generateError, createPathIfNotExists } = require('../../helpers');

const createService = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const file = req.files.file;

        // Variable donde almacenaremos el nombre con el que guardaremos el fichero.
        let fileName;
        // si no existe title y description y fichero lanzamos un error.
        if (!title && !description && !file) {
            throw generateError('Faltan informacion por ingresar', 400);
        }
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No se han subido archivos.');
        }

        // Si existe el fichero le guardamos.
        if (req.files && req.files.file) {
            // Creamos una ruta absoluta al directorio de descargas.
            let uploadsDir = path.join(__dirname + '../../../uploads');

            // Creamos el directorio si no existe.
            await createPathIfNotExists(uploadsDir);
            //Creamos el nombre nuevo del fichero
            fileName = `${uuid()}${path.extname(req.files.file.name)}`;

            const filePath = path.join(uploadsDir, fileName);
            await file.mv(filePath);
            //Guardamos el fichero que recibimos de req.file en la constante
        }
        // Registramos  el servicio requerido.

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
