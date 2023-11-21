import ConexionMongo from "./conexionMongoDb.js";
import Publicacion from "../modelos/ModeloPublicacion.js";
import { DatabaseError } from "../errores.js";
import { ObjectId } from 'mongodb';

class RepositorioPublicacion {
  constructor() {
    this.publicacionesCollection = null;
    this.init();
  }

  async init() {
    try {
      const conexionMongo = ConexionMongo.instance;
      if (conexionMongo) {
        this.publicacionesCollection = await conexionMongo.PublicacionesColeccion();
      } else {
        const nuevaConexionMongo = new ConexionMongo();
        await nuevaConexionMongo.conectar();
        this.publicacionesCollection = nuevaConexionMongo.PublicacionesColeccion();
      }
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async crearPublicacion(publicacion) {
    try {
      const nuevaPublicacion = new Publicacion(
        publicacion.titulo,
        publicacion.usuario,
        publicacion.animal,
      );
       await this.publicacionesCollection.insertOne(nuevaPublicacion);
      return nuevaPublicacion; 
    } catch (error) {
      throw new DatabaseError("Error al crear publicación: " + error);
    }
  }
  

  async obtenerPublicacionPorId(id) {
    return await this.publicacionesCollection.findOne({ _id: id });
  }

  async actualizarPublicacion(id, nuevosDatos) {
    try {
      await this.publicacionesCollection.updateOne({ _id: id }, { $set: nuevosDatos });
      return await this.obtenerPublicacionPorId(id);
    } catch (error) {
      throw new DatabaseError("Error al actualizar publicación: " + error);
    }
  }

  async eliminarPublicacion(id) {
    try {
      const publicacionEliminada = await this.publicacionesCollection.deleteOne({ _id: id });
      return publicacionEliminada;
    } catch (error) {
      throw new DatabaseError("Error al eliminar publicación: " + error);
    }
  }

  async eliminarPublicacionesPorUsuario(idUsuario) {
    //console.log(idUsuario);
    try {
      //const filtro = new ObjectId(idUsuario);
      //console.log(filtro);
      const resultado = await this.publicacionesCollection.deleteMany({'usuario._id': idUsuario });
      console.log(resultado);
      return resultado;
    } catch (error) {
      throw new DatabaseError("Error al eliminar publicaciones del usuario: " + error.message);
    }
  }

  //trae todas las publicaciones
  async publicaciones() {
    try {
      const array = await this.publicacionesCollection.find({}).toArray();
      return array;
    } catch (error) {
      throw new DatabaseError("Error al traer todas las publicaciones: " + error);
    }
  }

  async publicaciones() {
    try {
      const array = await this.publicacionesCollection.find({}).toArray();
      return array;
    } catch (error) {
      throw new DatabaseError("Error al traer todas las publicaciones: " + error);
    }
  }

  async publicacionesUsuario(idUsuario) {
    try {
      const array = await this.publicacionesCollection.find({ 'usuario._id': idUsuario }).toArray();
      return array;
    } catch (error) {
      throw new DatabaseError("Error al traer las publicaciones del usuario: " + error);
    }
  }

  async publicacionesPorString(string) {
    try {
      const regex = new RegExp(string, 'i');
      const array = await this.publicacionesCollection.find(
        {$or: [
          { titulo: regex },  
          { 'animal.nombre': regex },
          { 'animal.tipoAnimal': regex },
          { 'animal.descripcion': regex },
          { 'animal.sexo': regex },
          { 'animal.ubicacion': regex },
          { 'animal.historiaClinica': regex },
          { 'animal.edad': regex},
          { 'animal.pesoEnKg': regex },
        ]}).toArray();
      return array;
    } catch (error) {
      throw new DatabaseError("Error al traer todas las publicaciones: " + error);
    }
  }

}

export default RepositorioPublicacion;