/**
 * 流式讲稿数据模型
 * 支持叙述段落、代码示例、交互演示交替展示
 */

// ============ 内容块类型 ============

/** 叙述文本块 */
export interface NarrativeBlock {
  type: 'narrative';
  content: string;
  emphasis?: 'normal' | 'highlight' | 'question';
}

/** 代码示例块 */
export interface CodeBlock {
  type: 'code';
  language: 'html' | 'css' | 'javascript' | 'text';
  code: string;
  caption?: string;
}

/** 要点列表块 */
export interface BulletBlock {
  type: 'bullets';
  title?: string;
  items: string[];
}

/** 流程图块 */
export interface FlowBlock {
  type: 'flow';
  steps: string[];
  direction?: 'vertical' | 'horizontal';
}

/** 交互演示块 */
export interface DemoBlock {
  type: 'demo';
  demoType: DemoType;
  config: DemoConfig;
}

/** 过渡提示块 */
export interface TransitionBlock {
  type: 'transition';
  text: string;
}

/** 检查点块 */
export interface CheckpointBlock {
  type: 'checkpoint';
  question: string;
}

export type ContentBlock =
  | NarrativeBlock
  | CodeBlock
  | BulletBlock
  | FlowBlock
  | DemoBlock
  | TransitionBlock
  | CheckpointBlock

// ============ Demo 类型 ============

export type DemoType =
  | 'renderPipeline'      // 渲染流程模拟
  | 'domTreeBuilder'      // DOM 树构建
  | 'cssCascade'          // CSS 层叠规则
  | 'flexPlayground'      // Flex 布局沙盒
  | 'gridPlayground'      // Grid 布局沙盒
  | 'bfcDemo'             // BFC 演示
  | 'boxModel'            // 盒模型可视化
  | 'cssPerformance'      // CSS 性能演示
  | 'eventLoop'           // 事件循环可视化
  | 'promiseOrder'        // Promise 执行顺序
  | 'prototypeChain'      // 原型链探查器
  | 'thisBinding'         // this 绑定实验
  | 'closureMemory'       // 闭包内存实验
  | 'corsSimulator'       // 同源策略模拟

export interface RenderPipelineConfig {
  type: 'renderPipeline';
  showAsync?: boolean;
  showDefer?: boolean;
}

export interface DomTreeBuilderConfig {
  type: 'domTreeBuilder';
  initialHtml?: string;
}

export interface CssCascadeConfig {
  type: 'cssCascade';
  initialCss?: string;
  initialHtml?: string;
}

export interface FlexPlaygroundConfig {
  type: 'flexPlayground';
  itemCount?: number;
}

export interface GridPlaygroundConfig {
  type: 'gridPlayground';
  itemCount?: number;
}

export interface BfcDemoConfig {
  type: 'bfcDemo';
}

export interface EventLoopConfig {
  type: 'eventLoop';
  initialCode?: string;
}

export interface PromiseOrderConfig {
  type: 'promiseOrder';
  initialCode?: string;
}

export interface PrototypeChainConfig {
  type: 'prototypeChain';
  initialCode?: string;
}

export interface ThisBindingConfig {
  type: 'thisBinding';
}

export interface ClosureMemoryConfig {
  type: 'closureMemory';
  initialCode?: string;
}

export interface CorsSimulatorConfig {
  type: 'corsSimulator';
}

export interface BoxModelConfig {
  type: 'boxModel';
}

export interface CssPerformanceConfig {
  type: 'cssPerformance';
}

export type DemoConfig =
  | RenderPipelineConfig
  | DomTreeBuilderConfig
  | CssCascadeConfig
  | FlexPlaygroundConfig
  | GridPlaygroundConfig
  | BfcDemoConfig
  | EventLoopConfig
  | PromiseOrderConfig
  | PrototypeChainConfig
  | ThisBindingConfig
  | ClosureMemoryConfig
  | CorsSimulatorConfig
  | BoxModelConfig
  | CssPerformanceConfig

// ============ 章节结构 ============

export interface LectureSection {
  id: string;
  title: string;
  duration: number;
  blocks: ContentBlock[];
}

export interface Lecture {
  id: string;
  title: string;
  subtitle: string;
  totalDuration: number;
  sections: LectureSection[];
}
