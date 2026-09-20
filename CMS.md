# VictorySync website CMS

## Sign in

Open `https://www.victorysync.com/cms`. The browser first asks for the private CMS username and password. They are configured as sensitive `CMS_ADMIN_USER` and `CMS_ADMIN_PASSWORD` variables in the Vercel project for both Preview and Production. The deployment fails closed for this route if either is missing. Do not share these credentials.

After the browser prompt, connect with a GitHub fine grained personal access token created by the `adamkamelmahgoub` account. Grant it access only to `adamkamelmahgoub/victorysyncllc` with **Contents: Read and write**. The CMS checks the GitHub user ID as well as repository write access. A different GitHub user's token cannot connect through the editor. The token remains in memory for the current tab only. Revoke it in GitHub settings if it is lost.

The CMS password is stored in `.local/cms-private-credentials.json` in the project workspace on the owner's computer. That directory is ignored by Git. Store a copy in a password manager before deleting the local file. Changing the Vercel environment variables requires a new deployment. For password rotation, create a new strong random password in Vercel Preview and Production and redeploy.

## Edit and publish

Choose a page from the left, then click an element in the preview. Hold **Alt** while clicking to select its exact container. The Content tab edits each direct text node, image source and alt text, link URL, CSS styles, CSS classes, supported HTML attributes, and visibility. This includes navigation and footer elements shared across pages. The editor lists all current site routes, including login, signup, checkout, and dashboard.

The Sections tab adds, edits, reorders, and removes additional page sections below the existing page content. The SEO tab edits page title and description. The Media tab uploads images and sets the selected image URL. A draft is saved in this browser's local storage until it is published or discarded.

**Publish changes** commits `client/public/cms/content.json` to `main`. Vercel builds the site again. The prerender step applies published edits to marketing pages so they appear in raw HTML. GitHub file history provides earlier versions. The CMS checks the file SHA and refuses to overwrite another editor's changes.

## Scope

The visual editor covers rendered elements on the listed pages. It cannot create a new React component, change application logic, add a new form field that the server processes, or alter checkout behavior; those changes still require code. DOM selector keys can change after a substantial layout code change, so review published edits after such changes. The `/cms` and `/cms.html` routes are protected by Vercel middleware and excluded from search indexing. Published CMS content remains public so the website can display it.
