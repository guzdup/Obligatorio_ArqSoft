const User = require("../modules/user.model");
const bcrypt = require('bcrypt');
const createAccessToken = require('../libs/jwt.js');
const {userVerified} = require('../validation/userValidation.js');

const availableDates = async (req, res) => {
    const {document, dateFrom, dateTo} = req.body;
    const datePattern = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!datePattern.test(dateFrom)) {
        return res.status(400).json({ error: dateError });
    }
    if (!datePattern.test(dateTo)) {
        return res.status(400).json({ error: dateError });
    }
    
    const splitedDateFrom = dateFrom.split('/');
    const dateToSaveFrom = splitedDateFrom[2] + '-' + splitedDateFrom[1] + '-' + splitedDateFrom[0];
    const splitedDateTo = dateTo.split('/');
    const dateToSaveTo = splitedDateTo[2] + '-' + splitedDateTo[1] + '-' + splitedDateTo[0];
    try{
        const userFound = await User.findOne({ documentID: document }) //aca en vez de user seria userProfesional o algo
        await userVerified(userFound, res)
        const token = await createAccessToken({ document: userFound.documentID })
        res.cookie("token", token)

        
    }catch (error) {
        res.status(500).json({ error: "Error al obtener fechas habilitadas", message: error.message});
    }
};
module.exports = availableDates;