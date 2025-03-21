import React, { useState } from 'react';
import { MatchResult } from '../types';
import { useAppContext } from '../context/AppContext';

interface MatchRecommendationsProps {
  matchResults: MatchResult[];
}

const MatchRecommendations: React.FC<MatchRecommendationsProps> = ({ matchResults }) => {
  const { members, setSelectedMember } = useAppContext();
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  // 如果没有匹配结果，显示提示信息
  if (matchResults.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color: '#999',
        margin: '10px'
      }}>
        <p>暂无匹配推荐</p>
        <p style={{ fontSize: '0.9rem' }}>请在图谱中选择一个成员来查看匹配推荐</p>
      </div>
    );
  }

  // 根据匹配评分获取对应的颜色
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#1890ff';
    if (score >= 40) return '#faad14';
    return '#999';
  };

  // 切换展开/折叠状态
  const toggleExpand = (matchId: string) => {
    if (expandedMatch === matchId) {
      setExpandedMatch(null);
    } else {
      setExpandedMatch(matchId);
    }
  };

  // 查看成员详情
  const viewMemberDetail = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      margin: '10px'
    }}>
      <h3 style={{ 
        fontSize: '1.2rem', 
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
        marginTop: 0,
        color: '#333'
      }}>
        智能匹配推荐
      </h3>

      <div>
        {matchResults.map((match) => {
          const targetMember = members.find(m => m.id === match.targetId);
          if (!targetMember) return null;

          const isExpanded = expandedMatch === match.targetId;
          
          return (
            <div key={match.targetId} style={{ 
              marginBottom: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              {/* 匹配标题栏 */}
              <div 
                style={{ 
                  padding: '12px 15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: isExpanded ? '1px solid #eee' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => toggleExpand(match.targetId)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    {targetMember.nickname}
                  </span>
                  <span style={{ 
                    backgroundColor: '#f0f7ff',
                    color: '#1890ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {targetMember.location}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    marginRight: '15px',
                    backgroundColor: '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      color: getScoreColor(match.matchScore),
                      fontWeight: 'bold',
                      marginRight: '5px'
                    }}>
                      {match.matchScore}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>匹配度</span>
                  </div>
                  <span style={{ color: '#999' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* 展开的匹配详情 */}
              {isExpanded && (
                <div style={{ padding: '15px' }}>
                  {/* 匹配理由 */}
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      color: '#555',
                      marginBottom: '10px'
                    }}>
                      匹配理由
                    </h4>
                    <ul style={{ 
                      listStyleType: 'disc',
                      paddingLeft: '20px',
                      margin: 0,
                      color: '#666'
                    }}>
                      {match.reasons.map((reason, index) => (
                        <li key={index} style={{ marginBottom: '5px' }}>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 潜在合作价值 */}
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      color: '#555',
                      marginBottom: '10px'
                    }}>
                      潜在合作价值
                    </h4>
                    <p style={{ 
                      margin: 0,
                      color: '#666',
                      backgroundColor: '#f5f5f5',
                      padding: '10px',
                      borderRadius: '4px',
                      borderLeft: '3px solid #1890ff'
                    }}>
                      {match.potentialValue}
                    </p>
                  </div>

                  {/* 查看按钮 */}
                  <div style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => viewMemberDetail(match.targetId)}
                      style={{ 
                        backgroundColor: '#1890ff',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      查看成员详情
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchRecommendations; 