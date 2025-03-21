// 成员类型
export type MemberType = 'current' | 'manager' | 'potential';

// 资源项结构
export interface Resource {
  id: number;
  content: string;
  tags?: string[]; // AI提取的标签
}

// 需求项结构
export interface Need {
  id: number;
  content: string;
  tags?: string[]; // AI提取的标签
}

// 成员结构
export interface Member {
  id: string;
  nickname: string;
  location: string;
  introduction: string;
  type: MemberType;
  resources: Resource[];
  needs: Need[];
  tags?: string[]; // AI提取的标签
}

// 关系类型
export type RelationType = 'resource' | 'need' | 'location' | 'interest' | 'collaboration';

// 关系强度 (0-1)
export type RelationStrength = number;

// 成员间关系
export interface Relation {
  id: string;
  source: string; // 成员ID
  target: string; // 成员ID
  type: RelationType;
  strength: RelationStrength;
  description: string; // 关系描述，如匹配的资源和需求
}

// 图谱节点
export interface Node {
  id: string;
  name: string;
  type: MemberType;
  value: number; // 节点大小，可以表示资源数量
  tags: string[];
}

// 图谱连线
export interface Link {
  source: string;
  target: string;
  value: number; // 线条粗细，表示关系强度
  type: RelationType;
  description: string;
}

// 图谱数据结构
export interface GraphData {
  nodes: Node[];
  links: Link[];
}

// 匹配推荐结果
export interface MatchResult {
  sourceId: string;
  targetId: string;
  matchScore: number; // 匹配度评分
  reasons: string[]; // 匹配理由
  potentialValue: string; // 潜在价值/合作建议
} 