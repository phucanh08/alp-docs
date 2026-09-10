import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const githubRepository = process.env.GITHUB_REPOSITORY?.split('/');
const isGitHubPagesBuild = process.env.DEPLOY_TARGET === 'github-pages';
const [githubOwner, githubRepo] = githubRepository ?? [];
const isUserOrOrganizationPage =
  githubOwner && githubRepo?.toLowerCase() === `${githubOwner.toLowerCase()}.github.io`;

const githubPages =
  isGitHubPagesBuild && githubOwner && githubRepo
    ? {
        site: `https://${githubOwner}.github.io`,
        base: isUserOrOrganizationPage ? '/' : `/${githubRepo}`,
      }
    : {};

export default defineConfig({
  ...githubPages,
  integrations: [
    starlight({
      title: 'ALP Docs',
      description: 'Tài liệu ngắn gọn để xây dựng, vận hành và mở rộng ALP.',
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
          items: [{ label: 'Tổng quan', slug: 'index' }],
        },
        {
          label: 'Hướng dẫn',
          items: [{ autogenerate: { directory: 'guides' } }],
        },
      ],
    }),
  ],
});
