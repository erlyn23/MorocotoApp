import { BusinessAddressRequest } from "./business-address-request.interface";
import { BusinessPhoneNumberRequest } from "./business-phonenumber-request.interface";

export interface BusinessRequest{
    id: number;
    partnerId: number;
    businessTypeId: number;
    businessNumber: string;
    businessName: string;
    businessCreditAvilable?: string;
    businessAddresses: BusinessAddressRequest[];
    businessPhoneNumbers: BusinessPhoneNumberRequest[];
}