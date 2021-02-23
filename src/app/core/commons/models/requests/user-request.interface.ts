import { UserAddressRequest } from "./user-address-request.interface";
import { UserPhoneNumbers } from "./user-phoneNumbers-request.interface";

export interface UserRequest{
    id: number;
    accountNumber: string;
    fullName: string;
    userPhone: string;
    osPhone: string;
    identificationDocument: string;
    email: string;
    birthDate: Date;
    userPassword: string;
    pin: string;
    securityAnswer: string;
    userTypeId: number;
    securityQuestionId: number;

    userAddresses: UserAddressRequest[];
    userPhoneNumbers: UserPhoneNumbers[];
}