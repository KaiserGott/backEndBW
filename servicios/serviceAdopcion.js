import AdopcionRepository from "../repositorios/repositorioAdopcion.js";
import { AdopcionRequestError } from "../errores.js";

class ServicioAdopcion {
  constructor() {
    this.repository = new AdopcionRepository();
  }

  async crearAdopcion(adopcion) {
    try {
      const nuevaAdopcion = await this.repository.crearAdopcion(adopcion);
      return nuevaAdopcion;
    } catch (error) {
      throw new AdopcionRequestError("Error al crear adopción: " + error.message);
    }
  }

  async obtenerAdopcionPorUsuario(idUsuario) {
    try {
      const adopcion = await this.repository.obtenerAdopcionPorIdUsuario(idUsuario);
      return adopcion;
    } catch (error) {
      throw new AdopcionRequestError("Error al obtener adopción: " + error.message);
    }
  }

  async actualizarAdopcion(idUsuario, nuevosDatos) {
    try {
      const adopcionActualizada = await this.repository.actualizarAdopcion(idUsuario, nuevosDatos);
      return adopcionActualizada;
    } catch (error) {
      throw new AdopcionRequestError("Error al actualizar adopción: " + error.message);
    }
  }

  async eliminarAdopcion(idUsuario) {
    try {
      const adopcionEliminada = await this.repository.eliminarAdopcion(idUsuario);
      return adopcionEliminada;
    } catch (error) {
      throw new AdopcionRequestError("Error al eliminar adopción: " + error.message);
    }
  }
}

export default ServicioAdopcion;
