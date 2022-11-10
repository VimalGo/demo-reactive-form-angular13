//***** Reactive Form ******* */

import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Genders } from 'src/app/shared/enums/enums';
import { City } from 'src/app/shared/models/city';
import { Country } from 'src/app/shared/models/country';
import { Relation } from 'src/app/shared/models/relation';
import { State } from 'src/app/shared/models/state';
import { Surname } from 'src/app/shared/models/surname';

@Component({
  selector: 'app-main-person-add-form',
  templateUrl: './main-person-add-form.component.html',
  styleUrls: ['./main-person-add-form.component.css'],
})
export class MainPersonAddFormComponent implements OnInit {
  statusMessage: string = '';
  isSavedSuccess: boolean = false;
  isSubmitted: boolean = false;
  isErrorAlertDisplay: boolean = false;

  surNameList: Surname[] = [];
  cityList: City[] = [];
  stateList: State[] = [];
  countryList: Country[] = [];
  relationList: Relation[] = [];

  //genderEnumArray = Object.keys(Genders); // ["1", "2", "Male", "Female"]
  genderEnumArray = Object.keys(Genders).filter((v) => isNaN(Number(v))); // ["Male", "Female"]

  contactDetailForm: FormGroup;

  constructor(private _dataService: DataService, private _router: Router) {
    // Generate new Reactive Form
    this.contactDetailForm = new FormGroup({
      firstName: new FormControl(null, Validators.required), //input control
      middleName: new FormControl(null, Validators.required), //input control
      surName: new FormControl(null, Validators.required), //select control (Dropdown)
      gender: new FormControl(this.genderEnumArray[0], Validators.required), //radiobutton control
      dob: new FormControl(null, Validators.required), //date control
      mobileNo: new FormControl(null, Validators.required), //input control
      email: new FormControl(null, [Validators.required, Validators.email]), //input control
      address1: new FormControl(null, [Validators.required]), //input control
      address2: new FormControl(null, [Validators.required]), //input control
      area: new FormControl(null, [Validators.required]), //input control
      pincode: new FormControl(null, [Validators.required]), //input control
      relation: new FormControl(null, Validators.required), //select control (Dropdown)
      city: new FormControl(null, Validators.required), //select control (Dropdown)
      state: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ), //select control (Dropdown) - disabled
      country: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ), //select control (Dropdown) - disabled
    });

    console.log('Gender Array:', this.genderEnumArray);
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  // Access formcontrols getter
  get surName() {
    return this.contactDetailForm.get('surName');
  }

  // Access formcontrols getter
  get relation() {
    return this.contactDetailForm.get('relation');
  }

  // Access formcontrols getter
  get city() {
    return this.contactDetailForm.get('city');
  }

  // Access formcontrols getter
  get state() {
    return this.contactDetailForm.get('state');
  }

  // Access formcontrols getter
  get country() {
    return this.contactDetailForm.get('country');
  }

  async loadData(): Promise<void> {
    this.getCityList();

    this.getStateList();

    this.getCountryList();

    this.getRelationList();

    this.getSurNameList();
  }

  getCityList() {
    let params = new HttpParams();
    this._dataService.getData('City/List', params).subscribe((res) => {
      debugger;
      if (res) {
        console.log(res);

        res.forEach((ele) => {
          console.log(ele);
          this.cityList.push(ele);
        });
      }
    });
  }

  getStateList() {
    let params = new HttpParams();
    this._dataService.getData('State/List', params).subscribe((res) => {
      debugger;
      if (res) {
        console.log(res);

        // let state: State = new State();
        // state.stateId = null;
        // state.stateName = '-- Select --';

        //this.stateList.push(state);

        res.forEach((ele) => {
          console.log(ele);
          this.stateList.push(ele);
        });
      }
    });
  }

  getCountryList() {
    let params = new HttpParams();
    this._dataService.getData('Country/List', params).subscribe((res) => {
      debugger;
      if (res) {
        console.log(res);

        // let country: Country = new Country();
        // country.countryId = null;
        // country.countryName = '-- Select --';

        //this.countryList.push(country);

        res.forEach((ele) => {
          console.log(ele);
          this.countryList.push(ele);
        });
      }
    });
  }

  getRelationList() {
    let params = new HttpParams();
    this._dataService.getData('Relation/List', params).subscribe((res) => {
      debugger;
      if (res) {
        console.log(res);

        res.forEach((ele) => {
          console.log(ele);
          this.relationList.push(ele);
        });
      }
    });
  }

  getSurNameList() {
    let params = new HttpParams();
    this._dataService.getData('SurName/List', params).subscribe((res) => {
      debugger;
      if (res) {
        console.log(res);

        res.forEach((ele) => {
          console.log(ele);
          this.surNameList.push(ele);
        });
      }
    });
  }

  async onCityChange() {
    let selectedCity: City = this.city.value;

    debugger;
    console.log('Selected City: ', selectedCity.cityName);

    let params = new HttpParams();
    params = params.append('id', selectedCity.cityId);

    await this._dataService
      .getDataPromise('City/GetStateByCityId', params)
      .then(async (res) => {
        debugger;
        if (res) {
          console.log(res);
          let state = res;

          let filterStates = [];
          filterStates = this.stateList.filter(
            (s) => s.stateId === state.stateId
          );
          let filteredState = filterStates[0];
          this.state.setValue(filteredState, {
            onlySelf: true, //When onlySelf: true the changes will only affect only this FormControl and change is not bubbled up to its parent.
            emitEvent: false,
          });
          console.log('Set filtered State:', this.state);

          let stateForCountry: State = this.state.value;
          await this.onStateChange(stateForCountry.stateId);
        }
      })
      .catch((err) => {
        this.statusMessage = `Error while getting data: ${err.message}`;
      });
  }

  async onStateChange(stateId: number) {
    debugger;
    console.log('Selected State: ', stateId);

    let params = new HttpParams();
    params = params.append('id', stateId);

    await this._dataService
      .getDataPromise('State/GetCountryByStateId', params)
      .then((res) => {
        debugger;
        if (res) {
          console.log(res);
          let country = res;

          let filterCountries = [];
          filterCountries = this.countryList.filter(
            (c) => c.countryId === country.countryId
          );
          let filteredCountry = filterCountries[0];
          this.country.setValue(filteredCountry);
          console.log('Set filtered Country:', this.country);
        }
      })
      .catch((err) => {
        this.statusMessage = `Error while getting data: ${err.message}`;
      });
  }

  onSubmit() {
    console.log(this.contactDetailForm.value);
    this.isSubmitted = true;

    const body = {
      firstName: this.contactDetailForm.value.firstName,
      middleName: this.contactDetailForm.value.middleName,
      lastNameId: this.contactDetailForm.value.surName.surNameId,
      mobileNo: this.contactDetailForm.value.mobileNo,
      dob: this.contactDetailForm.value.dob,
      age: this.calculateAge(new Date(this.contactDetailForm.value.dob)),
      emailId: this.contactDetailForm.value.email,
      address1: this.contactDetailForm.value.address1,
      address2: this.contactDetailForm.value.address2,
      area: this.contactDetailForm.value.area,
      pincode: this.contactDetailForm.value.pincode,
      cityId: this.contactDetailForm.value.city.cityId,
      relationId: this.contactDetailForm.value.relation.relationId,
      totalMembers: 0,
      adults: 0,
      childs: 0,
      mainPersonId: 0,
      gender: Genders[this.contactDetailForm.value.gender],
      stateId: this.contactDetailForm.getRawValue().state?.stateId, //.getRawValue() for get all the controls value including disable controls.
      countryId: this.contactDetailForm.getRawValue().country?.countryId,
    };

    debugger;
    console.log('body:', body);
    this._dataService.postData('ContactDetail/Create', body, null).subscribe({
      next: (res) => {
        debugger;
        console.log('Result: ', res);
        if (res.cityId) {
          this.statusMessage = `New Main Person is saved successfully with Contact Id: ${res.contactDetailId}`;
          this.isSavedSuccess = true;

          this.contactDetailForm.reset();
        } else {
          this.statusMessage = res.title;
          this.isSavedSuccess = false;
          this.isErrorAlertDisplay = true;
        }
      },
      error: (err) => {
        debugger;

        this.statusMessage = `There was some error while save data. Error: ${err.error.title}`;
        this.isSavedSuccess = false;
      },
    });
  }

  redirectToList() {
    this._router.navigate(['/mainperson-list']);
  }

  calculateAge(dob: Date) {
    let timeDiff = Math.abs(Date.now() - dob.getTime());
    let age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    console.log('Age: ', age);
    return age;
  }
}
