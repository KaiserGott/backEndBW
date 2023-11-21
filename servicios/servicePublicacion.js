import PublicacionRepository from "../repositorios/repositorioPublicacion.js";
import { PublicacionRequestError} from "../errores.js";
import PublicRequest from "../validacionRequest/publicRequest.js"
import { ObjectId } from 'mongodb';
import ServicioUsuario from "../servicios/serviceUsuarios.js";


class ServicioPublicacion {
  constructor() {
    this.repository = new PublicacionRepository();
    this.servicioUsuario = new ServicioUsuario();
  }

  async crearPublicacion(req, res) {
    const nuevaPublicacion = {
      titulo: req.body.titulo,
      usuario: req.body.usuario,
      animal: req.body.animal,
    };
  
    try {
      // Contar las publicaciones del usuario
      const countPublicaciones = await this.servicioPublicacion.contarPublicacionesPorUsuario(nuevaPublicacion.usuario);
  
      // Verificar si el usuario tiene más de 10 publicaciones
      if (countPublicaciones > 10) {
        return res.status(403).json({ message: 'El usuario ha alcanzado el límite de 10 publicaciones.' });
      }
  
      // Crear la publicación si el usuario no ha alcanzado el límite
      const publicacionCreada = await this.repository.crearPublicacion(nuevaPublicacion);
  
      // Devolver la respuesta
      return res.status(201).json(publicacionCreada);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async contarPublicacionesPorUsuario(usuarioId) {
    try {
      const count = await this.publicacionesCollection.countDocuments({ 'usuario._id': usuarioId });
      return count;
    } catch (error) {
      throw new DatabaseError("Error al contar las publicaciones del usuario: " + error);
    }
  }

  async obtenerPublicacionPorId(idPublicacion) {
    const id = new ObjectId(idPublicacion);
    try {
      const publicacion = await this.repository.obtenerPublicacionPorId(id);
      if (!publicacion) {
        throw new PublicacionRequestError(`Publicación con ID ${idPublicacion} no encontrada`);
      }
      return publicacion;
    } catch (error) {
      return error
    }
  }

  async eliminarPublicacionesDeUsuarioEliminado(idUsuario) {
    try {
      const resultado = await this.repository.eliminarPublicacionesPorUsuario(idUsuario);
      return resultado;
    } catch (error) {
      throw new PublicacionRequestError("Error al eliminar publicaciones del usuario: " + error.message);
    }
  }

  async actualizarPublicacion(idPublicacion, nuevosDatos) {
    const id = new ObjectId(idPublicacion);
    try {
      //PublicRequest.validacionPublicacion(nuevosDatos);
      const publicacionActualizada = await this.repository.actualizarPublicacion(id, nuevosDatos);
      return publicacionActualizada;
    } catch (error) {
      throw new PublicacionRequestError("Error al actualizar publicación: " + error.message);
    }
  }

  async eliminarPublicacion(idPublicacion) {
    const id = new ObjectId(idPublicacion);
    try {
      const publicacionEliminada = await this.repository.eliminarPublicacion(id);
      if (!publicacionEliminada) {
        throw new PublicacionRequestError(`Publicación con ID ${idPublicacion} no encontrada`);
      }
      return publicacionEliminada;
    } catch (error) {
      throw new PublicacionRequestError("Error al eliminar publicación: " + error.message);
    }
  }

  async eliminarPublicacionesPorUsuario(idUsuario) {
    console.log(idUsuario);
    try {
      const resultado = await this.repository.eliminarPublicacionesPorUsuario(idUsuario);
      return resultado;
    } catch (error) {
      throw new PublicacionRequestError("Error al eliminar publicaciones del usuario: " + error.message);
    }
  }
  
  async publicaciones() {
    try {
      const array = await this.repository.publicaciones(); 
      return array     
    } catch (error) {
      throw new PublicacionRequestError("No se encontraron publicaciones: " + error.message);
    }
  }

  async actualizarPublicacionesDelUsuario(user) {
    try {
      const array1 = await this.publicacionesUsuario(user._id);
      console.log(array1.length +" publicaciones usuario a modificar1");
      if(array1.length > 0) {
        for (let i = 0; i < array1.length; i++) {
          const publicacion = array1[i];
          await this.actualizarPublicacion(publicacion._id, user);
        }
      }
      const array2 = await this.publicacionesUsuario(user._id);
      console.log(array2.length +" publicaciones usuario a modificar2");

    } catch (error) {
      throw new PublicacionRequestError("No se encontraron publicaciones: " + error.message);
    }
  }


  async publicacionesUsuario(idUsuario) {
    try {

      const array = await this.repository.publicacionesUsuario(idUsuario);
      console.log(array + " servico usuario metodo publicacionesusuario");
      return array.length > 0 ? array : { "message": "Sin publicaciones disponibles" };
    } catch (error) {
      throw new PublicacionRequestError("No se encontraron publicaciones: " + error.message);
    }
  }

  async publicacionesPorString(string) {
    try {
      if (!string) {
        return res.status(400).json({ message: 'Falta el parámetro de consulta "search".' });
      }
      const result = await this.repository.publicacionesPorString(string);
      return result.length > 0 ? result : {"message": "Sin publicaciones disponibles"};  
    } catch (error) {
      throw new PublicacionRequestError("No se encontraron publicaciones: " + error.message);
    }
  }
  
  async solicitar(idAdoptante, idOferente) {
    try {
      const [userAdoptante, userOferente] = await Promise.all([
        this.servicioUsuario.obtenerUsuario(idAdoptante),
        this.servicioUsuario.obtenerUsuario(idOferente)
      ]);

      const users = [userAdoptante, userOferente];
      return users;
    } catch (error) {
      throw new PublicacionRequestError("Error: " + error.message);
    }
  }
}

export default ServicioPublicacion;
