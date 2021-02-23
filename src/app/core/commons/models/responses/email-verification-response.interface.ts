export interface EmailVerificationResponse{
    userEmail: string;
    randomCode: string;
    expireDate: Date;
}