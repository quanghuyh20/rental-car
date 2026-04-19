import type { Locale } from './translations';

export const PATHS = {
	home:    { vi: '/',            en: '/' },
	fleet:   { vi: '/xe',         en: '/car-rental' },
	about:   { vi: '/gioi-thieu', en: '/about' },
	contact: { vi: '/lien-he',    en: '/contact' },
} as const;

export type RouteKey = keyof typeof PATHS;

export function localePath(locale: Locale, key: RouteKey): string {
	const path = PATHS[key][locale];
	return locale === 'vi' ? path : `/en${path}`;
}

/** Given the current URL, return the equivalent URL in the other locale */
export function alternatePath(locale: Locale, routeKey: RouteKey): string {
	const other: Locale = locale === 'vi' ? 'en' : 'vi';
	return localePath(other, routeKey);
}
