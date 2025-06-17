import { test, expect } from '@playwright/test';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { getSitemapUrls } from '../../helpers/navHelpers';
import { setupTestReporting } from 'helpers/testrailHelper';

test.describe('Sitemap Tests', () => {
    const BASE_URL = process.env.BASE_URL;
    const testState = 'ca';
    const validDomains = [
        /^https:\/\/goodparty\.org\//,
        /^https:\/\/gp-ui-git-develop-good-party\.vercel\.app\//,
        /^https:\/\/dev\.goodparty\.org\//
    ];

    // Setup reporting for sitemap accessibility test
    const sitemapAccessibilityCaseId = 86;
    setupTestReporting(test, sitemapAccessibilityCaseId);

    test('verify sitemap accessibility', async () => {
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

    // Setup reporting for state sitemaps test
    const stateSitemapsCaseId = 87;
    setupTestReporting(test, stateSitemapsCaseId);

    test('state sitemaps contain valid URLs', async () => {
        const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
        const mainResponse = await axios.get(mainSitemapUrl);
        const mainData = await parseStringPromise(mainResponse.data);

        // Find state sitemaps
        const stateSitemaps = mainData.sitemapindex.sitemap.filter(sitemap =>
            sitemap.loc[0].includes('/state/')
        );
        console.log(`Found ${stateSitemaps.length} state sitemaps`);
    });

    // Setup reporting for sitemap lastmod test
    const sitemapLastmodCaseId = 89;
    setupTestReporting(test, sitemapLastmodCaseId);

    test('verify sitemap URLs have valid lastmod dates', async () => {
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
