export default {
    uuid: (separator: string = ''): string => {
        function generateRandomHex(length: number) {
            let result = ''
            const characters = '0123456789abcdef'
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length)
                result += characters.charAt(randomIndex)
            }
            return result
        }

        return `${generateRandomHex(8)}${separator}${generateRandomHex(4)}${separator}4${generateRandomHex(3)}${separator}${generateRandomHex(4)}${separator}${generateRandomHex(12)}`
    },

    randomColor: () => {
        var letters = '0123456789ABCDEF'
        var color = '#'
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    },

    getYears: (maxrange: number = 5, hasBefore: boolean = true): number[] => {
        const current = (new Date()).getFullYear()
        const arr = []
    
        if (hasBefore) {
            for (let i = (current - maxrange); i <= (current + maxrange); i++) {
                arr.push(i)
            }
        } else {
            for (let i = current; i <= (current + maxrange); i++) {
                arr.push(i)
            }
        }
    
        return arr
    }
}