import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NavigationService, FilterService, ScholarshipsService, AlertService } from '../../app/app.services.list';
import { Model } from '../../app/app.models';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-scholarships',
  templateUrl: 'scholarships.html',
})
export class ScholarshipsPage {
  scholarshipsList: Model.Scholarship[];
  limit = 20;
  offset = 0;
  input = '';
  infinite: any;
  my_filter: boolean;
  school_id: number;
  subscription: Subscription;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public navService: NavigationService,
    public modalCtrl: ModalController,
    public filterService: FilterService,
    public scholarshipsService: ScholarshipsService,
    public alert: AlertService
  ) {
  }

  ionViewCanEnter() {
    this.navService.currentPage = 'ScholarshipsPage';
  }

  ngOnInit() {
    this.subscription = this.filterService.newScholarshipEvent.subscribe(event => this.onFilterChange(event));
    this.filterService.scholarshipFilterChange();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onFilterChange(event): void {
    this.my_filter = event.myScholarships;
    if (event.scholarshipUniversity) {
      this.school_id = event.scholarshipUniversity.id;
    }
    this.getScholarships();
  }

  presentModal() {
    let modal = this.modalCtrl.create('FilterPage', { filter: 'scholarships' });
    modal.present();
  }

  reset(): void {
    this.limit = 20;
    this.offset = 0;
    this.input = '';
    if (this.infinite) this.infinite.enable(true);
  }

  getScholarships(): void {
    this.reset();
    this.scholarshipsService.getScholarships(this.my_filter, this.school_id).subscribe((res: Model.Scholarship[]) => {
      this.scholarshipsList = res;
      this.offset = res.length;
    }, err => {
      this.alert.handleError(err);
    });
  }

  searchScholarships(event): void {
    this.reset();
    this.input = event.target.value;
    this.scholarshipsService.getScholarships(this.my_filter, this.school_id, this.input).subscribe((res: Model.Scholarship[]) => {
      this.scholarshipsList = res;
      this.offset = res.length;
    }, err => {
      this.alert.handleError(err);
    });
  }

  doInfinite(infiniteScroll: any): void {
    this.scholarshipsService.getScholarships(this.my_filter, this.school_id,
      this.input, this.offset, this.limit).subscribe((res: Model.Scholarship[]) => {
        this.scholarshipsList = this.scholarshipsList.concat(res);
        this.infinite = infiniteScroll;
        infiniteScroll.complete();
        if (res.length < this.limit) infiniteScroll.enable(false);
      }, err => {
        this.alert.handleError(err);
      });
  }

  goToDetailPage(scholarshipId: string): void {
    this.navCtrl.push('ScholarshipDetailPage', { scholarshipId: scholarshipId });
  }
}
