import FALLBACK_WINE from '../assets/fallback-wine.png';
import FALLBACK_BEER from '../assets/fallback-beer.png';
import FALLBACK_QUESOS from '../assets/fallback-quesos.png';
import FALLBACK_LICORS from '../assets/fallback-licors.png';
import FALLBACK_CHAMPAGNE from '../assets/fallback-champagne.png';
import FALLBACK_BEBIDAS from '../assets/fallback-bebidas.png';
import FALLBACK_ACEITES from '../assets/fallback-aceites.png';
import FALLBACK_DEFAULT from '../assets/place_holder.png';

const CHAMPAGNE_KEYWORDS = ['champagne', 'espumante', 'espumantes', 'sparkling'];
const ACEITES_KEYWORDS = ['aceite', 'aceites', 'oil', 'oils', 'oliva', 'olive'];
const BEBIDAS_KEYWORDS = ['bebida', 'bebidas', 'beverage', 'beverages', 'agua', 'aguas', 'soda', 'tonica', 'energizante', 'sidra'];
const WINE_KEYWORDS = ['wine', 'vino', 'vinos', 'malbec', 'tinto', 'blanco', 'rosado'];
const BEER_KEYWORDS = ['beer', 'cerveza', 'cervezas', 'ipa', 'lager', 'stout'];
const QUESOS_KEYWORDS = ['queso', 'quesos', 'cheese', 'cheeses'];
const LICORS_KEYWORDS = ['licor', 'licors', 'licores', 'liqueur', 'liqueurs', 'spirit', 'spirits', 'destilado', 'destilados'];

const matchesCategory = (category: string | undefined | null, keywords: string[]) => {
    if (!category) return false;
    const normalized = category.trim().toLowerCase();
    return keywords.some(
        (keyword) => normalized === keyword || normalized.includes(keyword),
    );
};

/**
 * Product image with category-aware fallback when `image` is empty.
 */
export const getProductImage = (
    image?: string | null,
    category?: string | null,
): string => {
    if (image?.trim()) {
        return image;
    }
    // More specific sparkling categories before generic wine.
    if (matchesCategory(category, CHAMPAGNE_KEYWORDS)) {
        return FALLBACK_CHAMPAGNE;
    }
    if (matchesCategory(category, ACEITES_KEYWORDS)) {
        return FALLBACK_ACEITES;
    }
    if (matchesCategory(category, BEBIDAS_KEYWORDS)) {
        return FALLBACK_BEBIDAS;
    }
    if (matchesCategory(category, WINE_KEYWORDS)) {
        return FALLBACK_WINE;
    }
    if (matchesCategory(category, BEER_KEYWORDS)) {
        return FALLBACK_BEER;
    }
    if (matchesCategory(category, QUESOS_KEYWORDS)) {
        return FALLBACK_QUESOS;
    }
    if (matchesCategory(category, LICORS_KEYWORDS)) {
        return FALLBACK_LICORS;
    }
    return FALLBACK_DEFAULT;
};
