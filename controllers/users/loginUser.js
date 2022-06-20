const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userByEmailQuery = require('../../db/userQueries/userByEmailQuery');

const { generateError } = require('../../helpers');
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw generateError('Aun faltan campos por rellenar', 400);
        }

        // Obtenemos al usuario con el email del body.
        const user = await userByEmailQuery(email);

        // Comprobamos si las contraseñas coinciden.
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw generateError('Contraseña incorrecta', 401);
        }

        // Información que queremos guardar en el token.
        //lo que quiero guardar en el token
        const payload = {
            id: user.id,
        };

        // Firmamos el token. Crear el token
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '15d',
        });

        res.send({
            status: 'ok',
            data: {
                token,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = loginUser;
