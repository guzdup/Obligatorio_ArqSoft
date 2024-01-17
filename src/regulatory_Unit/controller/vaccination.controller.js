const Vaccine = require('../models/vaccineEnabledTable.model');



const vaccination = async (req, res) => {
    const { nameCode, comercialName, laboratory, active } = req.body;
    const existingVaccine = await Vaccine.findOne({
        where: {
            nameCode: nameCode
        }
    });

    if (existingVaccine) {
        return res.status(400).json({ error: 'Ya existe un registro con el mismo nameCode' });
    }
    try{
        

        const newVaccine = await Vaccine.create({
            nameCode,
            comercialName,
            laboratory,
            active,
        });

        res.status(201).json(newVaccine);
    }catch(error){
        console.error('Error al crear la vacuna:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
module.exports = vaccination;