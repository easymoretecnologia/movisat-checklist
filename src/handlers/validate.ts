import { validate } from "class-validator"

export default async (_class: any, data: any = {}) => {
    const object = new _class()
    Object.assign(object, data)
    const validation = await validate(object)

    let errors: { [key: string]: string[] } = {}

    if (validation.length > 0) {
        validation.forEach(e => {
            let key = e.property
            let value = e.constraints ? Object.values(e.constraints) : []
            errors[key] = value
        })
    }

    return {
        data: object,
        errors: errors,
        isValid: validation.length === 0
    }
}