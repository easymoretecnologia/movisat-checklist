import { PaymentTypes } from "@/types/payment";

const clearNumber = (value: string): string => value.replace(/\D/g, '');

export const formatCVC = (value: string, cardNumber: string, Payment: PaymentTypes) => {
    const clearValue = clearNumber(value);
    const cardType = Payment.fns.cardType(cardNumber);
    const maxLength = cardType === 'amex' ? 4 : 3;

    return clearValue.slice(0, maxLength);
}

export const formatExpirationDate = (value: string): string => {
    const finalValue = value
    .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // 3 > 03/
    .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 > 11/
    .replace(/^([0-1])([3-9])$/g, '0$1/$4') // 13 > 01/3
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$4') // 141 > 01/41
    .replace(/^([0]+)\/|[0]+$/g, '0') // 0/ > 0 and 00 > 0
    // To allow only digits and `/`
    .replace(/[^\d\/]|^[\/]*$/g, '')
    .replace(/\/\//g, '/'); // Prevent entering more than 1 `/`

    return finalValue;
}

export const formatCreditCardNumber = (value: string, Payment: PaymentTypes) => {
    if (!value) {
        return value;
    }

    const issuer = Payment.fns.cardType(value);
    const clearValue = clearNumber(value);
    let nextValue;

    switch (issuer) {
        case 'amex':
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`
            break
        case 'dinersclub':
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`
            break
        default:
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(12,19)}`
        break
    }

    return nextValue.trim();
}

export default {
    formatCVC,
    formatExpirationDate,
    formatCreditCardNumber,
}