# 站点架构 —— 多课程资料库

> 2026-11 起，本仓库从「算法设计与分析单课程站点」升级为「合工大计算机多课程资料库」。
> 现有 8 讲复习手册 + 在线练习整体平移到 `/algo` 子路由下，作为第一门已上线课程。

## 1. 分层模型

```
┌─ 站点层 ──────────────────────────────────────────────┐
│  /                  首页（课程目录）：各学期 → 各课程卡片 │
│  SiteHeader/SiteFooter 属于站点层，只有首页使用          │
├─ 课程层 ──────────────────────────────────────────────┤
│  /algo/*            算法设计与分析（已上线，自带 TopBar/侧栏）│
│  /course/:课程名/*   其余课程（占位页，后续逐门实现）        │
│  ★ 每门课自带导航栏与页面布局，互不继承，风格靠令牌统一    │
├─ 内容层 ──────────────────────────────────────────────┤
│  src/content/       算法课 deck 数据（scripts/migrate.mjs 生成）│
│  src/content/catalog.ts  课程目录数据（scripts/build-catalog.mjs 生成）│
├─ 资料层 ──────────────────────────────────────────────┤
│  data/    8210 份源文件（8 学期 × 课程 × 课件/试题/附件）│
│  补充资料/  本站自有补充资料，同契约，随仓库入库、可下载  │
│  不进站点打包；课程页通过 catalog 拿统计与路径            │
└──────────────────────────────────────────────────────┘
```

## 2. 数据流

```
data/ + 补充资料/  ──npm run catalog──▶  src/content/catalog.ts
（目录名 + 逐文件计数，两处按课程合并）      （学期 → 课程 → 课件/试题/附件计数）

src/courses/registry.ts   已实现课程的路由注册表（人工维护，唯一事实源）
                          ┌ name 与 catalog 课程同名 → 首页卡片标记「已上线」并链接 base
                          └ name 不在 catalog 中（如算法课，资料来自本仓库自建内容）
                              → 首页注入虚拟卡片到所属学期
```

- `catalog.ts` 由脚本生成、随提交入库，运行时零 IO；`predev` / `prebuild` 自动重跑，
  往 `data/` 或 `补充资料/` 里增删课程后刷新页面即可生效。
- 两个资料根的目录契约一致：同一门课按相对路径合并；补充资料中的文件溯源键为 `self`，
  附件页直接从本仓库 raw 下载（规则见 `补充资料/README.md`）。
- 课程页将来需要「某门课的文件浏览」时，扩展 build-catalog 逐课程输出文件清单 JSON，
  不反向依赖文件系统。

## 3. 路由契约（HashRouter）

| 路由 | 归属 | 说明 |
| --- | --- | --- |
| `/` | 站点层 | 课程目录首页 |
| `/algo` | 算法课 | 课程首页（原 `/` 的复习手册总目录） |
| `/algo/deck/:deckId` | 算法课 | 第 N 讲 |
| `/algo/practice` | 算法课 | 在线练习 |
| `/course/:课程名` | 通用占位 | 未实现课程的统一落地页（自带简易导航） |
| `/deck/:id`、`/practice` | — | 旧链接 301 式重定向到 `/algo/*`，不删 |

注册表 `src/courses/registry.ts` 每条记录：`{ id, name, semester, base, ready, source }`。
`base` 是该课程的路由前缀；课程内部路由一律相对（`deck/:deckId`），课程整体换前缀只改一行。

## 4. 课程布局契约（每门课自带导航）

- 课程根组件（如 `src/courses/AlgorithmCourse.tsx`）渲染**完整的一屏**：
  自己的导航栏 + 正文 + 页脚，不依赖也不渲染站点层组件。
- 统一性来自共享的 `styles/tokens.css`（颜色/字体/圆角/阴影/动效曲线）与
  `styles/base.css` 的通用基类（`.icon-btn`、`.material`、`.page` 等）；
  课程私有样式放独立文件（如 `styles/hub.css`），不塞进全局表。
- 主题切换（亮/暗）在 `lib/theme`（html[data-theme]），全站生效，任何导航栏都可调用。
- 课程根组件用 `React.lazy` 挂到 App 的 Routes 上，首屏只加载首页代码。

## 5. 新增一门已上线课程的步骤

1. 在 `src/courses/` 新建 `<courseId>.tsx`：根组件 + 该课导航栏 + 内部路由（相对路径）；
   私有样式加 `styles/<courseId>.css`。
2. 在 `src/courses/registry.ts` 增加一条记录（name 取 `data/` 里的课程目录名，
   学期填对应文件夹名）。
3. App.tsx 的 Routes 里给该课程加一条懒加载路由（或用 registry 统一 map）。
4. `npm run catalog`（predev/prebuild 会自动跑）让首页卡片显示最新统计。

仅补充资料（不写页面）时只需第 4 步——首页卡片数字会自动更新。

## 6. 目录速览

```
src/
├── App.tsx                  # 仅 Routes + 懒加载 + 旧链接重定向
├── pages/
│   ├── CourseHubPage.tsx    # 首页（站点层）
│   ├── CourseStubPage.tsx   # 未实现课程占位（自带简易导航）
│   ├── HomePage.tsx         # 算法课课程首页（原站点首页）
│   ├── DeckPage.tsx         # 算法课第 N 讲
│   └── PracticePage.tsx     # 算法课在线练习
├── courses/
│   ├── registry.ts          # 课程注册表（唯一事实源）
│   └── AlgorithmCourse.tsx  # 算法课根：TopBar+Sidebar+内部转场+子路由
├── content/
│   ├── catalog.ts           # 【生成】课程目录数据
│   └── deck1..8.ts 等       # 【生成】算法课内容数据
├── styles/
│   ├── tokens.css           # 设计令牌（全站唯一取色处）
│   ├── base.css             # 重置 + 算法课样式 + 通用基类
│   └── hub.css              # 首页 + 占位页样式
└── components/              # 算法课组件为主；SiteHeader/SiteFooter 属站点层
```

## 7. 约束与已知取舍

- **资料文件不进站点构建**：8.4GB 的 `data/` 只作为内容事实源被脚本扫描；
  将来做「课程资料浏览页」时再按需引入（dev 可用 Vite 插件挂静态目录，部署另行评估体积）。
- 算法课的物理目录（`src/content`、`src/components`、`src/pages`）暂未搬进
  `src/courses/algorithm-design/`：内容文件由 migrate.mjs 生成、组件与三个页面耦合较深，
  搬迁收益放后续专门一次做（见第 5 节第 1 步的自然时机）。
- 公共课与杂项在首页按「非学期课程」分组呈现，不发虚拟课程页。
