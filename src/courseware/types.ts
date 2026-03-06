export type DemoType =
  | 'stageTimeline'
  | 'boxModelLab'
  | 'flexPlayground'
  | 'eventFlowLab'
  | 'eventLoopSimulator'
  | 'metricMonitor'
  | 'reflowEstimator'
  | 'bundleOptimizer'
  | 'networkPlanner'
  | 'stateVisualizer'
  | 'immutabilityLab'
  | 'cacheTuner'
  | 'telemetryPanel'
  | 'lazyLoadPlanner'
  | 'semanticLab'
  | 'formValidator'
  | 'prototypeExplorer'

export interface DemoBaseConfig {
  type: DemoType;
  title: string;
  description: string;
  code?: string;
}

export interface TimelineStage {
  label: string;
  detail: string;
  duration?: string;
}

export interface StageTimelineDemo extends DemoBaseConfig {
  type: 'stageTimeline';
  stages: TimelineStage[];
}

export interface BoxModelPreset {
  label: string;
  padding: number;
  border: number;
  margin: number;
}

export interface BoxModelLabDemo extends DemoBaseConfig {
  type: 'boxModelLab';
  presets: BoxModelPreset[];
}

export interface FlexPlaygroundDemo extends DemoBaseConfig {
  type: 'flexPlayground';
  directions: Array<'row' | 'column'>;
  alignments: Array<'flex-start' | 'center' | 'flex-end' | 'stretch'>;
  justifications: Array<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'>;
}

export interface EventFlowMode {
  label: string;
  description: string;
  stopAt?: 'outer' | 'middle';
  captureOnly?: boolean;
}

export interface EventFlowLabDemo extends DemoBaseConfig {
  type: 'eventFlowLab';
  modes: EventFlowMode[];
}

export interface EventLoopTaskPreset {
  label: string;
  type: 'macro' | 'micro';
}

export interface EventLoopSimulatorDemo extends DemoBaseConfig {
  type: 'eventLoopSimulator';
  presets: EventLoopTaskPreset[];
}

export interface MetricConfig {
  key: string;
  label: string;
  unit: string;
  max: number;
  good: number;
  warning: number;
  defaultValue: number;
}

export interface MetricMonitorDemo extends DemoBaseConfig {
  type: 'metricMonitor';
  metrics: MetricConfig[];
}

export interface ReflowEstimatorDemo extends DemoBaseConfig {
  type: 'reflowEstimator';
  baseCost: number;
  multipliers: Record<'layout' | 'paint' | 'composite', number>;
}

export interface BundleModuleConfig {
  name: string;
  size: number;
  benefit: string;
  lazy?: boolean;
}

export interface BundleOptimizerDemo extends DemoBaseConfig {
  type: 'bundleOptimizer';
  modules: BundleModuleConfig[];
}

export interface NetworkAssetConfig {
  name: string;
  size: number;
  priority: 'critical' | 'deferred';
}

export interface NetworkPlannerDemo extends DemoBaseConfig {
  type: 'networkPlanner' | 'lazyLoadPlanner';
  assets: NetworkAssetConfig[];
}

export interface StateFlowOption {
  label: string;
  description: string;
  direction: 'one-way' | 'two-way' | 'event';
}

export interface StateVisualizerDemo extends DemoBaseConfig {
  type: 'stateVisualizer';
  flows: StateFlowOption[];
}

export interface ImmutabilityLabDemo extends DemoBaseConfig {
  type: 'immutabilityLab';
  datasetSizes: number[];
}

export interface CacheStrategyConfig {
  name: string;
  header: string;
  ttl: number;
  hitHint: string;
}

export interface CacheTunerDemo extends DemoBaseConfig {
  type: 'cacheTuner';
  strategies: CacheStrategyConfig[];
}

export interface TelemetryPanelDemo extends DemoBaseConfig {
  type: 'telemetryPanel';
  defaultRate: number;
}

export interface SemanticSample {
  label: string;
  markup: string;
  description: string;
}

export interface SemanticLabDemo extends DemoBaseConfig {
  type: 'semanticLab';
  samples: SemanticSample[];
}

export interface FormFieldConfig {
  label: string;
  type: 'text' | 'email' | 'number';
  placeholder: string;
  required?: boolean;
  pattern?: string;
  hint?: string;
}

export interface FormValidatorDemo extends DemoBaseConfig {
  type: 'formValidator';
  fields: FormFieldConfig[];
}

export interface PrototypeNode {
  name: string;
  properties: string[];
}

export interface PrototypeExplorerDemo extends DemoBaseConfig {
  type: 'prototypeExplorer';
  chain: PrototypeNode[];
}

export type DemoConfig =
  | StageTimelineDemo
  | BoxModelLabDemo
  | FlexPlaygroundDemo
  | EventFlowLabDemo
  | EventLoopSimulatorDemo
  | MetricMonitorDemo
  | ReflowEstimatorDemo
  | BundleOptimizerDemo
  | NetworkPlannerDemo
  | StateVisualizerDemo
  | ImmutabilityLabDemo
  | CacheTunerDemo
  | TelemetryPanelDemo
  | SemanticLabDemo
  | FormValidatorDemo
  | PrototypeExplorerDemo

export interface KnowledgePoint {
  id: string;
  title: string;
  duration: number;
  problem: string;
  guide: string;
  explanation: string;
  demo: DemoConfig;
  nextStep?: string;
}

export interface Chapter {
  id: string;
  title: string;
  duration: number;
  focus: string;
  intro: string;
  narrative: string;
  guide: string;
  transition?: string;
  knowledgePoints: KnowledgePoint[];
  checkpoint: string;
}

export interface CourseSession {
  id: string;
  title: string;
  duration: number;
  sessionLabel: string;
  theme: string;
  summary: string;
  takeaways: string[];
  prerequisites: string[];
  toolkit: string[];
  chapters: Chapter[];
}
