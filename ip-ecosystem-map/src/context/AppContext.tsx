import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Member, Relation, GraphData, MatchResult } from '../types';
import { members as initialMembers } from '../data/members';
import { generateRelations, convertToGraphData, getRecommendedMatches } from '../services/relationService';
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
  const [members] = useState<Member[]>(initialMembers);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 初始化关系数据
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      
      // 生成成员间关系
      const relationData = generateRelations(members);
      setRelations(relationData);
      
      // 转换为图谱数据
      const graph = convertToGraphData(members, relationData);
      setGraphData(graph);
      
      setLoading(false);
    };
    
    initData();
  }, [members]);
  
  // 当选中成员变化时，更新匹配结果
  useEffect(() => {
    if (!selectedMember) {
      setMatchResults([]);
      return;
    }
    
    const loadMatchResults = async () => {
      setLoading(true);
      
      // 获取推荐匹配的成员ID
      const recommendedIds = getRecommendedMatches(selectedMember.id, members, relations);
      
      // 获取每个匹配的详细信息
      const results = [];
      for (const targetId of recommendedIds.slice(0, 3)) { // 限制为前3个结果
        const matchResult = await generateMatchAnalysis(selectedMember.id, targetId, members);
        results.push(matchResult);
      }
      
      setMatchResults(results);
      setLoading(false);
    };
    
    loadMatchResults();
  }, [selectedMember, members, relations]);
  
  // 获取特定匹配的详细信息
  const getMatchDetails = async (sourceId: string, targetId: string): Promise<MatchResult> => {
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