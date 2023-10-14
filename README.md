# Install Log
```bash
# nuxt3
npx nuxi@latest init <project-name>
yarn install

# vuetify
yarn add -D vuetify vite-plugin-vuetify
yarn add @mdi/font


```

# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


================
멍청로그
```js
// definedProps에 타입 멍청하게 씀
defineProps<IWidget[]>();
defineProps<{ widgetList: IWidget[] }>();
```
```md
! vue-grid-layout Nuxt3에 집어넣어보자
1. document is not defined
 > nuxt에서 브라우저 정보가 없을 떄 실행해서 생김
nuxt.config.ts 로 mode 옵션 주어서 해결!
{
    plugins: [
        {src: '~/plugins/vue-grid-layout', mode: 'client'},
    ]
}
1. vue3용 이 있어서 교체.. https://github.com/xhlife/vue3-grid-layout
```