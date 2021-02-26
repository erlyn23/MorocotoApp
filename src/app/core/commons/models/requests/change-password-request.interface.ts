export interface ChangePasswordRequest{
    identificationDocument: string;
    securityQuestionId: number;
    securityQuestionAnswer: string;
    password1: string;
    password2: string;
}