import { Model } from '../app/app.models';

export class Prize {
  id: number;
  title: string;
  points: number;
  description: string;
  organization: Model.Organization;

  constructor(data) {
    if (data) {
      this.id = data.id;
      this.title = data.title;
      this.description = data.description;
      this.points = data.points;
      this.organization = new Model.Organization(data.organization || {});
    }
  }
}