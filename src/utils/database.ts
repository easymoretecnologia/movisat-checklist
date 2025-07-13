export default {
    where (value: any, operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'not like' | 'between' | 'not between' | 'is null' | 'is not null', field: string, haystack: string[]): string[] {
        if (value) {
            haystack.push(`${field} ${operator.toUpperCase()} ${value}`)
        }

        return haystack
    },

    rawWhere (value: string, haystack: string[]): string[] {
        if (value && typeof value === 'string' && value.trim() !== '') {
            haystack.push(`(${value})`)
        }

        return haystack
    },

    whereIn (value: any, field: string, haystack: string[]): string[] {
        if (value && typeof value === 'object' && value.constructor === Array && value.length > 0) {
            haystack.push(`${field} IN (${value.join(',')})`)
        }

        return haystack
    },

    whereLike (value: any, field: string, haystack: string[]): string[] {
        if (value) {
            haystack.push(`${field} LIKE '%${value}%'`)
        }

        return haystack
    },

    whereBetween (value: any, field: string, haystack: string[]): string[] {
        if (value && typeof value === 'object' && value.constructor === Array && value.length > 0) {
            haystack.push(`${field} BETWEEN ${value[0]} AND ${value[1]}`)
        }

        return haystack
    },

    whereNotIn (value: any, field: string, haystack: string[]): string[] {
        if (value && typeof value === 'object' && value.constructor === Array && value.length > 0) {
            haystack.push(`${field} NOT IN (${value.join(',')})`)
        }

        return haystack
    },

    whereNotLike (value: any, field: string, haystack: string[]): string[] {
        if (value) {
            haystack.push(`${field} NOT LIKE '%${value}%'`)
        }

        return haystack
    },

    whereNotBetween (value: any, field: string, haystack: string[]): string[] {
        if (value && typeof value === 'object' && value.constructor === Array && value.length > 0) {
            haystack.push(`${field} NOT BETWEEN ${value[0]} AND ${value[1]}`)
        }

        return haystack
    },

    whereNull (field: string, haystack: string[]): string[] {
        haystack.push(`${field} IS NULL`)

        return haystack
    },

    whereNotNull (field: string, haystack: string[]): string[] {
        haystack.push(`${field} IS NOT NULL`)

        return haystack
    }
}