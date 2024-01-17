const certificationModel = require('../models/certificate.model');
const qrcode = require('qrcode');
const fs = require('fs');
const nodemailer = require('nodemailer');
const User = require('../../authentication_System/modules/user.model.js')

const certificationVaccine = async (req, res) => {
    
    const { uniqueCode} = req.query;

    const certification = await certificationModel.findOne({
        where: {
            uniqueCode: uniqueCode
        }
    });
    if(!certification){
        return res.status(400).json({ error: 'No existe un certificado con ese codigo' });
    }
    const userFound = await User.findOne({
        documentID: certification.documentID
    });
    if(!userFound){
        return res.status(400).json({ error: 'No existe un usuario con ese documento' });
    }
    const certificateInfo = `Documento: ${certification.documentID}\nVacuna: ${certification.nameCode}\nCódigo único: ${uniqueCode}`;
    try{
        const qrPath = `C:/Users/Acer/Desktop/230263_251105_254813/certificados/certificado_${uniqueCode}.png`;
        qrcode.toFile(qrPath, certificateInfo, async (err) => {
            if (err) throw err;
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

            const mailOptions = {
                from: 'obliarqui@gmail.com',
                to: userFound.email,
                subject: 'Certificado de vacunacion con QR adjunto',
                text: 'Se encuentra adjunto el certificado de vacunacion con el codigo QR correspondiente',
                attachments: [
                    {
                        filename: `certificado_${uniqueCode}.png`,
                        path: qrPath,
                    },
                ],
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo de certificado:', error);
                } else {
                    console.log('Correo de certificado enviado:', info.response);
                }
            });
        });
   
    }catch(error){
        console.error('Error al enviar el correo de verificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(200).json({message: "Se ha enviado el certificado al correo del usuario"})
}

module.exports = certificationVaccine;