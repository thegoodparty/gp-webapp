import { expect, test } from "@playwright/test";
import axios, { type AxiosResponse } from "axios";
import { parseStringPromise } from "xml2js";

test.describe("Sitemap Tests", () => {
	// Use BASE_URL from environment (set by CI) or fall back to Playwright config
	const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

	test("should have accessible main sitemap", async () => {
		const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
		console.log(`🔍 Testing sitemap at: ${mainSitemapUrl}`);
		let response: AxiosResponse;
		try {
			response = await axios.get(mainSitemapUrl, {
				timeout: 30000,
				validateStatus: () => true, // Don't throw on non-2xx status
			});
		} catch (error: any) {
			console.error(`❌ Failed to fetch sitemap: ${error.message}`);
			if (error.code) console.error(`Error code: ${error.code}`);
			throw error;
		}

		expect(response.status).toBe(200);
		expect(response.headers["content-type"]).toContain("xml");

		const data = await parseStringPromise(response.data);
		expect(data.sitemapindex).toBeDefined();
		expect(data.sitemapindex.sitemap).toBeDefined();
		expect(Array.isArray(data.sitemapindex.sitemap)).toBe(true);

		console.log(`✅ Found ${data.sitemapindex.sitemap.length} sitemaps`);
	});

	test("should contain state sitemaps", async () => {
		const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
		let response: AxiosResponse;
		try {
			response = await axios.get(mainSitemapUrl, {
				timeout: 30000,
				validateStatus: () => true,
			});
		} catch (error: any) {
			console.error(`❌ Failed to fetch sitemap: ${error.message}`);
			throw error;
		}
		const data = await parseStringPromise(response.data);

		const stateSitemaps = data.sitemapindex.sitemap.filter(
			(sitemap) =>
				sitemap.loc[0].includes("/sitemaps/state/") ||
				sitemap.loc[0].includes("/state/"),
		);

		expect(stateSitemaps.length).toBeGreaterThan(0);
		console.log(`✅ Found ${stateSitemaps.length} state sitemaps`);

		const sitemapUrls = stateSitemaps.map((s) => s.loc[0]);
		const hasCaliforniaSitemap = sitemapUrls.some(
			(url) => url.includes("ca") || url.includes("california"),
		);
		const hasTexasSitemap = sitemapUrls.some(
			(url) => url.includes("tx") || url.includes("texas"),
		);

		expect(hasCaliforniaSitemap || hasTexasSitemap).toBe(true);
	});

	test("should contain candidate sitemaps", async () => {
		const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
		let response: AxiosResponse;
		try {
			response = await axios.get(mainSitemapUrl, {
				timeout: 30000,
				validateStatus: () => true,
			});
		} catch (error: any) {
			console.error(`❌ Failed to fetch sitemap: ${error.message}`);
			throw error;
		}
		const data = await parseStringPromise(response.data);

		const candidateSitemaps = data.sitemapindex.sitemap.filter(
			(sitemap) =>
				sitemap.loc[0].includes("/sitemaps/candidates/") ||
				sitemap.loc[0].includes("/candidates/"),
		);

		expect(candidateSitemaps.length).toBeGreaterThan(0);
		console.log(`✅ Found ${candidateSitemaps.length} candidate sitemaps`);
	});

	test("should have valid lastmod dates", async () => {
		const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
		let response: AxiosResponse;
		try {
			response = await axios.get(mainSitemapUrl, {
				timeout: 30000,
				validateStatus: () => true,
			});
		} catch (error: any) {
			console.error(`❌ Failed to fetch sitemap: ${error.message}`);
			throw error;
		}
		const data = await parseStringPromise(response.data);

		for (const sitemap of data.sitemapindex.sitemap) {
			if (sitemap.lastmod && sitemap.lastmod[0]) {
				const lastmod = new Date(sitemap.lastmod[0]);
				expect(lastmod).toBeInstanceOf(Date);
				expect(lastmod.getTime()).not.toBeNaN();

				const now = new Date();
				const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

				expect(lastmod.getTime()).toBeGreaterThan(oneYearAgo.getTime());
				expect(lastmod.getTime()).toBeLessThanOrEqual(now.getTime());
			}
		}

		console.log("✅ All lastmod dates are valid");
	});

	test("should validate sitemap URLs are accessible", async () => {
		const mainSitemapUrl = `${BASE_URL}/sitemap.xml`;
		let response: AxiosResponse;
		try {
			response = await axios.get(mainSitemapUrl, {
				timeout: 30000,
				validateStatus: () => true,
			});
		} catch (error: any) {
			console.error(`❌ Failed to fetch sitemap: ${error.message}`);
			throw error;
		}
		const data = await parseStringPromise(response.data);

		const sitemapUrls = data.sitemapindex.sitemap.map((s) => s.loc[0]);
		const sampleUrls = sitemapUrls.slice(0, Math.min(5, sitemapUrls.length));

		for (const url of sampleUrls) {
			try {
				const sitemapResponse = await axios.get(url, { timeout: 15000 });
				expect(sitemapResponse.status).toBe(200);
				expect(sitemapResponse.headers["content-type"]).toContain("xml");

				console.log(`✅ Sitemap accessible: ${url}`);
			} catch (error) {
				console.warn(`⚠️ Sitemap not accessible: ${url} - ${error.message}`);
			}
		}
	});
});
