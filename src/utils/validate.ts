export default {
    isFloat: (number: number): boolean => typeof number === 'number' && number % 1 !== 0,
    isPromise:<T = any> (value: any): value is Promise<T> => typeof value === 'object' && value !== null && typeof value.then === 'function',
    isUrl: (str: string): boolean => /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/.test(str),
    has: (haystack: any[], needle: any): boolean => haystack.includes(needle),
    hasBrackets: (str: string) => /\[[^\]]*\]/.test(str),
    isCNPJ: (cnpj: string): string | undefined => {
        if (!cnpj) return "CNPJ é obrigatório.";

        // Remove non-numeric characters
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj.length !== 14) return "CNPJ inválido.";

        // Eliminate known invalid CNPJs
        if (/^(\d)\1+$/.test(cnpj)) return "CNPJ inválido.";

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return "CNPJ inválido.";

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1))) return "CNPJ inválido.";

        return undefined;
    },
    isCPF: (cpf: string): string | undefined => {
        if (!cpf) return "CPF é obrigatório.";

        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf.length !== 11) return "CPF inválido.";
        
    }
}