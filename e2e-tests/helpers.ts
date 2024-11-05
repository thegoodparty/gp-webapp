export async function coreNav(page, navSelect) {
    const navCandidates = ['#nav-nav-campaign-tools', '#nav-nav-good-party-pro', '#nav-nav-get-demo', '#nav-nav-voter-data', '#nav-nav-template-library', '#nav-nav-tour', '#nav-nav-explore-offices'];
    const navVoters = ['#nav-nav-volunteer', '#nav-nav-find-candidates', '#nav-nav-info-session', '#nav-nav-get-stickers', '#nav-nav-discord'];
    const navResources = ['#nav-nav-blog', '#nav-nav-glossary'];
    if(navCandidates.includes(navSelect)) {
        await page.locator('#nav-candidates').click();
        await page.locator(navSelect).click();
    } else if(navVoters.includes(navSelect)) {
        await page.locator('#nav-voters').click();
        await page.locator(navSelect).click();
    } else if(navResources.includes(navSelect)) {
        await page.locator('#nav-resources').click();
        await page.locator(navSelect).click();
    } else {
        await page.locator(navSelect).click();
    }
}