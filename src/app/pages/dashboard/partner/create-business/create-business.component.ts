import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BusinessAddressRequest } from 'src/app/core/commons/models/requests/business-address-request.interface';
import { BusinessPhoneNumberRequest } from 'src/app/core/commons/models/requests/business-phonenumber-request.interface';
import { BusinessRequest } from 'src/app/core/commons/models/requests/business-request.interface';
import { BusinessService } from 'src/app/services/business.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-create-business',
  templateUrl: './create-business.component.html',
  styleUrls: ['./create-business.component.scss'],
})
export class CreateBusinessComponent implements OnInit {

  basicInfoForm: FormGroup;
  locationForm: FormGroup;
  contactForm: FormGroup;

  saveBusinessSubscription: Subscription;
  constructor(private _formBuilder: FormBuilder, 
    private _modalCtrl: ModalController,
    private _businessService: BusinessService,
    private _utilityService: UtilityService) { }

  ngOnInit() {
    this.initForms();
  }

  private initForms(): void{
    this.basicInfoForm = this._formBuilder.group({
      businessTypeId: ["", [Validators.required]],
      businessName: ["", [Validators.required]]
    });

    this.locationForm = this._formBuilder.group({
      country: ["", [Validators.required]],
      province: ["", [Validators.required]],
      city: ["", [Validators.required]],
      street1: ["", [Validators.required]],
      street2: [""]
    });

    this.contactForm = this._formBuilder.group({
      businessPhoneNumber: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]*")]]
    });
  }
  
  isValidField(field: string, form: FormGroup): string{
    const validField = form.get(field);

    return (!validField.valid && validField.touched) ? 'is-invalid' : validField.touched ? 'is-valid': '';
  }

  async saveBusiness(): Promise<void>{
    await this._utilityService.presentLoading();
    if(this.basicInfoForm.valid && this.locationForm.valid && this.contactForm.valid)
    {
      const partnerId: string = (await this._utilityService.getUserDecoded()).Id;
      const businessPhoneNumber: BusinessPhoneNumberRequest = { id: 0, businessId: 0, phoneNumber: this.contactForm.value.businessPhoneNumber };
      const businessAddress: BusinessAddressRequest = {
        id: 0,
        businessId: 0,
        country: this.locationForm.value.country,
        province: this.locationForm.value.province,
        city: this.locationForm.value.city,
        street1: this.locationForm.value.street1,
        street2: this.locationForm.value.street2
      };
      const businessRequest: BusinessRequest = {
        id: 0,
        businessTypeId: this.basicInfoForm.value.businessTypeId,
        partnerId: parseInt(partnerId),
        businessName: this.basicInfoForm.value.businessName,
        businessNumber: Date.now().toString(),
        businessAddresses: [businessAddress],
        businessPhoneNumbers: [businessPhoneNumber]
      }
      this._businessService.saveBusiness(businessRequest).then(value=>{
          this.saveBusinessSubscription = value.subscribe(result=>{
          if(result)
          {
            this._utilityService.closeLoading();
            this._utilityService.presentInfoAlert('Negocio guardado', 'Se ha creado tu negocio correctamente');
            this.closeModal();
          }
        }, error=> { this._utilityService.closeLoading(); console.error(error) });
      });
    }
  }

  closeModal(){
    this._modalCtrl.dismiss();
  }
  ngOnDestroy(): void {
    if(this.saveBusinessSubscription !== undefined){
      this.saveBusinessSubscription.unsubscribe();
    }
  }
}
