import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from google import genai
from google.genai import types

# 初始化Flask应用
app = Flask(__name__)
CORS(app)  # 启用CORS，允许前端访问

# 设置API密钥
# 从环境变量获取API密钥，如果没有则使用默认值（推荐在生产环境中设置环境变量）
API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("警告: 未设置GEMINI_API_KEY环境变量，API调用将失败")
    # 在开发环境可以设置一个默认值，但不要在生产代码或GitHub中包含真实密钥
    # API_KEY = "your_default_key_for_development"

# 初始化Gemini客户端
client = genai.Client(api_key=API_KEY)
model_name = "gemini-2.0-pro-exp-02-05"

@app.route('/api/analyze-member', methods=['POST'])
def analyze_member():
    """分析成员能力和特点"""
    data = request.json
    member = data.get('member')
    
    if not member:
        return jsonify({"error": "Missing member data"}), 400
    
    # 构建提示
    prompt = f"""
    请分析以下成员信息，提取关键能力和特点标签：
    
    昵称: {member.get('nickname')}
    地点: {member.get('location')}
    自我介绍: {member.get('introduction')}
    资源:
    {chr(10).join([f"- {r.get('content')}" for r in member.get('resources', [])])}
    需求:
    {chr(10).join([f"- {n.get('content')}" for n in member.get('needs', [])])}
    
    请提取5-10个关键能力和特点标签，每个标签不超过4个字，使用JSON数组格式返回。
    示例: ["AI", "创业", "社群", "金融", "产品"]
    """
    
    try:
        # 配置生成参数
        generate_content_config = types.GenerateContentConfig(
            temperature=0.7,
            top_p=0.95,
            top_k=64,
            max_output_tokens=2048,
            response_mime_type="text/plain",
        )
        
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)],
            ),
        ]
        
        # 调用Gemini API
        response = client.models.generate_content(
            model=model_name,
            contents=contents,
            config=generate_content_config,
        )
        
        text = response.text
        
        # 尝试解析返回的JSON
        try:
            tags = json.loads(text)
            if isinstance(tags, list):
                return jsonify(tags)
            else:
                # 如果不是数组，尝试提取标签
                import re
                matches = re.findall(r'"([^"]+)"', text)
                if matches:
                    return jsonify(matches)
                return jsonify({"error": "Failed to parse response"}), 500
        except json.JSONDecodeError:
            # 如果解析JSON失败，尝试提取引号内的文本作为标签
            import re
            matches = re.findall(r'"([^"]+)"', text)
            if matches:
                return jsonify(matches)
            return jsonify({"error": "Failed to parse response"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/match-analysis', methods=['POST'])
def match_analysis():
    """生成成员匹配分析"""
    data = request.json
    source_member = data.get('sourceMember')
    target_member = data.get('targetMember')
    
    if not source_member or not target_member:
        return jsonify({"error": "Missing member data"}), 400
    
    # 构建提示
    prompt = f"""
    请分析以下两位成员的信息，找出他们之间可能的匹配点和协作机会：
    
    成员A:
    昵称: {source_member.get('nickname')}
    地点: {source_member.get('location')}
    自我介绍: {source_member.get('introduction')}
    资源:
    {chr(10).join([f"- {r.get('content')}" for r in source_member.get('resources', [])])}
    需求:
    {chr(10).join([f"- {n.get('content')}" for n in source_member.get('needs', [])])}
    标签: {', '.join(source_member.get('tags', [])) or '无'}
    
    成员B:
    昵称: {target_member.get('nickname')}
    地点: {target_member.get('location')}
    自我介绍: {target_member.get('introduction')}
    资源:
    {chr(10).join([f"- {r.get('content')}" for r in target_member.get('resources', [])])}
    需求:
    {chr(10).join([f"- {n.get('content')}" for n in target_member.get('needs', [])])}
    标签: {', '.join(target_member.get('tags', [])) or '无'}
    
    请以JSON格式返回以下内容：
    1. 匹配评分(0-100)
    2. 匹配理由(数组形式，至少3条)
    3. 潜在合作价值建议(一段话)
    
    格式如下:
    {{
      "matchScore": 85,
      "reasons": ["理由1", "理由2", "理由3"],
      "potentialValue": "潜在合作价值建议"
    }}
    """
    
    try:
        # 配置生成参数
        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            top_p=0.95,
            top_k=64,
            max_output_tokens=8192,
            response_mime_type="text/plain",
        )
        
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)],
            ),
        ]
        
        # 调用Gemini API
        response = client.models.generate_content(
            model=model_name,
            contents=contents,
            config=generate_content_config,
        )
        
        text = response.text
        
        # 尝试提取并解析JSON
        import re
        json_match = re.search(r'{[\s\S]*}', text)
        if json_match:
            json_text = json_match.group(0)
            try:
                result = json.loads(json_text)
                return jsonify({
                    "sourceId": source_member.get('id'),
                    "targetId": target_member.get('id'),
                    "matchScore": result.get('matchScore', 50),
                    "reasons": result.get('reasons', []),
                    "potentialValue": result.get('potentialValue', "")
                })
            except json.JSONDecodeError:
                return jsonify({"error": "Failed to parse response"}), 500
        else:
            return jsonify({"error": "No JSON found in response"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # 启动服务器，监听所有接口，端口8000
    app.run(host='0.0.0.0', port=8000, debug=True) 