const sharp = require('sharp');

const converToBase64 = (input) => {
    console.log("3");
    const imageBuffer = input.toString('base64');
    console.log("3.1");
    return imageBuffer;
}

const photoSizeReduction = async (input) => {
    try {
        const resizedImageBuffer = sharp(input).resize(300, 300).toBuffer();
        return resizedImageBuffer;
    } 
    catch (error) {
        throw new Error('Error al reducir el tamaño de la imagen: ' + error.message);
    }
};

const grayScalePassage = async (input) => {
    try {
        const grayscaleImageBuffer = input.grayscale().toBuffer();
        return grayscaleImageBuffer;
    }
    catch (error) {
        throw new Error('Error al pasar la imágen a escalas de grises: ' + error.message);
    }

}

  
module.exports = { converToBase64, photoSizeReduction, grayScalePassage };