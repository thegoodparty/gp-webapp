import { test, expect } from '@playwright/test';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { getSitemapUrls } from '../../helpers/navHelpers';
import { addTestResult } from '@testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.describe('Sitemap Tests', () => {
  const BASE_URL = process.env.BASE_URL;
  const testState = 'ca';
  const validDomains = [
    /^https:\/\/goodparty\.org\//,
    /^https:\/\/gp-ui-git-develop-good-party\.vercel\.app\//,
    /^https:\/\/dev\.goodparty\.org\//
];
  
  test('verify sitemap accessibility', async () => {
    const caseId = 86;

    try {
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

        await addTestResult(runId, caseId, 1, "Test passed");
    } catch (error) {
        await addTestResult(
            runId,
            caseId,
            5,
            `Test failed: ${error.stack}`
        );
    }
  });

  test('state sitemaps contain valid URLs', async () => {
    const caseId = 87;

    try {
        const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
        const mainResponse = await axios.get(mainSitemapUrl);
        const mainData = await parseStringPromise(mainResponse.data);
        
        // Find state sitemaps and log them
        const stateSitemaps = mainData.sitemapindex.sitemap.filter(sitemap => 
            sitemap.loc[0].includes('/state/')
        );
        console.log(`Found ${stateSitemaps.length} state sitemaps`);
        
        const stateSitemap = mainData.sitemapindex.sitemap.find(sitemap => 
            sitemap.loc[0].includes(`/state/${testState}`)
        );
        
        const testSitemapUrl = stateSitemap.loc[0];
        const urls = await getSitemapUrls(testSitemapUrl);
        
        console.log(`Found ${urls.length} URLs in state sitemap`);
        console.log('Sample URLs:', urls.slice(0, 3));
        
        expect(urls.length).toBeGreaterThan(0);

        await addTestResult(runId, caseId, 1, "Test passed");
    } catch (error) {
        console.error('State sitemap test failed:', error);
        await addTestResult(
            runId,
            caseId,
            5,
            `Test failed: ${error.stack}`
        );
        throw error;
    }
  });

  test('verify sitemap URLs have valid lastmod dates', async () => {
    const caseId = 89;

    try {
        const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
        const response = await axios.get(mainSitemapUrl);
        const data = await parseStringPromise(response.data);
        
        for (const sitemap of data.sitemapindex.sitemap) {
            const lastmod = new Date(sitemap.lastmod[0]);
            expect(lastmod).toBeInstanceOf(Date);
            expect(lastmod.getTime()).not.toBeNaN();
        }
        await addTestResult(runId, caseId, 1, "Test passed");
    } catch (error) {
        await addTestResult(
            runId,
            caseId,
            5,
            `Test failed: ${error.stack}`
        );
    }
  });
});
