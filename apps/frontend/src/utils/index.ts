

export const priceFormat = (price: number): string => {
    return price
        .toFixed(2) // Ensures two decimal places
        .replace('.', ',') // Convert decimal point to comma
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add dot as thousands separator
};
