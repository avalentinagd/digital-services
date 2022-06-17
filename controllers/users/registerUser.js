const path = require('path');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const insertUserQuery = require('../../db/userQueries/insertUserQuery');

const { generateError, createPathIfNotExists } = require('../../helpers');

const newUser = async (req, res, next) => {
    try {
        // Obtenemos los campos del body.
        const { name, email, biography, password } = req.body;
        const { photo } = req.files;

        // Si faltan campos lanzamos un error.
        if (!name || !email || !biography || !password) {
            throw generateError('Faltan campos', 400);
        }

        let photoName;

        // Si la imagen existe la guardamos.
        if (req.files && req.files.photo) {
            // Creamos una ruta absoluta al directorio de descargas.
            const uploadsDir = path.join(__dirname + '../../../uploadsPhoto');

            // Creamos el directorio si no existe.
            await createPathIfNotExists(uploadsDir);

            // Procesamos la imagen y la convertimos en un objeti de tipo "Sharp".
            const sharpphoto = sharp(req.files.photo.data);

            // Redimensionamos la imagen para evitar que sean demasiado grandes.
            // Le asignamos 500px de ancho.
            sharpphoto.resize(250);

            // Generamos un nombre único para la imagen.
            photoName = `${uuid()}.${path.extname(req.files.photo.name)}`;

            // Generamos la ruta absoluta a la imagen.
            const imgPath = path.join(uploadsDir, photoName);

            // Guardamos la imagen en el directorio de descargas.
            await sharpphoto.toFile(imgPath);

            const filePath = path.join(uploadsDir, photoName);
            await photo.mv(filePath);
        }

        // Creamos un usuario en la base de datos y obtenemos el id.
        const idUser = await insertUserQuery(
            name,
            email,
            biography,
            photoName,
            password
        );

        res.send({
            status: 'ok',
            message: `Usuario con id ${idUser} creado`,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = newUser;
