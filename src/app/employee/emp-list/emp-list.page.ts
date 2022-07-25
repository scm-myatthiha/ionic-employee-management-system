import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, AlertController, IonDatetime, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { DbService } from '../../services/database.service';
import { PaginationPage } from '../../components/pagination/pagination.page';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.page.html',
  styleUrls: ['./emp-list.page.scss'],
  providers: [PaginationPage, DecimalPipe]
})


export class EmpListPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild(IonDatetime) datetime: IonDatetime;
  departments = [
    'Sale',
    'Software',
    'Hardware',
    'Administration',
    'HR'
  ];
  positions = [
    'Developer',
    'Frontend Developer',
    'Backend Developer',
    'Admin Staff',
    'HR'
  ];
  ionicSearchForm: FormGroup;
  employees: any[] = [];
  isSubmitted = false;
  handlerMessage = '';
  roleMessage = '';
  name: string;
  dateValue;
  formattedString = '';
  showPicker = false;
  addForm;
  pager: any = {};
  pagedItems: any[];
  store = true;
  selectedItem: string = 'Item 1';
  current = 1;
  itemsToDisplay: string[] = [];
  perPage = 10;
  total;
  salary;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private dbSvc: DbService,
    private decimalPipe: DecimalPipe,
  ) {
    this.dbSvc.dbState().subscribe(async (res) => {
      if (res) {
        await this.dbSvc.fetchEmployees().subscribe(item => {
          this.employees = item;
          this.total = Math.ceil(this.employees.length / this.perPage);
          this.itemsToDisplay = this.paginate(this.current, this.perPage);
        })
      }
    });
  }

  selectionChange() {
    this.current = 1;
    this.itemsToDisplay = this.paginate(this.current, this.perPage);
    this.total = Math.ceil(this.employees.length / this.perPage);
  }

  ngOnInit() {
    this.ionicSearchForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      department: ['', [Validators.required]],
      dob: [''],
      position: ['', [Validators.required]],
      nrc: [''],
      salary: [''],
    });
  }

  public onGoTo(page: number): void {
    this.current = page;
    this.itemsToDisplay = this.paginate(this.current, this.perPage);
  }

  public onNext(page: number): void {
    this.current = page + 1;
    this.itemsToDisplay = this.paginate(this.current, this.perPage);
  }

  public onPrevious(page: number): void {
    this.current = page - 1;
    this.itemsToDisplay = this.paginate(this.current, this.perPage);
  }

  public paginate(current: number, perPage: number): string[] {
    return [...this.employees.slice((current - 1) * perPage).slice(0, perPage)];
  }

  close() {
    this.datetime.cancel(true);
  }

  select() {
    this.datetime.confirm(true);
  }

  async confirmDeleteEmployee(id) {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { this.handlerMessage = 'Alert canceled'; }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => { this.handlerMessage = 'Alert confirmed'; this.deleteEmployee(id); }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }

  async successDelete() {
    const alert = await this.alertController.create({
      message: 'This record was deleted.',
      buttons: ['OK']
    });

    await alert.present();
  }

  deleteEmployee(id) {
    this.dbSvc.deleteDBEmployee(id).then(() => {
      this.successDelete();
    })
  }

  formatInput() {
    if (!this.salary) {
      return;
    }
    this.salary = this.salary.replace(/[^\d.-]/g, '');
    this.salary = this.decimalPipe.transform(this.salary, '1.2-2');
  }

  cancelSearch() {
    this.ionicSearchForm.reset();
    this.modalCtrl.dismiss();
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  getDate(date) {
    this.formattedString = date;
  }

  get errorControl() {
    return this.ionicSearchForm.controls;
  }

  submitSearchForm() {
    this.isSubmitted = true;
    if (!this.ionicSearchForm.valid) {
      return false;
    } else {
      const searchType = this.ionicSearchForm.value.name !== '' && this.ionicSearchForm.value.department !== '' &&
        this.ionicSearchForm.value.dob !== '' && this.ionicSearchForm.value.position !== '' && this.ionicSearchForm.value.nrc !== '' &&
        this.ionicSearchForm.value.salary !== '' ? 'allSearch' : this.ionicSearchForm.value.name !== '' && this.ionicSearchForm.value.department !== '' &&
          this.ionicSearchForm.value.position !== '' ? 'requiredSearch' : '';
      switch (searchType) {
        case 'allSearch':
          this.itemsToDisplay = this.employees.filter(emp => emp.emp_name === this.ionicSearchForm.value.name &&
            emp.department === this.ionicSearchForm.value.department && emp.dob === this.ionicSearchForm.value.dob &&
            emp.position === this.ionicSearchForm.value.position && emp.nrc === this.ionicSearchForm.value.nrc &&
            emp.salary === this.ionicSearchForm.value.salary);
          break;
        case 'requiredSearch':
          this.itemsToDisplay = this.employees.filter(emp => emp.emp_name === this.ionicSearchForm.value.name &&
            emp.department === this.ionicSearchForm.value.department && emp.position === this.ionicSearchForm.value.position);
          break;
      }
      this.modalCtrl.dismiss();
    }
  }

  clearFilter() {
    this.ionicSearchForm.reset();
    this.itemsToDisplay = this.paginate(this.current, this.perPage);
  }

  empEdit(type, id) {
    this.router.navigate(['/emp-operation'], { state: { type: type, id: id } });
  }

  empAdd(type) {
    this.router.navigate(['/emp-operation'], { state: { type: type } });
  }
}
