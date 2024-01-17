const Appointment = require('../models/appointment.model')

const getAppointments = async (req, res) => {
    try {
        const pendingAppointments = await Appointment.find({ state: 'Pendiente' }).select('documentID date time -_id');

        if(pendingAppointments.length == 0){
            return res.json({message: "No se encontraron citas pendientes"});
        }
        res.json(pendingAppointments);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las citas pendientes", error });
    }
};

module.exports = getAppointments;