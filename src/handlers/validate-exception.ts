class ValidateException extends Error {
    errors?: string[]

    constructor (message: string, options: ErrorOptions = {}, errors: string[] = []) {
        super(message)
        this.errors = errors
        this.cause = options ? options.cause : undefined
        this.name = ValidateException.name
    }
}

export default ValidateException