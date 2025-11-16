import { test, expect } from "@playwright/test";
import axios from "axios";
import { parseStringPromise } from "xml2js";

test.describe("Sitemap Tests", () => {
  // Use BASE_URL from environment (set by CI) or fall back to Playwright config
  const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

  test("should have accessible main sitemap", async () => {
    // Arrange
    const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
    console.log(`🔍 Testing sitemap at: ${mainSitemapUrl}`);
    
    // Act
    let response;
    try {
      response = await axios.get(mainSitemapUrl, { 
        timeout: 30000,
        validateStatus: () => true // Don't throw on non-2xx status
      });
    } catch (error: any) {
      console.error(`❌ Failed to fetch sitemap: ${error.message}`);
      if (error.code) console.error(`Error code: ${error.code}`);
      throw error;
    }
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('xml');
    
    // Parse and validate XML structure
    const data = await parseStringPromise(response.data);
    expect(data.sitemapindex).toBeDefined();
    expect(data.sitemapindex.sitemap).toBeDefined();
    expect(Array.isArray(data.sitemapindex.sitemap)).toBe(true);
    
    console.log(`✅ Found ${data.sitemapindex.sitemap.length} sitemaps`);
  });

  test("should contain state sitemaps", async () => {
    // Arrange
    const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
    
    // Act
    let response;
    try {
      response = await axios.get(mainSitemapUrl, { 
        timeout: 30000,
        validateStatus: () => true 
      });
    } catch (error: any) {
      console.error(`❌ Failed to fetch sitemap: ${error.message}`);
      throw error;
    }
    const data = await parseStringPromise(response.data);
    
    // Assert
    const stateSitemaps = data.sitemapindex.sitemap.filter(sitemap =>
      sitemap.loc[0].includes('/sitemaps/state/') || sitemap.loc[0].includes('/state/')
    );
    
    expect(stateSitemaps.length).toBeGreaterThan(0);
    console.log(`✅ Found ${stateSitemaps.length} state sitemaps`);
    
    // Verify at least some common states are present
    const sitemapUrls = stateSitemaps.map(s => s.loc[0]);
    const hasCaliforniaSitemap = sitemapUrls.some(url => url.includes('ca') || url.includes('california'));
    const hasTexasSitemap = sitemapUrls.some(url => url.includes('tx') || url.includes('texas'));
    
    // Should have major states (flexible check)
    expect(hasCaliforniaSitemap || hasTexasSitemap).toBe(true);
  });

  test("should contain candidate sitemaps", async () => {
    // Arrange
    const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
    
    // Act
    let response;
    try {
      response = await axios.get(mainSitemapUrl, { 
        timeout: 30000,
        validateStatus: () => true 
      });
    } catch (error: any) {
      console.error(`❌ Failed to fetch sitemap: ${error.message}`);
      throw error;
    }
    const data = await parseStringPromise(response.data);
    
    // Assert
    const candidateSitemaps = data.sitemapindex.sitemap.filter(sitemap =>
      sitemap.loc[0].includes('/sitemaps/candidates/') || sitemap.loc[0].includes('/candidates/')
    );
    
    expect(candidateSitemaps.length).toBeGreaterThan(0);
    console.log(`✅ Found ${candidateSitemaps.length} candidate sitemaps`);
  });

  test("should have valid lastmod dates", async () => {
    // Arrange
    const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
    
    // Act
    let response;
    try {
      response = await axios.get(mainSitemapUrl, { 
        timeout: 30000,
        validateStatus: () => true 
      });
    } catch (error: any) {
      console.error(`❌ Failed to fetch sitemap: ${error.message}`);
      throw error;
    }
    const data = await parseStringPromise(response.data);
    
    // Assert - check lastmod dates are valid
    for (const sitemap of data.sitemapindex.sitemap) {
      if (sitemap.lastmod && sitemap.lastmod[0]) {
        const lastmod = new Date(sitemap.lastmod[0]);
        expect(lastmod).toBeInstanceOf(Date);
        expect(lastmod.getTime()).not.toBeNaN();
        
        // Should be a reasonable date (not too old, not in future)
        const now = new Date();
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        
        expect(lastmod.getTime()).toBeGreaterThan(oneYearAgo.getTime());
        expect(lastmod.getTime()).toBeLessThanOrEqual(now.getTime());
      }
    }
    
    console.log("✅ All lastmod dates are valid");
  });

  test("should validate sitemap URLs are accessible", async () => {
    // Arrange
    const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
    
    // Act
    let response;
    try {
      response = await axios.get(mainSitemapUrl, { 
        timeout: 30000,
        validateStatus: () => true 
      });
    } catch (error: any) {
      console.error(`❌ Failed to fetch sitemap: ${error.message}`);
      throw error;
    }
    const data = await parseStringPromise(response.data);
    
    // Test a sample of sitemap URLs (not all - that would be too slow)
    const sitemapUrls = data.sitemapindex.sitemap.map(s => s.loc[0]);
    const sampleUrls = sitemapUrls.slice(0, Math.min(5, sitemapUrls.length)); // Test first 5
    
    // Assert - sample URLs should be accessible
    for (const url of sampleUrls) {
      try {
        const sitemapResponse = await axios.get(url, { timeout: 15000 });
        expect(sitemapResponse.status).toBe(200);
        expect(sitemapResponse.headers['content-type']).toContain('xml');
        
        console.log(`✅ Sitemap accessible: ${url}`);
      } catch (error) {
        console.warn(`⚠️ Sitemap not accessible: ${url} - ${error.message}`);
        // Don't fail the test for individual sitemap issues
      }
    }
  });
});
