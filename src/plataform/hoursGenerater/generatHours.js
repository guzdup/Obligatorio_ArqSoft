function generatHours(fechaInicio, fechaFin) {
    if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
      console.error("Las fechas proporcionadas no son válidas.");
      return [];
    }

    const horas = [];
    let horaActual = new Date(fechaInicio);
    horaActual.setHours(9, 0, 0, 0);
    let horaFin = new Date(fechaInicio);
    horaFin.setHours(18,0,0,0);

    while (horaActual <= horaFin) {
      horas.push(horaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      horaActual = new Date(horaActual.getTime() + 30 * 60000); 
    }
  
    return horas;
};

function generarCombinaciones(arr1, arr2) {
    const combinaciones = [];
  
    for (const elem1 of arr1) {
      for (const elem2 of arr2) {
        combinaciones.push([elem1, elem2]);
      }
    }
  
    return combinaciones;
};


module.exports = { generatHours, generarCombinaciones};

