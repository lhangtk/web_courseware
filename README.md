# 前端核心概念与原理解析

一个基于 Vite 的前端课程课件项目，用于展示《前端核心概念与原理解析》的课程内容。

项目当前包含：课程落地页、课程详情页、分页讲稿式展示、全屏/翻页控制，以及用于讲课演示的交互式 Demo。

## 项目内容

当前仓库已经内置两节课：

- 第一讲：`Web体系与页面构建`
  - 浏览器关键渲染路径
  - Web 三剑客与客户端-服务器模型
  - HTML 语义化
  - CSS 层叠、盒模型、BFC、Grid、性能优化
- 第二讲：`JavaScript执行机制与知识图谱`
  - 执行上下文
  - 闭包与原型链
  - `this` 绑定
  - 事件循环与 `async/await`
  - 网络与安全、CORS、Fetch API

课程内容以结构化数据形式维护，而不是手写静态页面。

## 主要能力

- 课程落地页与课程列表展示
- 课程详情页分页展示
- 键盘翻页、按钮翻页、全屏展示
- 交互式教学 Demo
- 单独课程 HTML 输出
- 单文件 HTML 导出，便于直接分发使用

## 关键目录

```text
src/
├─ pages/
│  ├─ landing.ts              # 课程落地页入口
│  ├─ lecture.ts              # 通用课程详情页入口（基于 id 查询参数）
│  ├─ lecture-1.html/.ts      # 第一讲独立入口
│  └─ lecture-2.html/.ts      # 第二讲独立入口
├─ courseware/
│  ├─ lecture-render.ts       # 课程页面渲染与分页逻辑
│  ├─ lecture-types.ts        # 课程内容数据结构定义
│  ├─ lecture-demos.ts        # 交互式演示集合
│  └─ data/
│     ├─ lecture-1.ts         # 第一讲课程数据
│     └─ lecture-2.ts         # 第二讲课程数据
├─ static/
│  └─ lecture.scss            # 课程页面样式
scripts/
└─ inline-lecture-pages.mjs   # 单文件 HTML 内联脚本
```

## 安装依赖

```bash
npm install
```

## 本地开发

```bash
npm run dev
```

默认使用 Vite 本地开发服务，端口为 `3001`。

## 构建说明

### 1. 构建课程页面

```bash
npm run build:pages
```

该命令会：

- 构建课程站点页面
- 生成两节课各自独立的 HTML 页面
- 额外生成单文件版本的课程 HTML，便于直接使用或分发

主要产物包括：

- `dist/index.html`
- `dist/src/pages/lecture.html`
- `dist/src/pages/lecture-1.html`
- `dist/src/pages/lecture-2.html`
- `dist/src/pages/lecture-1.single.html`
- `dist/src/pages/lecture-2.single.html`

其中：

- `lecture-1.html` / `lecture-2.html`：独立课程页面
- `lecture-1.single.html` / `lecture-2.single.html`：单文件版本，已内联本地 CSS 与模块脚本，适合直接分发

### 2. 构建库产物

```bash
npm run build
```

该命令仍会执行库构建流程，输出 `dist/js`、样式与类型定义文件。它主要用于保留原有库构建能力，不是当前课程页面分发的主要方式。

## 页面入口说明

当前支持两种课程访问方式：

- 通用课程详情页：
  - `src/pages/lecture.html?id=lecture-1`
  - `src/pages/lecture.html?id=lecture-2`
- 独立课程入口页：
  - `src/pages/lecture-1.html`
  - `src/pages/lecture-2.html`

在构建产物中，推荐直接使用独立课程页或单文件课程页。

## 交互式 Demo

项目内已经实现多种教学演示组件，统一维护在 `src/courseware/lecture-demos.ts`，例如：

- 浏览器渲染流程模拟
- DOM Tree 构建演示
- CSS 层叠规则演示
- 盒模型可视化
- BFC 演示
- Grid/Flex 布局演示
- CSS 性能演示
- 闭包、原型链、`this`、事件循环演示
- CORS / 同源策略模拟

## 后续扩展

如果要新增一节课，通常需要：

1. 在 `src/courseware/data/` 中新增课程数据文件
2. 在课程入口文件中注册课程
3. 如需独立构建页面，新增对应的 `html + ts` 页面入口
4. 在页面构建配置中加入新的入口文件

## 说明

当前单文件 HTML 已内联本地 CSS 与模块脚本。
Google Fonts 仍然是外链资源；如果需要完全离线版本，可以继续将字体方案替换为系统字体或本地字体。
