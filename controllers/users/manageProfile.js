const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const manageProfileQuery = require('../../db/userQueries/manageProfileQuery');
const userByIdQuery = require('../../db/userQueries/userByIdQuery');
const { generateError, createPathIfNotExists } = require('../../helpers');

const manageProfile = async (req, res, next) => {
    try {
        // Se obtienen los datos que se reciben del body.
        const { name, email, biography, password } = req.body;

        // Se obtiene el id recogido de los params.
        const { idUser } = req.params;

        // Se obtiene al usuario con el email del body.
        const user = await userByIdQuery(idUser);

        // Se obtiene el id almacenado en el token.
        const idUserToken = user.id;

        // Se asegura que el usuario este modificando su propio perfil.
        if (idUser != idUserToken)
            throw generateError(
                'The information you are trying to access belongs to another user.',
                404
            );
        // Se guarda la foto anterior en la variable "oldPhoto".
        let oldPhoto = user.photo;

        let photoName;

        // Si no existe una nueva foto para actualizar en el perfil, debe quedar la misma foto.
        if (!req.files) {
            photoName = oldPhoto;
        }

        // Si la nueva imagen existe, se guarda.
        if (req.files && req.files.photo) {
            let photo = req.files.photo;
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

            try {
                // Eliminar photo antigua.
                fs.unlink(uploadsDir + '/' + oldPhoto);
            } catch (err) {
                console.error(err.message);
            }
        }

        // Query con los parametros del body.
        await manageProfileQuery(
            idUser,
            name,
            email,
            biography,
            photoName,
            password
        );

        // Si todo va bien, se envía un mensaje que lo indique.
        res.send({
            status: 'ok',
            message: `Successful modification`,
        });
    } catch (error) {
        next(error);
    }
};
module.exports = manageProfile;
