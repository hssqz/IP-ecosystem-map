import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { GraphData, Node, Link, RelationType } from '../types';
import { useAppContext } from '../context/AppContext';
import type { EChartsOption } from 'echarts';

interface RelationGraphProps {
  width?: string;
  height?: string;
}

const RelationGraph: React.FC<RelationGraphProps> = ({ 
  width = '100%', 
  height = '600px' 
}) => {
  const { graphData, selectedMember, setSelectedMember, members } = useAppContext();
  const [filterType, setFilterType] = useState<RelationType | 'all'>('all');

  // 没有数据时显示加载中
  if (!graphData) {
    return <div>加载中...</div>;
  }

  // 根据过滤条件筛选连线
  const filteredLinks = filterType === 'all' 
    ? graphData.links 
    : graphData.links.filter(link => link.type === filterType);

  // 收集所有连线涉及的节点ID
  const connectedNodeIds = new Set<string>();
  filteredLinks.forEach(link => {
    connectedNodeIds.add(link.source.toString());
    connectedNodeIds.add(link.target.toString());
  });

  // 过滤节点，只保留有连线的节点
  const filteredNodes = graphData.nodes.filter(node => connectedNodeIds.has(node.id));

  // 图表配置
  const getOption = () => {
    // 根据成员类型设置节点颜色
    const categories = [
      { name: '现有成员', itemStyle: { color: '#5470c6' } },
      { name: '社群管理者', itemStyle: { color: '#91cc75' } },
      { name: '潜在成员', itemStyle: { color: '#fac858' } }
    ];

    // 设置节点数据
    const nodes = filteredNodes.map(node => ({
      id: node.id,
      name: node.name,
      value: node.value,
      symbolSize: node.value, // 节点大小
      category: node.type === 'current' ? 0 : node.type === 'manager' ? 1 : 2, // 节点类别
      label: {
        show: true,
        position: 'right',
        formatter: node.name,
        fontSize: 14,
        fontWeight: 'bold'
      },
      // 高亮选中的节点
      itemStyle: {
        // 如果有选中的成员，且当前节点是选中的成员，则高亮显示
        borderWidth: selectedMember && selectedMember.id === node.id ? 3 : 0,
        borderColor: '#ff0000',
      }
    }));

    // 设置连线数据，减少文字显示
    const links = filteredLinks.map(link => ({
      source: link.source,
      target: link.target,
      value: link.value,
      lineStyle: {
        width: link.value / 2, // 线条粗细
        // 根据关系类型设置不同的颜色
        color: link.type === 'resource' ? '#ff7f0e' : 
               link.type === 'need' ? '#2ca02c' : 
               link.type === 'location' ? '#9467bd' : 
               link.type === 'interest' ? '#8c564b' : '#d62728',
        curveness: 0.3, // 连线曲率
        opacity: 0.7 // 透明度，使图看起来不那么拥挤
      },
      // 不在连线上直接显示文字，只在tooltip中显示
      label: {
        show: false
      }
    }));

    // 使用any类型绕过类型检查
    const option: any = {
      title: {
        text: '成员关系图谱',
        subtext: '点击节点查看成员详情，悬停查看关系说明',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          // 根据节点或连线类型展示不同的提示信息
          if (params.dataType === 'node') {
            const member = members.find(m => m.id === params.data.id);
            if (!member) return params.name;
            
            return `
              <div style="font-weight:bold;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:5px">
                ${member.nickname}
              </div>
              <div>位置: ${member.location}</div>
              <div>类型: ${member.type === 'current' ? '现有成员' : member.type === 'manager' ? '社群管理者' : '潜在成员'}</div>
              <div>资源数: ${member.resources.length}</div>
              <div>需求数: ${member.needs.length}</div>
              <div style="margin-top:5px;color:#666">点击查看详情</div>
            `;
          } else if (params.dataType === 'edge') {
            // 为连线提供更详细的tooltip
            const source = members.find(m => m.id === params.data.source);
            const target = members.find(m => m.id === params.data.target);
            const linkData = filteredLinks.find(
              l => l.source === params.data.source && l.target === params.data.target
            );
            
            if (!source || !target || !linkData) return '未知关系';
            
            // 根据关系类型定制显示内容
            let relationTypeText = '';
            switch(linkData.type) {
              case 'resource':
                relationTypeText = '资源匹配';
                break;
              case 'interest':
                relationTypeText = '共同兴趣';
                break;
              case 'location':
                relationTypeText = '地理位置';
                break;
              default:
                relationTypeText = '关系';
            }
            
            return `
              <div style="font-weight:bold;color:#333;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:5px">
                ${relationTypeText}
              </div>
              <div style="margin-bottom:8px">${source.nickname} → ${target.nickname}</div>
              <div style="color:#666;font-size:13px">${linkData.description}</div>
            `;
          }
          
          return '';
        }
      },
      legend: {
        data: categories.map(category => category.name),
        orient: 'horizontal',
        left: 'right'
      },
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          name: '成员关系',
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: links,
          categories: categories,
          roam: true, // 允许缩放和平移
          draggable: true, // 允许拖拽调整节点位置
          label: {
            position: 'right',
            formatter: '{b}'
          },
          lineStyle: {
            color: 'source',
            curveness: 0.3
          },
          emphasis: {
            focus: 'adjacency', // 高亮相邻节点
            lineStyle: {
              width: 6
            }
          },
          force: {
            repulsion: 200, // 增加节点之间的斥力，使布局更分散
            gravity: 0.1, // 重力
            edgeLength: 120, // 增加边长，减少文字重叠
            friction: 0.6 // 摩擦系数
          }
        }
      ]
    };
    
    return option;
  };

  // 图表事件处理
  const onChartClick = (params: any) => {
    if (params.dataType === 'node') {
      // 点击节点时，设置选中的成员
      const clickedMemberId = params.data.id;
      const member = members.find(m => m.id === clickedMemberId);
      if (member) {
        setSelectedMember(member);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width, height }}>
      <div className="filter-controls" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={() => setFilterType('all')} 
          style={{ 
            margin: '0 5px', 
            padding: '5px 10px', 
            background: filterType === 'all' ? '#1890ff' : '#f0f0f0',
            color: filterType === 'all' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          全部关系
        </button>
        <button 
          onClick={() => setFilterType('resource')} 
          style={{ 
            margin: '0 5px', 
            padding: '5px 10px', 
            background: filterType === 'resource' ? '#ff7f0e' : '#f0f0f0',
            color: filterType === 'resource' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          资源匹配
        </button>
        <button 
          onClick={() => setFilterType('interest')} 
          style={{ 
            margin: '0 5px', 
            padding: '5px 10px', 
            background: filterType === 'interest' ? '#8c564b' : '#f0f0f0',
            color: filterType === 'interest' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          共同兴趣
        </button>
        <button 
          onClick={() => setFilterType('location')} 
          style={{ 
            margin: '0 5px', 
            padding: '5px 10px', 
            background: filterType === 'location' ? '#9467bd' : '#f0f0f0',
            color: filterType === 'location' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          地理位置
        </button>
      </div>

      <ReactECharts
        option={getOption()}
        style={{ height: 'calc(100% - 40px)' }}
        onEvents={{ click: onChartClick }}
      />
    </div>
  );
};

export default RelationGraph; 