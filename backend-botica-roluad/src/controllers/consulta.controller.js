const axios = require("axios");

exports.buscarDocumento = async (req, res) => {
  try {
    const { documento } = req.params;

    if (!documento) {
      return res.status(400).json({
        message: "Ingrese DNI o RUC"
      });
    }

    if (documento.length !== 8 && documento.length !== 11) {
      return res.status(400).json({
        message: "Documento inválido"
      });
    }

    const token = process.env.API_TOKEN?.trim();

    if (!token) {
      return res.status(500).json({
        message: "No se encontró API_TOKEN en el archivo .env"
      });
    }

    let url = "";

    if (documento.length === 8) {
      url = `https://dniruc.apisperu.com/api/v1/dni/${documento}?token=${token}`;
    } else {
      url = `https://dniruc.apisperu.com/api/v1/ruc/${documento}?token=${token}`;
    }

    const response = await axios.get(url);

    return res.json(response.data);

  } catch (error) {
    console.log("ERROR API:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Error al consultar documento",
      error: error.response?.data || error.message
    });
  }
};