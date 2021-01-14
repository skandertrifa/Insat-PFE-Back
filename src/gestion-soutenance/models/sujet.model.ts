export class SujetModel {
    id: number;
    dateDepot: Date;
    description : String;
    titre: String;
    constructor(
      id ,
      dateDepot,
      description,
      titre) {
      this.id = id;
      this.dateDepot = new Date(dateDepot);
      this.description = description;
      this.titre = titre;

    }
  }
