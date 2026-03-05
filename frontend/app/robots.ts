import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/Admin/',
        },
        sitemap: 'https://poshakfabrics.org/sitemap.xml',
    }
}
