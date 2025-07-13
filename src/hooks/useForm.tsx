import { SelectChangeEvent } from "@mui/material"
import { ChangeEvent } from "react"
import { useStateType } from "@/types"
import { DateTime } from "luxon"
import payment from "@/utils/payment"
import Payment from "payment"

export default ({ single = false }: { single?: boolean }) => {
    return {
        onChange: (setStore: useStateType<any>, setErrors: useStateType<any> | undefined = undefined, additionalFunction: (() => void) | undefined = undefined) => (event: ChangeEvent<HTMLInputElement>) => {
            setStore((prev: any) => ({ ...prev, [event.target.name]: event.target.value }))

            if (setErrors !== undefined) {
                setErrors((prev: any) => ({ ...prev, [event.target.name]: null }))
            }

            if (additionalFunction !== undefined) {
                additionalFunction()
            }
        },
        
        onSelect: (setStore: useStateType<any>, setErrors: useStateType<any> | undefined = undefined, additionalFunction: (() => void) | undefined = undefined) => (event: SelectChangeEvent<unknown>) => {
            setStore((prev: any) => ({ ...prev, [event.target.name]: event.target.value }))

            if (setErrors !== undefined) {
                setErrors((prev: any) => ({ ...prev, [event.target.name]: null }))
            }

            if (additionalFunction !== undefined) {
                additionalFunction()
            }
        },
        
        onDate: (name: string,setStore: useStateType<any>, setErrors: useStateType<any> | undefined = undefined, additionalFunction: (() => void) | undefined = undefined) => (value: DateTime|null, context: any) => {
            setStore((prev: any) => ({ ...prev, [name]: value?.toFormat('yyyy-MM-dd') ?? null }))

            if (setErrors !== undefined) {
                setErrors((prev: any) => ({ ...prev, [name]: null }))
            }

            if (additionalFunction !== undefined) {
                additionalFunction()
            }
        },
        
        onTime: (name: string,setStore: useStateType<any>, setErrors: useStateType<any> | undefined = undefined, additionalFunction: (() => void) | undefined = undefined) => (value: DateTime|null, context: any) => {
            setStore((prev: any) => ({ ...prev, [name]: value?.toFormat('HH:mm:ss') ?? null }))

            if (setErrors !== undefined) {
                setErrors((prev: any) => ({ ...prev, [name]: null }))
            }

            if (additionalFunction !== undefined) {
                additionalFunction()
            }
        },
        
        onDatetime: (name: string,setStore: useStateType<any>, setErrors: useStateType<any> | undefined = undefined, additionalFunction: (() => void) | undefined = undefined) => (value: DateTime|null, context: any) => {
            setStore((prev: any) => ({ ...prev, [name]: value?.toFormat('yyyy-MM-dd HH:mm:ss') ?? null }))

            if (setErrors !== undefined) {
                setErrors((prev: any) => ({ ...prev, [name]: null }))
            }

            if (additionalFunction !== undefined) {
                additionalFunction()
            }
        },
        
        onCheck: (setStore: useStateType<any>, setErrors: useStateType<any> | undefined = undefined, additionalFunction: (() => void) | undefined = undefined) => (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            setStore((prev: any) => ({ ...prev, [event.target.name]: checked }))

            if (setErrors !== undefined) {
                setErrors((prev: any) => ({ ...prev, [event.target.name]: null }))
            }

            if (additionalFunction !== undefined) {
                additionalFunction()
            }
        },

        onChangeCard: (setStore: useStateType<any>, setErrors: useStateType<any> | undefined = undefined, additionalFunction: (() => void) | undefined = undefined) => (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.name === 'card_number') {
                setStore((prev: any) => ({ ...prev, card_number: payment.formatCreditCardNumber(event.target.value, Payment)  }))
            } else if (event.target.name === 'expiration') {
                setStore((prev: any) => ({ ...prev, expiration: payment.formatExpirationDate(event.target.value)  }))
            } else if (event.target.name === 'cvc') {
                setStore((prev: any) => ({ ...prev, cvc: payment.formatCVC(event.target.value, prev.card_number, Payment)  }))
            } else {
                setStore((prev: any) => ({ ...prev, [event.target.name]: event.target.value  }))
            }

            if (setErrors !== undefined) {
                setErrors((prev: any) => ({ ...prev, [event.target.name]: null }))
            }

            if (additionalFunction !== undefined) {
                additionalFunction()
            }
        },
    }
}