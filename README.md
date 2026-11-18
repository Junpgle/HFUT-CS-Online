# HFUT-CS-Online

#HFUT-CS-Online：合肥工业大学计算机专业课程资料站点。包含两块内容：

1. **课程目录首页（`/#/`）**——8 个学期 64 门课程的课件、期末试题与附件统计（8210 份文件），
   整理自 [sunmiao0301/HFUT-CS](https://github.com/sunmiao0301/HFUT-CS)、
   [mox-hub/hfut-cs](https://github.com/mox-hub/hfut-cs)、
   [styitches/HFUT-CS](https://github.com/styitches/HFUT-CS)、
   [Tuning-Luna/HFUT_XC_Study_Things](https://github.com/Tuning-Luna/HFUT_XC_Study_Things)
   四个开源仓库（合并规则见 `data/整理说明.md`）。
2. **《算法设计与分析》课程（`/#/algo`）**——依据课程 PPT 整理的八讲核心考点手册、
   24 个交互式算法动画与 420 题在线练习。

## 开发

```bash
npm install
npm run dev        # predev 自动重建课程目录数据
npm run catalog    # 手动重建 src/content/catalog.ts（扫描 data/）
npm run test       # vitest
npm run build      # 产物部署在 GitHub Pages 项目站点
```

## 架构

站点层（首页）/ 课程层（每门课自带导航栏与子路由）/ 内容层 / 资料层的分层说明、
新增课程与新增资料的步骤，见 **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**。

- 课程注册表（唯一事实源）：`src/courses/registry.ts`
- 课程目录数据（脚本生成）：`src/content/catalog.ts`
- 资料事实源：`data/`（不进 git，不参与打包）
