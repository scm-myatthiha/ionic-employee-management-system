import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController, IonDatetime, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { DbService } from '../../services/database.service';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-emp-operation',
  templateUrl: './emp-operation.page.html',
  styleUrls: ['./emp-operation.page.scss'],
  providers: [DecimalPipe, DatePipe]
})
export class EmpOperationPage implements OnInit {

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
  ]

  empOperationForm: FormGroup;
  isSubmitted = false;
  handlerMessage = '';
  roleMessage = '';
  name: string;
  dateValue;
  formattedString = '';
  showPicker = false;
  formType;

  salaryValue;
  Data: any[] = [];
  id;

  public items: Array<{ title: string; note: string; icon: string }> = [];
  salary: string;
  constructor(private router: Router,
    public formBuilder: FormBuilder,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private dbSvc: DbService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private modalCtrl: ModalController) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.formType = this.router.getCurrentNavigation().extras.state.type;
        if (this.formType === 'edit') {
          this.id = this.router.getCurrentNavigation().extras.state.id;
        }
      }
    });
  }

  ngOnInit() {
    this.empOperationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      department: ['', [Validators.required]],
      dob: [''],
      position: ['', [Validators.required]],
      nrc: [''],
      salary: [''],
    });
    switch (this.formType) {
      case 'edit':
        this.dbSvc.getDBEmployee(this.id).then(res => {
          res.salary = this.decimalPipe.transform(res.salary, '1.2-2');
          this.dateValue = this.datePipe.transform(res.dob, 'dd/MM/YYYY');
          this.empOperationForm.setValue({
            name: res['emp_name'],
            department: res['department'],
            dob: res['dob'],
            position: res['position'],
            nrc: res['nrc'],
            salary: res['salary'],
          })
        });
        this.formattedString = this.empOperationForm.value.dob;
        break;
      default:
        break;
    }
  }

  formatInput() {
    if (!this.salary) {
      return;
    }
    this.salary = this.salary.replace(/[^\d.-]/g, '');
    this.salary = this.decimalPipe.transform(this.salary, '1.2-2');
  }

  close() {
    this.datetime.cancel(true);
  }

  select() {
    this.datetime.confirm(true);
  }

  async successOperation() {
    const alert = await this.alertController.create({
      message: this.formType === 'add' ? 'This record was successfully added.' : 'This record was successfully updated.',
      buttons: [{
        text: 'OK',
        handler: () => { this.cancelOperation(); }
      }]
    });
    await alert.present();
  }

  cancelOperation() {
    this.empOperationForm.reset();
    this.router.navigate(['/emp-list']);
  }

  confirm() {
    this.modalCtrl.dismiss(this.name, 'confirm');
  }

  getDate(date) {
    this.dateValue = this.datePipe.transform(date, 'dd/MM/YYYY');;
  }

  get operationErrorControl() {
    return this.empOperationForm.controls;
  }

  submitAddForm() {
    this.isSubmitted = true;
    if (!this.empOperationForm.valid) {
      return false;
    }
    if (this.empOperationForm.value.salary) {
      this.empOperationForm.value.salary = this.empOperationForm.value.salary.replace(/\D/g, "");
    }
    this.dbSvc.addDBEmployee(
      this.empOperationForm.value.name,
      this.empOperationForm.value.department,
      this.empOperationForm.value.dob,
      this.empOperationForm.value.position,
      this.empOperationForm.value.nrc,
      this.empOperationForm.value.salary
    ).then(() => {
      this.successOperation();
    });
  }

  submitEditForm() {
    this.isSubmitted = true;
    if (!this.empOperationForm.valid) {
      return false;
    }
    this.empOperationForm.value.salary = this.empOperationForm.value.salary.replace(/\D/g, "");
    this.dbSvc.updateDBEmployee(this.id, this.empOperationForm.value).then(() => {
    });
    this.successOperation();
  }
}

