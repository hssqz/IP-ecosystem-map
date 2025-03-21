import React from 'react';
import RelationGraph from '../components/RelationGraph';
import MemberDetail from '../components/MemberDetail';
import MatchRecommendations from '../components/MatchRecommendations';
import { useAppContext } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { selectedMember, matchResults, loading } = useAppContext();
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '0'
    }}>
      {/* 页面头部 */}
      <header style={{ 
        backgroundColor: '#001529', 
        color: 'white',
        padding: '15px 30px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>IP生态图谱系统</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
          基于LLM分析的成员关系与资源匹配平台
        </p>
      </header>
      
      {/* 加载提示 */}
      {loading && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px 40px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ 
                border: '3px solid #1890ff',
                borderRadius: '50%',
                borderBottomColor: 'transparent',
                width: '30px',
                height: '30px',
                display: 'inline-block',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
            <p style={{ margin: 0, color: '#333' }}>正在加载数据，请稍候...</p>
          </div>
        </div>
      )}
      
      {/* 主要内容区域 */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        padding: '20px',
        gap: '20px'
      }}>
        {/* 左侧图谱区域 */}
        <div style={{ 
          flex: '3', 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <RelationGraph height="calc(100vh - 140px)" />
        </div>
        
        {/* 右侧详情和推荐区域 */}
        <div style={{ 
          flex: '2',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 140px)',
          overflow: 'auto'
        }}>
          {/* 成员详情 */}
          {selectedMember ? (
            <MemberDetail member={selectedMember} />
          ) : (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: '#999',
              margin: '10px'
            }}>
              <p>请在图谱中点击节点查看成员详情</p>
            </div>
          )}
          
          {/* 匹配推荐 */}
          <MatchRecommendations matchResults={matchResults} />
        </div>
      </div>
      
      {/* 添加CSS动画 */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage; 