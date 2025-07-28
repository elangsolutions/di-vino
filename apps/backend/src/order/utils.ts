

export const createOrderNumber = (): string => {
    const prefix = 'ORD';
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random

    return `${prefix}-${yyyy}${mm}${dd}-${hh}${mi}${ss}-${random}`;
};
