# @face-project/ui

Face Project 的 React 组件库，基于 Vite + TypeScript 构建，支持按需加载与 Storybook 文档与演示。

## 特性

- **按需加载**：支持从主入口按需引入（依赖打包器 Tree Shaking），或从子路径直接引用单个组件，减小产物体积。
- **Storybook**：内置 Storybook，可本地浏览、调试所有组件并查看文档。
- **TypeScript**：完整类型定义，构建产出 `.d.ts`。
- **样式**：组件自带 CSS，通过 `sideEffects` 标注，便于按需引入样式。

## 安装

```bash
npm install @face-project/ui
# 或
pnpm add @face-project/ui
# 或
yarn add @face-project/ui
```

依赖 React 18+，请确保项目已安装 `react` 与 `react-dom`。

## 使用

### 方式一：全量引入（适合快速接入）

```tsx
import { Button } from '@face-project/ui'
import '@face-project/ui/dist/ui.css'

function App() {
  return <Button variant="primary">确定</Button>
}
```

### 方式二：按需加载（推荐）

从子路径只引入用到的组件，打包体积更小：

```tsx
import { Button } from '@face-project/ui/Button'
import '@face-project/ui/dist/ui.css'

function App() {
  return (
    <>
      <Button variant="primary">主要</Button>
      <Button variant="outline">描边</Button>
    </>
  )
}
```

或从主入口引入，依靠支持 Tree Shaking 的打包器（如 Vite、Webpack）自动按需打包：

```tsx
import { Button } from '@face-project/ui'
```

## 开发与文档

```bash
# 安装依赖
pnpm install

# 启动 Storybook（默认 http://localhost:6007）
pnpm storybook

# 构建组件库
pnpm build

# 构建 Storybook 静态站点
pnpm build-storybook
```

## 组件示例：Button

| 属性       | 说明           | 类型                                      | 默认值   |
| ---------- | -------------- | ----------------------------------------- | -------- |
| variant    | 视觉变体       | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` |
| size       | 尺寸           | `'sm' \| 'md' \| 'lg'`                     | `'md'`   |
| block      | 是否块级       | `boolean`                                 | `false`  |
| loading    | 是否加载中     | `boolean`                                 | `false`  |
| disabled   | 是否禁用       | `boolean`                                 | -        |

除上表外，支持原生 `<button>` 的其余属性（如 `onClick`、`type`、`className` 等）。

```tsx
import { Button } from '@face-project/ui/Button'
import '@face-project/ui/dist/ui.css'

<Button variant="primary" size="lg">提交</Button>
<Button variant="outline" loading>加载中</Button>
<Button variant="danger" disabled>删除</Button>
```

在项目根目录执行 `pnpm storybook` 可查看所有 Button 的交互示例与文档。

## 项目结构

```
component-library/
├── src/
│   ├── index.ts          # 主入口，统一导出
│   └── Button/
│       ├── index.ts
│       ├── Button.tsx
│       └── Button.css
├── stories/
│   └── Button.stories.tsx # Button 的 Storybook 示例
├── .storybook/           # Storybook 配置
├── vite.config.ts        # 库构建（ESM + CJS，preserveModules）
├── tsconfig.json
├── tsconfig.build.json   # 仅生成 .d.ts
└── package.json
```

## 技术说明

- **构建**：Vite 库模式，`preserveModules: true` 保留模块结构，便于按路径引用与 Tree Shaking。
- **导出**：`package.json` 的 `exports` 提供主入口与 `Button` 子路径，支持 `import ... from '@face-project/ui/Button'`。
- **样式**：`sideEffects` 包含 `**/*.css`，打包器会按实际引用保留样式，避免未使用组件的样式被打包。

## License

MIT
