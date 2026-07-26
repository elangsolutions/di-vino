import FALLBACK_WINE from '../assets/fallback-wine.png';
import FALLBACK_BEER from '../assets/fallback-beer.png';
import FALLBACK_DEFAULT from '../assets/place_holder.png';

const WINE_KEYWORDS = ['wine', 'vino', 'vinos', 'malbec', 'tinto', 'blanco', 'rosado', 'champagne', 'espumante'];
const BEER_KEYWORDS = ['beer', 'cerveza', 'cervezas', 'ipa', 'lager', 'stout'];

const matchesCategory = (category: string | undefined | null, keywords: string[]) => {
    if (!category) return false;
    const normalized = category.trim().toLowerCase();
    return keywords.some(
        (keyword) => normalized === keyword || normalized.includes(keyword),
    );
};

/**
 * Product image with category-aware fallback when `image` is empty:
 * wine-related categories → wine bottle, beer-related → beer, else generic placeholder.
 */
export const getProductImage = (
    image?: string | null,
    category?: string | null,
): string => {
    if (image?.trim()) {
        return image;
    }
    if (matchesCategory(category, WINE_KEYWORDS)) {
        return FALLBACK_WINE;
    }
    if (matchesCategory(category, BEER_KEYWORDS)) {
        return FALLBACK_BEER;
    }
    return FALLBACK_DEFAULT;
};
