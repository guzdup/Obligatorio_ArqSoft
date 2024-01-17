const VaccineShedule = require('../../plataform/models/vaccineShedule.model.js')
const Vaccine = require('../models/vaccineHistoryTable.model.js')

const vaccinationHistory = async (req, res) => {
    const {document} = req.query;
    const {doctor, dateAdministered} = req.body;

    async function validateRepetedDoc(document){
        const documentRep = await VaccineShedule.findOne({ documentID: document })
        return documentRep
    }
    const existingDoc = await validateRepetedDoc(document)
    if (!existingDoc) {
        return res.status(400).json({ error: 'No existe un usuario con ese documento' });
    }
    try{

        const promises = existingDoc.vaccines.map(async (vaccineN) => {
            const {vaccine, state, date} = vaccineN;
            const existingVaccineHistory = await Vaccine.findOne({
                where: {
                    documentID: document,
                    nameVaccine: vaccine,
                },
            });
            if(!existingVaccineHistory){
                const vaccineHistory = await Vaccine.create({
                    documentID: document,
                    nameVaccine : vaccine,
                    state,
                    date,
                    doctor,
                    dateAdministered,
                });
                return vaccineHistory;
                
            
            }else{
                return existingVaccineHistory;
            }
        });
        const createdVaccineHistory = await Promise.all(promises);
        res.status(201).json(createdVaccineHistory); 
    }catch(error){
        console.error('Error al crear historial de vacuna:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}
module.exports = vaccinationHistory