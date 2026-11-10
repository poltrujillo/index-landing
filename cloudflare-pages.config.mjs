// Repository deployment contract. Apply these settings to the Git-integrated
// Pages project; this file does not create a project or change DNS by itself.
export default {
  repository: 'https://github.com/poltrujillo/index-landing.git',
  productionBranch: 'main',
  previewBranch: 'draft-preview',
  buildCommand: 'npm run build:cloudflare',
  outputDirectory: 'dist',
  nodeVersion: '22',
  // Populate only with the project actually created in the Cloudflare account.
  projectName: 'index-landing-3yn',
};
