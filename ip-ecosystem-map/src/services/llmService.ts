import { Member, MatchResult } from '../types';

// 模拟LLM API调用的延迟
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

/**
 * 提取成员能力和特点
 * @param member 成员数据
 * @returns 提取的能力标签
 */
export const analyzeMemberCapabilities = async (member: Member): Promise<string[]> => {
  // 在真实项目中，这里会调用Gemini API进行分析
  // 这里我们模拟LLM的分析结果
  await simulateDelay();
  
  // 从资源和介绍中提取关键能力
  const capabilities: string[] = [];
  
  // 从资源中提取
  member.resources.forEach(resource => {
    if (resource.tags) {
      capabilities.push(...resource.tags);
    }
  });
  
  // 根据自我介绍提取
  const introKeywords = extractKeywordsFromIntro(member.introduction);
  capabilities.push(...introKeywords);
  
  // 去重
  const uniqueCapabilities = Array.from(new Set(capabilities));
  return uniqueCapabilities;
};

/**
 * 从自我介绍中提取关键词
 */
const extractKeywordsFromIntro = (intro: string): string[] => {
  // 模拟LLM提取关键词的结果
  const commonKeywords = [
    '创业', 'AI', '社群', '产品', '运营', '投资',
    '技术', '商务', '营销', '金融', '国际化', '合作'
  ];
  
  return commonKeywords.filter(keyword => 
    intro.toLowerCase().includes(keyword.toLowerCase())
  );
};

/**
 * 生成成员匹配的详细分析
 * @param sourceId 源成员ID
 * @param targetId 目标成员ID
 * @param members 所有成员数据
 * @returns 匹配分析结果
 */
export const generateMatchAnalysis = async (
  sourceId: string, 
  targetId: string, 
  members: Member[]
): Promise<MatchResult> => {
  await simulateDelay();
  
  const sourceMember = members.find(m => m.id === sourceId);
  const targetMember = members.find(m => m.id === targetId);
  
  if (!sourceMember || !targetMember) {
    throw new Error("成员不存在");
  }
  
  // 分析资源和需求的匹配
  const resourceNeedMatch = analyzeResourceNeedMatch(sourceMember, targetMember);
  
  // 分析共同兴趣/标签
  const commonInterests = analyzeCommonInterests(sourceMember, targetMember);
  
  // 计算匹配评分 (0-100)
  const matchScore = calculateMatchScore(resourceNeedMatch.reasons.length, commonInterests.reasons.length);
  
  // 合并理由
  const allReasons = [...resourceNeedMatch.reasons, ...commonInterests.reasons];
  
  // 生成潜在价值/合作建议
  const potentialValue = generatePotentialValue(sourceMember, targetMember, allReasons);
  
  return {
    sourceId,
    targetId,
    matchScore,
    reasons: allReasons,
    potentialValue
  };
};

/**
 * 分析资源需求匹配
 */
const analyzeResourceNeedMatch = (sourceMember: Member, targetMember: Member) => {
  const reasons: string[] = [];
  
  // 检查源成员的资源是否满足目标成员的需求
  sourceMember.resources.forEach(resource => {
    targetMember.needs.forEach(need => {
      const resourceTags = resource.tags || [];
      const needTags = need.tags || [];
      
      const matchingTags = resourceTags.filter(tag => needTags.includes(tag));
      if (matchingTags.length > 0) {
        reasons.push(`${sourceMember.nickname}的"${resource.content.slice(0, 20)}..."可能满足${targetMember.nickname}的"${need.content.slice(0, 20)}..."`);
      }
    });
  });
  
  // 检查目标成员的资源是否满足源成员的需求
  targetMember.resources.forEach(resource => {
    sourceMember.needs.forEach(need => {
      const resourceTags = resource.tags || [];
      const needTags = need.tags || [];
      
      const matchingTags = resourceTags.filter(tag => needTags.includes(tag));
      if (matchingTags.length > 0) {
        reasons.push(`${targetMember.nickname}的"${resource.content.slice(0, 20)}..."可能满足${sourceMember.nickname}的"${need.content.slice(0, 20)}..."`);
      }
    });
  });
  
  return { reasons };
};

/**
 * 分析共同兴趣
 */
const analyzeCommonInterests = (sourceMember: Member, targetMember: Member) => {
  const reasons: string[] = [];
  
  if (sourceMember.tags && targetMember.tags) {
    const commonTags = sourceMember.tags.filter(tag => targetMember.tags?.includes(tag));
    
    if (commonTags.length > 0) {
      reasons.push(`${sourceMember.nickname}和${targetMember.nickname}都关注: ${commonTags.join(', ')}`);
    }
  }
  
  // 检查地理位置
  if (sourceMember.location === targetMember.location) {
    reasons.push(`${sourceMember.nickname}和${targetMember.nickname}都位于${sourceMember.location}，便于线下交流`);
  }
  
  return { reasons };
};

/**
 * 计算匹配评分
 */
const calculateMatchScore = (resourceMatchCount: number, interestMatchCount: number): number => {
  // 资源匹配权重高于兴趣匹配
  const resourceScore = Math.min(70, resourceMatchCount * 25);
  const interestScore = Math.min(30, interestMatchCount * 15);
  
  return Math.min(100, resourceScore + interestScore);
};

/**
 * 生成潜在价值/合作建议
 */
const generatePotentialValue = (sourceMember: Member, targetMember: Member, reasons: string[]): string => {
  if (reasons.length === 0) {
    return "暂无明显合作价值点";
  }
  
  // 模拟LLM生成合作建议
  const suggestions = [
    `${sourceMember.nickname}和${targetMember.nickname}可以在${getRandomElement(sourceMember.tags || [])}领域展开深度合作`,
    `建议${sourceMember.nickname}可以与${targetMember.nickname}探讨关于${getRandomElement(targetMember.tags || [])}的合作机会`,
    `双方可以通过定期交流，分享各自在${getCommonTag(sourceMember, targetMember)}领域的最新进展和洞察`,
    `${sourceMember.nickname}可以为${targetMember.nickname}提供${getRandomElement(sourceMember.tags || [])}方面的支持，而${targetMember.nickname}则可以在${getRandomElement(targetMember.tags || [])}方面提供帮助`
  ];
  
  return getRandomElement(suggestions);
};

/**
 * 获取随机元素
 */
const getRandomElement = <T>(array: T[]): T => {
  if (array.length === 0) return "通用领域" as unknown as T;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

/**
 * 获取共同标签
 */
const getCommonTag = (memberA: Member, memberB: Member): string => {
  if (!memberA.tags || !memberB.tags || memberA.tags.length === 0 || memberB.tags.length === 0) {
    return "通用领域";
  }
  
  const commonTags = memberA.tags.filter(tag => memberB.tags?.includes(tag));
  return commonTags.length > 0 ? commonTags[0] : "通用领域";
}; 