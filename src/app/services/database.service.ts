import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Employee } from '../interface/employee';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})

export class DbService {
  private storage: SQLiteObject;
  empList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'positronx_db.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.storage = db;
        this.getFakeData();
      });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchEmployees(): Observable<Employee[]> {
    return this.empList.asObservable();
  }

  // Render fake data
  getFakeData() {
    this.httpClient.get(
      'assets/dump.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.getDBEmployees();
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  // Get list
  getDBEmployees() {
    return this.storage.executeSql('SELECT * FROM emptable', []).then(res => {
      let items: Employee[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            emp_name: res.rows.item(i).emp_name,
            department: res.rows.item(i).department,
            dob: res.rows.item(i).dob,
            position: res.rows.item(i).position,
            nrc: res.rows.item(i).nrc,
            salary: res.rows.item(i).salary,
          });
        }
      }
      this.empList.next(items);
    });
  }

  // Add
  addDBEmployee(name, department, dob, position, nrc, salary) {
    let data = [name, department, dob, position, nrc, salary];
    return this.storage.executeSql('INSERT INTO emptable (emp_name, department, dob, position, nrc, salary) VALUES (?, ?, ?, ?, ?, ?)', data)
      .then(res => {
        this.getDBEmployees();
      });
  }

  // Get by id
  getDBEmployee(id): Promise<Employee> {
    return this.storage.executeSql('SELECT * FROM emptable WHERE id = ?', [id]).then(res => {
      return {
        id: res.rows.item(0).id,
        emp_name: res.rows.item(0).emp_name,
        department: res.rows.item(0).department,
        dob: res.rows.item(0).dob,
        position: res.rows.item(0).position,
        nrc: res.rows.item(0).nrc,
        salary: res.rows.item(0).salary,
      }
    });
  }

  // Update
  updateDBEmployee(id, employee) {
    let data = [employee.name, employee.department, employee.dob, employee.position, employee.nrc, employee.salary];
    return this.storage.executeSql(`UPDATE emptable SET emp_name = ?, department = ?, dob = ? , position = ? , nrc = ?, salary = ? WHERE id = ${id}`, data)
      .then(data => {
        this.getDBEmployees();
      })
  }

  // Delete
  deleteDBEmployee(id) {
    return this.storage.executeSql('DELETE FROM emptable WHERE id = ?', [id])
      .then(_ => {
        this.getDBEmployees();
      });
  }
}