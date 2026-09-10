import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const githubRepository = process.env.GITHUB_REPOSITORY?.split('/');
const isGitHubPagesBuild = process.env.DEPLOY_TARGET === 'github-pages';
const deploymentSite = process.env.DEPLOY_SITE;
const [githubOwner, githubRepo] = githubRepository ?? [];
const isUserOrOrganizationPage =
  githubOwner && githubRepo?.toLowerCase() === `${githubOwner.toLowerCase()}.github.io`;

const githubPages =
  isGitHubPagesBuild && deploymentSite
    ? {
        site: deploymentSite,
        base: '/',
      }
    : isGitHubPagesBuild && githubOwner && githubRepo
    ? {
        site: `https://${githubOwner}.github.io`,
        base: isUserOrOrganizationPage ? '/' : `/${githubRepo}`,
      }
    : {};
const docsRoot = githubPages.base && githubPages.base !== '/' ? `${githubPages.base}/docs/` : '/docs/';

export default defineConfig({
  ...githubPages,
  redirects: {
    '/': docsRoot,
  },
  integrations: [
    starlight({
      title: 'ALP Docs',
      description: 'Tài liệu ngắn gọn để xây dựng, vận hành và mở rộng ALP.',
      favicon: '/favicon.svg',
      logo: {
        dark: './src/assets/alp-wordmark-on-dark.svg',
        light: './src/assets/alp-wordmark-on-light.svg',
        alt: 'ALP',
        replacesTitle: true,
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Tiếng Việt',
          lang: 'vi',
        },
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Bắt đầu',
          items: [{ label: 'Giới thiệu', slug: 'docs' }],
        },
        {
          label: 'Hướng dẫn',
          items: [{ autogenerate: { directory: 'docs/guides' } }],
        },
      ],
    }),
  ],
});
