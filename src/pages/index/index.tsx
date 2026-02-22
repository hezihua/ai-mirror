import React, { useState, useCallback } from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import { useNavigationBar, useToast } from "taro-hooks";
import Taro from "@tarojs/taro";
import './index.less'

const Index = () => {
  const { setTitle } = useNavigationBar({ title: "AI试衣间" });
  const { show } = useToast({ mask: true });

  const [clothesImage, setClothesImage] = useState<string>('');
  const [personImage, setPersonImage] = useState<string>('');
  const [resultImage, setResultImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);



  const handleGenerate = useCallback(async () => {
    if (!clothesImage || !personImage) {
      show({ title: "请上传衣服和人像图片" });
      return;
    }

    setLoading(true);
    show({ title: "正在生成试衣效果..." });

    try {
      // 这里调用第三方AI试衣API
      // 注意：实际使用时需要替换为真实的API调用
      
      // 1. 首先需要将本地图片上传到服务器获取可访问的URL
      // 2. 然后调用AI试衣API进行图片合成
      // 3. 最后获取生成的结果图片URL
      
      // 模拟API调用过程
      console.log('开始调用AI试衣API');
      console.log('衣服图片:', clothesImage);
      console.log('人像图片:', personImage);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 模拟生成结果
      // 实际项目中，这里应该是API返回的生成图片URL
      setResultImage(personImage);
      
      show({ title: "生成成功" });
      console.log('生成成功');
    } catch (error) {
      show({ title: "生成失败，请重试" });
      console.error('生成失败:', error);
    } finally {
      setLoading(false);
    }
  }, [clothesImage, personImage, show]);

  return (
    <View className="wrapper">
      <Text className="title">AI试衣间</Text>
      <Text className="desc">上传衣服和人像图片，生成试衣效果</Text>

      <View className="upload-section">
        <Text className="section-title">上传衣服图片</Text>
        <View 
          className="upload-area"
          onClick={async () => {
            try {
              const res = await Taro.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
              });
              if (res.tempFilePaths && res.tempFilePaths.length > 0) {
                setClothesImage(res.tempFilePaths[0]);
                show({ title: "衣服图片上传成功" });
              }
            } catch (error) {
              show({ title: "衣服图片选择失败，请重试" });
              console.error('选择衣服图片失败:', error);
            }
          }}
        >
          {clothesImage ? (
            <Image className="uploaded-image" src={clothesImage} />
          ) : (
            <View className="upload-placeholder">
              <Text>点击上传衣服图片</Text>
            </View>
          )}
        </View>
      </View>

      <View className="upload-section">
        <Text className="section-title">上传人像图片</Text>
        <View 
          className="upload-area"
          onClick={async () => {
            try {
              const res = await Taro.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
              });
              if (res.tempFilePaths && res.tempFilePaths.length > 0) {
                setPersonImage(res.tempFilePaths[0]);
                show({ title: "人像图片上传成功" });
              }
            } catch (error) {
              show({ title: "人像图片选择失败，请重试" });
              console.error('选择人像图片失败:', error);
            }
          }}
        >
          {personImage ? (
            <Image className="uploaded-image" src={personImage} />
          ) : (
            <View className="upload-placeholder">
              <Text>点击上传人像图片</Text>
            </View>
          )}
        </View>
      </View>

      <Button 
        className="generate-button" 
        onClick={handleGenerate}
        disabled={loading || !clothesImage || !personImage}
      >
        {loading ? '生成中...' : '生成试衣效果'}
      </Button>

      {resultImage && (
        <View className="result-section">
          <Text className="section-title">试衣效果</Text>
          <Image className="result-image" src={resultImage} />
        </View>
      )}
    </View>
  );
};

export default Index;
