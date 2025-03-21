import { Member, Relation, RelationType, GraphData, Node, Link } from '../types';

/**
 * 生成成员之间的关系数据
 * @param members 成员数据数组
 * @returns 关系数据数组
 */
export const generateRelations = (members: Member[]): Relation[] => {
  const relations: Relation[] = [];
  
  // 遍历所有成员对，分析可能的关系
  for (let i = 0; i < members.length; i++) {
    const memberA = members[i];
    
    for (let j = i + 1; j < members.length; j++) {
      const memberB = members[j];
      
      // 检查地点关系
      if (memberA.location === memberB.location) {
        relations.push({
          id: `loc-${memberA.id}-${memberB.id}`,
          source: memberA.id,
          target: memberB.id,
          type: 'location',
          strength: 0.3, // 地点相同的基础关系强度
          description: `同在${memberA.location}地区`
        });
      }
      
      // 检查资源-需求匹配关系
      const resourceNeedRelations = findResourceNeedMatches(memberA, memberB);
      relations.push(...resourceNeedRelations);
      
      // 检查共同兴趣/标签关系
      const interestRelations = findCommonInterests(memberA, memberB);
      if (interestRelations) {
        relations.push(interestRelations);
      }
    }
  }
  
  return relations;
};

/**
 * 查找两个成员之间的资源-需求匹配
 */
const findResourceNeedMatches = (memberA: Member, memberB: Member): Relation[] => {
  const relations: Relation[] = [];
  
  // 检查A的资源是否匹配B的需求
  memberA.resources.forEach(resource => {
    const resourceTags = resource.tags || [];
    
    memberB.needs.forEach(need => {
      const needTags = need.tags || [];
      
      // 计算标签匹配度
      const matchingTags = resourceTags.filter(tag => needTags.includes(tag));
      if (matchingTags.length > 0) {
        const strength = matchingTags.length / Math.max(resourceTags.length, needTags.length);
        
        relations.push({
          id: `res-${memberA.id}-${memberB.id}-${resource.id}-${need.id}`,
          source: memberA.id,
          target: memberB.id,
          type: 'resource',
          strength: Math.min(0.8, 0.3 + strength * 0.5), // 根据匹配度调整关系强度
          description: `${memberA.nickname}的"${resource.content.slice(0, 30)}..."可能满足${memberB.nickname}的"${need.content.slice(0, 30)}..."`
        });
      }
    });
  });
  
  // 检查B的资源是否匹配A的需求
  memberB.resources.forEach(resource => {
    const resourceTags = resource.tags || [];
    
    memberA.needs.forEach(need => {
      const needTags = need.tags || [];
      
      // 计算标签匹配度
      const matchingTags = resourceTags.filter(tag => needTags.includes(tag));
      if (matchingTags.length > 0) {
        const strength = matchingTags.length / Math.max(resourceTags.length, needTags.length);
        
        relations.push({
          id: `res-${memberB.id}-${memberA.id}-${resource.id}-${need.id}`,
          source: memberB.id,
          target: memberA.id,
          type: 'resource',
          strength: Math.min(0.8, 0.3 + strength * 0.5), // 根据匹配度调整关系强度
          description: `${memberB.nickname}的"${resource.content.slice(0, 30)}..."可能满足${memberA.nickname}的"${need.content.slice(0, 30)}..."`
        });
      }
    });
  });
  
  return relations;
};

/**
 * 查找两个成员之间的共同兴趣/标签
 */
const findCommonInterests = (memberA: Member, memberB: Member): Relation | null => {
  if (!memberA.tags || !memberB.tags) return null;
  
  const commonTags = memberA.tags.filter(tag => memberB.tags?.includes(tag));
  if (commonTags.length === 0) return null;
  
  const strength = commonTags.length / Math.max(memberA.tags.length, memberB.tags.length);
  
  return {
    id: `int-${memberA.id}-${memberB.id}`,
    source: memberA.id,
    target: memberB.id,
    type: 'interest',
    strength: Math.min(0.7, 0.2 + strength * 0.5), // 根据共同兴趣数量调整关系强度
    description: `共同关注: ${commonTags.join(', ')}`
  };
};

/**
 * 转换成员和关系数据为图谱可视化数据
 */
export const convertToGraphData = (members: Member[], relations: Relation[]): GraphData => {
  // 构建节点数据
  const nodes: Node[] = members.map(member => ({
    id: member.id,
    name: member.nickname,
    type: member.type,
    value: (member.resources.length || 1) * 5, // 根据资源数量调整节点大小
    tags: member.tags || []
  }));
  
  // 构建连线数据
  const links: Link[] = relations.map(relation => ({
    source: relation.source,
    target: relation.target,
    value: relation.strength * 10, // 将关系强度转换为线条粗细
    type: relation.type,
    description: relation.description
  }));
  
  return { nodes, links };
};

/**
 * 生成成员匹配推荐
 * @param member 目标成员
 * @param allMembers 所有成员
 * @param relations 所有关系
 * @returns 排序后的匹配成员ID数组
 */
export const getRecommendedMatches = (memberId: string, allMembers: Member[], relations: Relation[]): string[] => {
  // 获取与该成员相关的所有关系
  const memberRelations = relations.filter(
    relation => relation.source === memberId || relation.target === memberId
  );
  
  // 计算每个相关成员的总关系强度
  const memberScores: {[key: string]: number} = {};
  
  memberRelations.forEach(relation => {
    const otherMemberId = relation.source === memberId ? relation.target : relation.source;
    memberScores[otherMemberId] = (memberScores[otherMemberId] || 0) + relation.strength;
  });
  
  // 根据关系强度排序成员ID
  return Object.entries(memberScores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
}; 