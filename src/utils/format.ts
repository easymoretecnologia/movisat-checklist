function not < T > (a: readonly T[], b: readonly T[], equals ? : (x: T, y: T) => boolean): T[] {
    if (equals) {
        return a.filter((value) => !b.some((bValue) => equals(value, bValue)));
    } else {
        return a.filter((value) => !b.includes(value));
    }
}

function intersection < T > (a: readonly T[], b: readonly T[], equals ? : (x: T, y: T) => boolean): T[] {
    if (equals) {
        return a.filter((value) => b.some((bValue) => equals(value, bValue)));
    } else {
        return a.filter((value) => b.includes(value));
    }
}

function union < T > (a: readonly T[], b: readonly T[], equals ? : (x: T, y: T) => boolean): T[] {
    if (equals) {
        return [...a, ...not(b, a, equals)];
    } else {
        return [...a, ...not(b, a)];
    }
}

// array sum field or value
function sum < T > (array: T[] = [], field: string = ''): number {
    return array.reduce((acc: number, obj: any) => {
        if (typeof obj === 'object') {
            const value = obj[field]

            if (typeof value === 'number') {
                return acc + value
            } else if (typeof value === 'string' && !isNaN(Number(value))) {
                return acc + Number(value)
            }
        } else if (typeof obj === 'number') {
            return acc + obj
        } else if (typeof obj === 'string' && !isNaN(Number(obj))) {
            return acc + Number(obj)
        }
        
        return acc
    }, 0)
}

export default {
    
    money: (amount: number, currency: string = 'BRL', digit: number = 2) => {
        if (amount === null || amount === undefined) {
            amount = 0.0;
        }

        return amount.toLocaleString(currency === 'BRL' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency, minimumFractionDigits: digit, maximumFractionDigits: digit });
    },

    percentage: (amount: number | null | undefined, digit: number = 2) => {
        if (amount === null || amount === undefined) {
            amount = 0.0;
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: digit,
            maximumFractionDigits: digit,
        }).format(amount / 100);
    },

    formatBytes: (bytes: number, decimals: number = 2): string => {
        if (!+bytes) return '0 bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },

    fileSize: (size: number): string => {
        var symbol = 'bytes';
        var exp = 0;

        while (size >= 1024) {
            size = size / 1024;
            exp++;
        }

        switch (exp) {
            case 0: symbol = 'bytes'; break;
            case 1: symbol = 'KB'; break;
            case 2: symbol = 'MB'; break;
            case 3: symbol = 'GB'; break;
            case 4: symbol = 'TB'; break;
        }

        return `${size.toFixed(2)} ${symbol}`;
    },

    onlyNumbers: (value: string): string => {
        return value.replace(/[^0-9]/g, '');
    },

    not: not,

    intersection: intersection,

    union: union,

    sum: sum,

    addZeros: (value: number, length: number, direction: 'start' | 'end'): string => direction === 'start' ? value.toString().padStart(length.toString().length, '0') : value.toString().padEnd(length.toString().length, '0'),
}