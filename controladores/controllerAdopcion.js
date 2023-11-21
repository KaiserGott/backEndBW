import ServicioAdopcion from "../servicios/serviceAdopcion.js";
import { AdopcionRequestError, AdopcionNotFoundError } from "../errores.js";

class ControllerAdopcion {
  constructor() {
    this.servicioAdopcion = new ServicioAdopcion();
  }

  crearAdopcion = async (req, res) => {
    const nuevaAdopcion = {
      idUsuario: req.body.idUsuario,
      idAnimal: req.body.idAnimal,
      fechaAdopcion: req.body.fechaAdopcion,
      estado: req.body.estado,
    };

    try {
      const adopcionCreada = await this.servicioAdopcion.crearAdopcion(nuevaAdopcion);
      res.status(201).json(adopcionCreada);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };

  obtenerAdopcion = async (req, res) => {
    const idUsuario = req.params.idUsuario;
    try {
      const adopcion = await this.servicioAdopcion.obtenerAdopcionPorUsuario(idUsuario);
      if (!adopcion) {
        throw new AdopcionNotFoundError(`Adopción para el usuario con ID ${idUsuario} no encontrada`);
      }
      res.status(200).json(adopcion);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };

  actualizarAdopcion = async (req, res) => {
    const idUsuario = req.params.idUsuario;
    const nuevosDatos = req.body;
    try {
      const adopcionActualizada = await this.servicioAdopcion.actualizarAdopcion(idUsuario, nuevosDatos);
      res.status(200).json(adopcionActualizada);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };

  eliminarAdopcion = async (req, res) => {
    const idUsuario = req.params.idUsuario;
    try {
      const adopcionEliminada = await this.servicioAdopcion.eliminarAdopcion(idUsuario);
      if (!adopcionEliminada) {
        throw new AdopcionNotFoundError(`Adopción para el usuario con ID ${idUsuario} no encontrada`);
      }
      res.status(200).json(adopcionEliminada);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };
}

export default ControllerAdopcion;
