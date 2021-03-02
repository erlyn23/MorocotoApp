export interface UserDecodedResponse{
    AccountNumber: string;
    Id: string;
    UserType: string;
    exp: number;
    iat: number;
    nameid: string;
    nbf: number;
}