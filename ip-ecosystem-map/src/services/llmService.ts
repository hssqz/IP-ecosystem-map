import { Member, MatchResult } from '../types';
import axios from 'axios';

// Python后端API基础URL
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 提取成员能力和特点
 * @param member 成员数据
 * @returns 提取的能力标签
 */
export const analyzeMemberCapabilities = async (member: Member): Promise<string[]> => {
  try {
    console.log(`正在通过API分析成员 ${member.nickname} 的能力和特点...`);
    const response = await axios.post(`${API_BASE_URL}/analyze-member`, {
      member
    });
    
    if (response.status === 200 && Array.isArray(response.data)) {
      console.log(`成功获取到 ${member.nickname} 的标签:`, response.data);
      return response.data;
    } else {
      console.warn(`API返回了非预期的响应:`, response.data);
      return extractFallbackTags(member);
    }
  } catch (error) {
    console.error(`调用分析成员API失败:`, error);
    return extractFallbackTags(member);
  }
};

/**
 * 备用的标签提取方法，当API调用失败时使用
 */
const extractFallbackTags = (member: Member): string[] => {
  const existingTags = member.tags || [];
  if (existingTags.length > 0) {
    return existingTags;
  }
  
  const capabilities: string[] = [];
  
  // 从资源中提取标签
  member.resources.forEach(resource => {
    if (resource.tags) {
      capabilities.push(...resource.tags);
    }
  });
  
  // 从需求中提取标签
  member.needs.forEach(need => {
    if (need.tags) {
      capabilities.push(...need.tags);
    }
  });
  
  // 提取关键词
  const commonKeywords = [
    '创业', 'AI', '社群', '产品', '运营', '投资',
    '技术', '商务', '营销', '金融', '国际化', '合作'
  ];
  
  const introKeywords = commonKeywords.filter(keyword => 
    member.introduction.toLowerCase().includes(keyword.toLowerCase())
  );
  
  capabilities.push(...introKeywords);
  
  // 去重
  const uniqueCapabilities = Array.from(new Set(capabilities));
  return uniqueCapabilities.slice(0, 10); // 最多返回10个标签
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
  const sourceMember = members.find(m => m.id === sourceId);
  const targetMember = members.find(m => m.id === targetId);
  
  if (!sourceMember || !targetMember) {
    throw new Error("成员不存在");
  }
  
  try {
    console.log(`正在通过API分析成员 ${sourceMember.nickname} 和 ${targetMember.nickname} 的匹配度...`);
    const response = await axios.post(`${API_BASE_URL}/match-analysis`, {
      sourceMember,
      targetMember
    });
    
    if (response.status === 200) {
      const result = response.data;
      console.log(`成功获取匹配结果，匹配度: ${result.matchScore}`);
      return {
        sourceId,
        targetId,
        matchScore: result.matchScore || 50,
        reasons: result.reasons || [],
        potentialValue: result.potentialValue || ""
      };
    } else {
      console.warn(`API返回了非预期的响应:`, response.data);
      return generateFallbackMatchAnalysis(sourceMember, targetMember);
    }
  } catch (error) {
    console.error(`调用匹配分析API失败:`, error);
    return generateFallbackMatchAnalysis(sourceMember, targetMember);
  }
};

/**
 * 备用匹配分析生成器，当API调用失败时使用
 */
const generateFallbackMatchAnalysis = (sourceMember: Member, targetMember: Member): MatchResult => {
  // 检查地理位置
  const locationMatch = sourceMember.location === targetMember.location;
  
  // 检查共同标签
  const sourceTagSet = new Set(sourceMember.tags || []);
  const targetTagSet = new Set(targetMember.tags || []);
  const commonTags: string[] = [];
  
  sourceTagSet.forEach(tag => {
    if (targetTagSet.has(tag)) {
      commonTags.push(tag);
    }
  });
  
  // 检查资源-需求匹配
  const resourceNeedMatches: string[] = [];
  
  // 源成员资源匹配目标成员需求
  sourceMember.resources.forEach(resource => {
    const resourceTags = resource.tags || [];
    
    targetMember.needs.forEach(need => {
      const needTags = need.tags || [];
      
      const matchingTags = resourceTags.filter(tag => needTags.includes(tag));
      if (matchingTags.length > 0) {
        resourceNeedMatches.push(`${sourceMember.nickname}的"${resource.content.slice(0, 20)}..."可能满足${targetMember.nickname}的"${need.content.slice(0, 20)}..."`);
      }
    });
  });
  
  // 目标成员资源匹配源成员需求
  targetMember.resources.forEach(resource => {
    const resourceTags = resource.tags || [];
    
    sourceMember.needs.forEach(need => {
      const needTags = need.tags || [];
      
      const matchingTags = resourceTags.filter(tag => needTags.includes(tag));
      if (matchingTags.length > 0) {
        resourceNeedMatches.push(`${targetMember.nickname}的"${resource.content.slice(0, 20)}..."可能满足${sourceMember.nickname}的"${need.content.slice(0, 20)}..."`);
      }
    });
  });
  
  // 生成匹配理由
  const reasons: string[] = [];
  
  // 添加地理位置理由
  if (locationMatch) {
    reasons.push(`${sourceMember.nickname}和${targetMember.nickname}都位于${sourceMember.location}，便于线下交流`);
  }
  
  // 添加共同标签理由
  if (commonTags.length > 0) {
    reasons.push(`${sourceMember.nickname}和${targetMember.nickname}都关注: ${commonTags.join(', ')}`);
  }
  
  // 添加资源-需求匹配理由
  reasons.push(...resourceNeedMatches.slice(0, 3));
  
  // 如果理由不足3条，添加通用理由
  if (reasons.length < 3) {
    reasons.push(`${sourceMember.nickname}和${targetMember.nickname}可以在专业领域互相交流经验`);
    reasons.push(`双方可以探索更多未被发现的合作机会`);
  }
  
  // 限制最多5条理由
  const finalReasons = reasons.slice(0, 5);
  
  // 计算匹配评分
  let matchScore = 40; // 基础分
  
  if (locationMatch) matchScore += 10;
  matchScore += commonTags.length * 5; // 每个共同标签加5分
  matchScore += resourceNeedMatches.length * 10; // 每个资源-需求匹配加10分
  
  // 限制在0-100范围内
  matchScore = Math.min(100, Math.max(0, matchScore));
  
  // 生成合作建议
  const getRandomTag = (member: Member): string => {
    const tags = member.tags || [];
    return tags.length > 0 ? tags[Math.floor(Math.random() * tags.length)] : "专业领域";
  };
  
  const getCommonTag = (): string => {
    return commonTags.length > 0 ? commonTags[0] : "共同关注的领域";
  };
  
  const potentialValue = `${sourceMember.nickname}可以为${targetMember.nickname}提供${getRandomTag(sourceMember)}方面的支持，而${targetMember.nickname}则可以在${getRandomTag(targetMember)}方面助力。双方可以通过定期交流，分享各自在${getCommonTag()}的最新进展和洞察，创造更大的价值。`;
  
  return {
    sourceId: sourceMember.id,
    targetId: targetMember.id,
    matchScore,
    reasons: finalReasons,
    potentialValue
  };
}; 