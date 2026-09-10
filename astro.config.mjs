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
          items: [
            { label: 'Giới thiệu', slug: 'docs' },
            { label: 'Cài đặt', slug: 'docs/getting-started/installation' },
            { label: 'Bắt đầu nhanh', slug: 'docs/getting-started/quickstart' },
          ],
        },
        {
          label: 'Khái niệm',
          items: [
            { label: 'ALP hoạt động thế nào', slug: 'docs/concepts/how-alp-works' },
            { label: 'Nấc và runtime', slug: 'docs/concepts/modes-and-runtimes' },
            { label: 'Agent và quyền', slug: 'docs/concepts/agents-and-authority' },
          ],
        },
        {
          label: 'Hướng dẫn',
          items: [
            { label: 'Thiết lập project', slug: 'docs/guides/project-setup' },
            { label: 'Giao việc', slug: 'docs/guides/delegation' },
            { label: 'Memory và continuity', slug: 'docs/guides/memory-and-continuity' },
            { label: 'Custom agent (preview)', slug: 'docs/guides/custom-agents' },
            { label: 'Skill của project (preview)', slug: 'docs/guides/project-skills' },
          ],
        },
        {
          label: 'Tham chiếu',
          items: [
            { label: 'CLI', slug: 'docs/reference/cli' },
            { label: 'Xử lý sự cố', slug: 'docs/reference/troubleshooting' },
          ],
        },
      ],
    }),
  ],
});
