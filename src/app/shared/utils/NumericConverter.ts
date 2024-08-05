export const numericConverter = (value: string | number | null | undefined): number => {
    if (!value) {
        return 0;
    }
    if (typeof value === 'number') {
        return value;
    }
    return parseFloat(value.replace(',', '.'));
}