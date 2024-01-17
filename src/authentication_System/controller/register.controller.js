const multer = require('multer');
const sharp = require('sharp');
const User = require('../modules/user.model.js')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer'); //se utiliza para el envio de correos electronicos
const createAccessToken = require('../libs/jwt.js')
const { validateRequiredFields, validateEmailFormat, validateRepeatedDoc, validateConfirmPassword, validateDateOfBirth, validateDocumentFormat, validateImageSize, validateLengthPassword, validatePhoneNumber, validateRole, validateRepeatedEmail, validateExistingAsEmployee } = require('../validation/userValidations.js');

const roles = ["p", "a"]
const requiredFields = "Todos los campos son obligatorios"
const minLengthPassword = "La contraseña debe tener al menos 8 caracteres"
const dateError = "La fecha de nacimiento no cumple con el formato dd/mm/aaaa"
const idFormatError = "El documentID no cumple con el formato esperado (sin puntos ni guiones)"
const mismatchPwdError = "Las contraseñas no coinciden"
const invalidFormatEmail = "La dirección de correo electrónico no tiene un formato válido"
const invalidTelephoneNumber = "El número de teléfono no es válido"
const invalidRoleError = "El rol es invalido"
const repeatedEmailError = "El email ya existe"
const repeatedDocumentError = "El documento ya existe"
const NonExistingAsEmployeeError = "El usuario no esta registrado como empleado"
const invalidSizeImage = "La imagen supera el tamaño máximo permitido de 1MB."
const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 1MB en bytes

const upload = multer();
const multerMiddleware = upload.single('picture');

const processImage = async (imageBuffer) => {
    return sharp(imageBuffer).resize(300, 300).grayscale().toBuffer();
};

const register = async (req, res) => {

    const { firstName, lastName, documentID, password, confirmPassword, dateOfBirth, address, telephone, email, role } = req.body;
    const pictureBuffer = req.file && req.file.buffer;
    try {

        if (!validateRequiredFields(req.body)) {
            return res.status(400).json({ error: requiredFields });
        }

  
        if (!validateLengthPassword(password)) {
            return res.status(400).json({ error: minLengthPassword });
        }

  
        if (!validateConfirmPassword(password, confirmPassword)) {
            return res.status(400).json({ error: mismatchPwdError });
        }

 
        if (!validateDateOfBirth(dateOfBirth)) {
            return res.status(400).json({ error: dateError });
        }

        if (!validateRole(role)) {
            return res.status(400).json({ error: invalidRoleError });
        }

        const splitedDateOfBirth = dateOfBirth.split('/');
        const dateToSave = splitedDateOfBirth[2] + '-' + splitedDateOfBirth[1] + '-' + splitedDateOfBirth[0];


        if (!validateDocumentFormat(documentID)) {
            return res.status(400).json({ error: idFormatError });
        }

        if (!validateEmailFormat(email)) {
            return res.status(400).json({ error: invalidFormatEmail });
        }

        if(roles.includes(role)){
            const isEmployee = await validateExistingAsEmployee(documentID)
            if (!isEmployee) {
                return res.status(400).json({ error: NonExistingAsEmployeeError });
            }
        }
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ error: "Error al registrar" });
    }


    try{
        const isEmailRepeated = await validateRepeatedEmail(email)
        const isDocumentRepeated = await validateRepeatedDoc(documentID)
        if(isEmailRepeated){
            return res.status(400).json({ error: repeatedEmailError });
        }
        if(isDocumentRepeated){
            return res.status(400).json({ error: repeatedDocumentError });
        }
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ error: invalidSizeImage });
    }
   
    const phoneNumber = req.body.telephone;
    const isValidPhoneNumber = await validatePhoneNumber(phoneNumber);
    if (!isValidPhoneNumber) {
        return res.status(400).json({ error: invalidTelephoneNumber });
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure: true,
        auth: {
            user: 'obliarqui@gmail.com',
            pass: 'dmkgjwsrmcwmzabi',
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    if (req.file && req.file.size > MAX_FILE_SIZE_BYTES) {
        return res.status(400).json({ error: "La imagen supera el tamaño máximo permitido de 1MB." });
    }

    if (pictureBuffer) {
        const processedImageBuffer = await processImage(pictureBuffer);
        var pictureMod = processedImageBuffer.toString('base64');
    }

    try {
        const userData = {
            firstName,
            lastName,
            documentID,
            password,
            dateOfBirth: dateToSave,
            address,
            telephone,
            email,
            picture: pictureMod,
            role,
            verified: false
        };

        const hashedPassword = await bcrypt.hash(userData.password, 10)
        userData.password = hashedPassword

        const newUser = new User(userData);
        await newUser.save();

        const token = await createAccessToken({ document: newUser.documentID, role: newUser.role })
        res.cookie("token", token)

        res.json({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            document: newUser.documentID,
            email: newUser.email,
            telephone: newUser.telephone,
            picture: pictureMod,
            dateOfBirth: newUser.dateOfBirth, 
            verified: false,
        });

        const mailOptions = {
            from: 'obliarqui@gmail.com',
            to: newUser.email,
            subject: 'Verificación de email',
            text: `Haga click en el siguiente enlace para verificar tu cuenta: http://localhost:3002/api/verify?token=${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo de verificación:', error);
            } else {
                console.log('Correo de verificación enviado:', info.response);
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario", error });
    }
}

module.exports = { register, multerMiddleware };