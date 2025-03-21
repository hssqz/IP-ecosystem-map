import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Member, Relation, GraphData, MatchResult } from '../types';
import { members as initialMembers } from '../data/members';
import { 
  generateRelations, 
  convertToGraphData, 
  getRecommendedMatches,
  enhanceMembersWithLLM
} from '../services/relationService';
import { generateMatchAnalysis } from '../services/llmService';

interface AppContextType {
  members: Member[];
  relations: Relation[];
  graphData: GraphData | null;
  selectedMember: Member | null;
  matchResults: MatchResult[];
  loading: boolean;
  setSelectedMember: (member: Member | null) => void;
  getMatchDetails: (sourceId: string, targetId: string) => Promise<MatchResult>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 初始化关系数据
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      
      try {
        console.log("开始使用LLM增强成员数据...");
        // 使用LLM增强成员数据
        const enhancedMembers = await enhanceMembersWithLLM(initialMembers);
        setMembers(enhancedMembers);
        console.log("成员数据增强完成");
        
        // 生成成员间关系
        console.log("开始生成成员关系...");
        const relationData = generateRelations(enhancedMembers);
        setRelations(relationData);
        console.log(`生成了 ${relationData.length} 条成员关系`);
        
        // 转换为图谱数据
        const graph = convertToGraphData(enhancedMembers, relationData);
        setGraphData(graph);
        console.log("图谱数据生成完成");
      } catch (error) {
        console.error("初始化数据时出错:", error);
        // 出错时使用初始数据
        const relationData = generateRelations(initialMembers);
        setRelations(relationData);
        const graph = convertToGraphData(initialMembers, relationData);
        setGraphData(graph);
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);
  
  // 当选中成员变化时，更新匹配结果
  useEffect(() => {
    if (!selectedMember) {
      setMatchResults([]);
      return;
    }
    
    const loadMatchResults = async () => {
      setLoading(true);
      
      try {
        console.log(`开始为成员 ${selectedMember.nickname} 生成匹配推荐...`);
        
        // 获取推荐匹配的成员ID
        const recommendedIds = getRecommendedMatches(selectedMember.id, members, relations);
        console.log(`找到 ${recommendedIds.length} 个潜在匹配成员`);
        
        // 获取每个匹配的详细信息
        const results = [];
        // 限制为前3个结果
        for (const targetId of recommendedIds.slice(0, 3)) {
          console.log(`分析与成员 ID:${targetId} 的匹配详情...`);
          try {
            const matchResult = await generateMatchAnalysis(selectedMember.id, targetId, members);
            results.push(matchResult);
          } catch (error) {
            console.error(`分析匹配详情时出错:`, error);
          }
        }
        
        setMatchResults(results);
        console.log(`生成了 ${results.length} 个匹配推荐`);
      } catch (error) {
        console.error("加载匹配结果时出错:", error);
        setMatchResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadMatchResults();
  }, [selectedMember, members, relations]);
  
  // 获取特定匹配的详细信息
  const getMatchDetails = async (sourceId: string, targetId: string): Promise<MatchResult> => {
    console.log(`获取成员 ${sourceId} 和 ${targetId} 的详细匹配信息...`);
    return generateMatchAnalysis(sourceId, targetId, members);
  };
  
  return (
    <AppContext.Provider
      value={{
        members,
        relations,
        graphData,
        selectedMember,
        matchResults,
        loading,
        setSelectedMember,
        getMatchDetails
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 自定义Hook，用于在组件中获取上下文
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 