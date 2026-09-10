import { readFileSync } from 'node:fs';
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

// Thứ tự và nhãn sidebar sống cạnh content trong alp-code, không ở đây. `npm run fetch:docs`
// kéo cả hai về; nó chạy qua `prebuild`/`predev` nên file này luôn có sẵn khi Astro đọc config.
// Fail to ở đây là cố ý: build với sidebar rỗng sẽ ra một site trông như đã mất hết trang.
const sidebarManifest = JSON.parse(
  readFileSync(new URL('./src/generated/sidebar.json', import.meta.url), 'utf8'),
);

const sidebar = sidebarManifest.groups.map((group) => ({
  label: group.label,
  items: group.items.map((item) => ({
    label: item.label,
    slug: item.path ? `docs/${item.path}` : 'docs',
  })),
}));

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
      sidebar,
    }),
  ],
});
