const path = require('path');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const registerUserQuery = require('../../db/userQueries/registerUserQuery');

const { generateError, createPathIfNotExists } = require('../../helpers');

const registerUser = async (req, res, next) => {
    try {
        // Se obtienen los campos del body.
        const { name, email, biography, password } = req.body;
        const { photo } = req.files;

        // Si faltan campos lanzamos un error.
        if (!name || !email || !biography || !password) {
            throw generateError('Faltan campos', 400);
        }

        let photoName;

        // Si la imagen existe, se guarda.
        if (req.files && req.files.photo) {
            // Se crea una ruta absoluta al directorio de descargas.
            const uploadsDir = path.join(__dirname + '../../../uploadsPhoto');

            // Se crea el directorio si no existe.
            await createPathIfNotExists(uploadsDir);

            // Se procesa la imagen y se convierte en un objeto de tipo "Sharp".
            const sharpphoto = sharp(req.files.photo.data);

            // Se redimensiona la imagen para evitar que sea demasiado grande.
            // Se le asignan 250px de ancho.
            sharpphoto.resize(250);

            // Se genera un nombre único para la imagen.
            photoName = `${uuid()}${path.extname(req.files.photo.name)}`;

            // Se genera la ruta absoluta a la imagen.
            const imgPath = path.join(uploadsDir, photoName);

            // Se guarda la imagen en el directorio de descargas.
            await sharpphoto.toFile(imgPath);

            const filePath = path.join(uploadsDir, photoName);
            await photo.mv(filePath);
        }

        // Se crea un usuario en la base de datos y obtenemos su id.
        const idUser = await registerUserQuery(
            name,
            email,
            biography,
            photoName,
            password
        );

        res.send({
            status: 'ok',
            message: `El usuario se ha creado con el id ${idUser}`,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = registerUser;
