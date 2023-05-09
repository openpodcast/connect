export class HttpError extends Error {
    status = 0
}
export class PayloadError extends HttpError {
    status = 400 // invalid request
}

export class AuthError extends HttpError {
    status = 401 // not authorized
}
