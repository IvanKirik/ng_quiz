export type SignupResponseType = {
    error: boolean,
    message: string,
    user?: {id: number, name: string, lastName: string, email: string, password: string}
}
