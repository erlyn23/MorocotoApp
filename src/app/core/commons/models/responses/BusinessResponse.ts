export interface BusinessResponse{
    //Los modelos deben ser iguales en front y backend.
    partnerId:number;
    businessTypeId:number;
    businessNumber:string;
    businessName:string,
    businessCreditAvailable:number;

}