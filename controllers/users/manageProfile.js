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
        let photo = req.files.photo;

        // Se obtiene el id recogido de los params.
        const { idUser } = req.params;

        // Se obtiene al usuario con el email del body.
        const user = await userByIdQuery(idUser);

        // Se obtiene el id almacenado en el token.
        const idUserToken = user.id;

        // Se asegura que el usuario este modificando su propio perfil.
        if (idUser != idUserToken)
            throw generateError(
                'Están intentando acceder a información de otro usuario',
                404
            );

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
            photoName = `${uuid()}.${path.extname(req.files.photo.name)}`;

            // Se genera la ruta absoluta a la imagen.
            const imgPath = path.join(uploadsDir, photoName);

            // Se guarda la imagen en el directorio de descargas.
            await sharpphoto.toFile(imgPath);

            const filePath = path.join(uploadsDir, photoName);
            await photo.mv(filePath);
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
            message: `${name}, tu modificación ha sido exitosa`,
        });
    } catch (error) {
        next(error);
    }
};
module.exports = manageProfile;
