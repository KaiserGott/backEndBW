import ServicioCasita from "../servicios/serviceCasita.js"
import CasitaRequestError from "../errores.js"

class ControladorCasita {
  constructor() {
    this.servicioCasita = new ServicioCasita();
  }


  getAllPublicaciones = (req, res) => {
    res.status(200).json(this.servicioCasita.getAllPublicaciones());
  }

  agregarPublicacion = (req, res) => {
    try {
      const idPublicacion = req.params.idPublicacion;
      this.servicioCasita.agregarPublicacion(idPublicacion);
      res.status(200).send("Publicación agregada a la Casita.");
    } catch (error) {
      res.status(500).json(new CasitaRequestError("Error al agregar publicación a Casita: " + error.message));
    }
  };

  eliminarPublicacion = (req, res) => {
    try {
      const idPublicacion = req.params.idPublicacion;
      this.servicioCasita.eliminarPublicacion(idPublicacion);
      res.status(200).send("Publicación eliminada de la Casita.");
    } catch (error) {
      res.status(500).json(new CasitaRequestError("Error al eliminar publicación de Casita: " + error.message));
    }
  };

  loAdopte = (req, res) => {
    try {
      const idAnimal = req.params.idAnimal;
      this.servicioCasita.loAdopte(idAnimal);
      res.status(200).send("Animal adoptado y agregado a la Casita.");
    } catch (error) {
      res.status(500).json(new CasitaRequestError("Error al registrar adopción en Casita: " + error.message));
    }
  };
}

export default ControladorCasita;
