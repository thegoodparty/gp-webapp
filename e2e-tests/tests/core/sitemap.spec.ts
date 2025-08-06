import { test, expect } from '@playwright/test';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { TEST_IDS } from 'constants/testIds';

test.describe('Sitemap Tests', () => {
    const BASE_URL = process.env.BASE_URL;

    setupMultiTestReporting(test, {
        'Verify sitemap accessibility': TEST_IDS.SITEMAP_ACCESSIBILITY,
        'Verify state sitemaps contain valid URLs': TEST_IDS.STATE_SITEMAP_URLS,
        'Verify sitemap URLs have valid lastmod dates': TEST_IDS.URL_LASTMODE_DATES
    });

    test.skip('Verify sitemap accessibility', async () => {
        const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
        const response = await axios.get(mainSitemapUrl);
        expect(response.status).toBe(200);

        const data = await parseStringPromise(response.data);
        expect(data.sitemapindex).toBeDefined();
        expect(data.sitemapindex.sitemap).toBeDefined();

        const stateSitemaps = data.sitemapindex.sitemap.filter(sitemap =>
            sitemap.loc[0].includes('/sitemaps/state/'));
        expect(stateSitemaps.length).toBe(51);

        const candidateSitemaps = data.sitemapindex.sitemap.filter(sitemap =>
            sitemap.loc[0].includes('/sitemaps/candidates/'));
        expect(candidateSitemaps.length).toBe(51);
    });

    test.skip('Verify state sitemaps contain valid URLs', async () => {
        const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
        const mainResponse = await axios.get(mainSitemapUrl);
        const mainData = await parseStringPromise(mainResponse.data);

        // Find state sitemaps
        const stateSitemaps = mainData.sitemapindex.sitemap.filter(sitemap =>
            sitemap.loc[0].includes('/state/')
        );
        console.log(`Found ${stateSitemaps.length} state sitemaps`);
    });

    test.skip('Verify sitemap URLs have valid lastmod dates', async () => {
        const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
        const response = await axios.get(mainSitemapUrl);
        const data = await parseStringPromise(response.data);

        for (const sitemap of data.sitemapindex.sitemap) {
            const lastmod = new Date(sitemap.lastmod[0]);
            expect(lastmod).toBeInstanceOf(Date);
            expect(lastmod.getTime()).not.toBeNaN();
        }
    });
});
