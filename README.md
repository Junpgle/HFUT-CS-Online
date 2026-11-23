# 📚 HFUT-CS-Online

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-a259ff?logo=vite&logoColor=white)
![Online](https://img.shields.io/badge/🌐_在线访问-saltgardenia.github.io-0969da)

> 🎓 汇总合肥工业大学计算机与信息学院的在线课程资料。

## ❤️ 致谢

本项目整理自以下 4 个开源资料仓库：

- [sunmiao0301/HFUT-CS](https://github.com/sunmiao0301/HFUT-CS)
- [mox-hub/hfut-cs](https://github.com/mox-hub/hfut-cs)
- [styitches/HFUT-CS](https://github.com/styitches/HFUT-CS)
- [Tuning-Luna/HFUT_XC_Study_Things](https://github.com/Tuning-Luna/HFUT_XC_Study_Things)

> 以上仓库仅作资料溯源，未以子模块形式挂在本仓库：本仓库可以直接 `git clone`，约 50MB，克隆与构建都不需要它们。

## 📂 资料结构

- `data/`：4 个上游仓库整理出的课程资料（课件 / 试题 / 附件），仅本地、不入库。
- `补充资料/`：本站自有的补充资料（上游没有的新课课件、近年试卷等），随本仓库入库，附件页可直接下载；收录细则见 [补充资料/README.md](补充资料/README.md)。

## 🔐 账号与同步（可选）

站点默认是纯本地游客模式（localStorage）。配置 Supabase 后，顶栏出现「登录」，收藏、最近查看与答题进度可在多设备间同步；未配置时账号入口自动隐藏，不影响现有功能。

- 架构、冲突规则与完整操作清单见 [docs/supabase-sync.md](docs/supabase-sync.md)
- 数据库脚本见 [supabase/schema.sql](supabase/schema.sql)
- 本地联调：复制 [.env.example](.env.example) 为 `.env.local` 并填入 Project URL 与 Publishable Key
