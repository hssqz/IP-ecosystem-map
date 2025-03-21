import React from 'react';
import { Member } from '../types';
import { useAppContext } from '../context/AppContext';

interface MemberDetailProps {
  member: Member;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ member }) => {
  // 根据成员类型获取标题背景色
  const getTitleBgColor = (type: string): string => {
    switch (type) {
      case 'current': return '#5470c6';
      case 'manager': return '#91cc75';
      case 'potential': return '#fac858';
      default: return '#5470c6';
    }
  };

  // 获取成员类型标签
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'current': return '现有成员';
      case 'manager': return '社群管理者';
      case 'potential': return '潜在成员';
      default: return '成员';
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      margin: '10px',
      width: '100%'
    }}>
      {/* 成员标题区 */}
      <div style={{ 
        backgroundColor: getTitleBgColor(member.type),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '6px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{member.nickname}</h2>
        <span style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem'
        }}>
          {getTypeLabel(member.type)}
        </span>
      </div>

      {/* 基本信息 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{ 
            backgroundColor: '#f3f4f6',
            padding: '5px 10px',
            borderRadius: '4px',
            marginRight: '10px',
            fontWeight: 'bold'
          }}>
            所在地
          </span>
          <span>{member.location}</span>
        </div>
        
        {/* 标签云 */}
        {member.tags && member.tags.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>关键能力:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {member.tags.map((tag, index) => (
                <span key={index} style={{ 
                  backgroundColor: '#f0f7ff',
                  color: '#1890ff',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '0.9rem'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 自我介绍 */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          borderBottom: '1px solid #eee',
          paddingBottom: '8px',
          color: '#333'
        }}>
          自我介绍
        </h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>
          {member.introduction}
        </p>
      </div>

      {/* 资源区域 */}
      {member.resources.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            borderBottom: '1px solid #eee',
            paddingBottom: '8px',
            color: '#333'
          }}>
            提供的资源
          </h3>
          <ul style={{ 
            listStyleType: 'none',
            padding: 0,
            margin: 0
          }}>
            {member.resources.map((resource) => (
              <li key={resource.id} style={{ 
                backgroundColor: '#f9f9f9',
                padding: '12px 15px',
                borderRadius: '6px',
                marginBottom: '10px',
                borderLeft: '3px solid #52c41a'
              }}>
                <p style={{ margin: '0 0 8px 0' }}>{resource.content}</p>
                {resource.tags && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {resource.tags.map((tag, idx) => (
                      <span key={idx} style={{ 
                        fontSize: '0.8rem',
                        color: '#888',
                        backgroundColor: '#f5f5f5',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 需求区域 */}
      {member.needs.length > 0 && (
        <div>
          <h3 style={{ 
            fontSize: '1.1rem', 
            borderBottom: '1px solid #eee',
            paddingBottom: '8px',
            color: '#333'
          }}>
            目前需求
          </h3>
          <ul style={{ 
            listStyleType: 'none',
            padding: 0,
            margin: 0
          }}>
            {member.needs.map((need) => (
              <li key={need.id} style={{ 
                backgroundColor: '#f9f9f9',
                padding: '12px 15px',
                borderRadius: '6px',
                marginBottom: '10px',
                borderLeft: '3px solid #1890ff'
              }}>
                <p style={{ margin: '0 0 8px 0' }}>{need.content}</p>
                {need.tags && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {need.tags.map((tag, idx) => (
                      <span key={idx} style={{ 
                        fontSize: '0.8rem',
                        color: '#888',
                        backgroundColor: '#f5f5f5',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MemberDetail; 