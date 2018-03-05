import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NavigationService, ScholarshipsService} from '../../../app/app.services.list';
import { Model } from '../../../app/app.models';

@IonicPage()
@Component({
  selector: 'page-scholarshipdetail',
  templateUrl: 'scholarshipdetail.html',
})
export class ScholarshipDetailPage {  
  public scholarshipId: string;
  public scholarship: Model.Scholarship;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public navService: NavigationService,     
    public scholarshipsService: ScholarshipsService,    
  ) {
  }

  ionViewCanEnter() {
    this.navService.currentPage = 'ScholarshipDetailPage';
  }

  ngOnInit() {        
    this.scholarshipId = this.navParams.get('scholarshipId');        
    this.scholarshipsService.getScholarship(this.scholarshipId).subscribe((res: Model.Scholarship) => {
      this.scholarship = res;
      console.log(res);
    }, err => console.log('There was an error', err));
  }
}
