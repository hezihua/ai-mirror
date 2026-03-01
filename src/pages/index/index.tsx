import React, { useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";

const Index = () => {
  const [result, setResult] = useState<string>('点击按钮测试云函数调用');

  const handleTest = async () => {
    setResult('正在调用...');
    
    try {
      const res = await Taro.cloud.callFunction({
        name: 'callHunyuanAPI',
        data: {
          clothesImage: 'https://cos.ap-guangzhou.myqcloud.com/cloth.jpg',
          personImage: 'https://cos.ap-guangzhou.myqcloud.com/model.jpg',
          clothesType: 'Upper-body'
        }
      });

      setResult('调用成功！\n' + JSON.stringify(res.result, null, 2));
    } catch (error) {
      setResult('调用失败：\n' + JSON.stringify(error, null, 2));
    }
  };

  return (
    <View style={{ padding: '20px' }}>
      <Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>云函数测试</Text>
      <Text style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>点击下方按钮测试云函数调用</Text>
      
      <Button 
        style={{ 
          width: '100%', 
          height: '44px', 
          backgroundColor: '#1890ff', 
          color: 'white',
          marginBottom: '20px'
        }} 
        onClick={handleTest}
      >
        调用云函数
      </Button>

      <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>返回结果：</Text>
      <Text style={{ fontSize: '12px', color: '#333', whiteSpace: 'pre-wrap' }}>{result}</Text>
    </View>
  );
};

export default Index;
