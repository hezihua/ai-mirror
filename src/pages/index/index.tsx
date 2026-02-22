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



  // 将本地图片转换为base64
  const imageToBase64 = useCallback((filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      Taro.getFileSystemManager().readFile({
        filePath,
        encoding: 'base64',
        success: (res) => {
          resolve(`data:image/jpeg;base64,${res.data}`);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!clothesImage || !personImage) {
      show({ title: "请上传衣服和人像图片" });
      return;
    }

    setLoading(true);
    show({ title: "正在生成试衣效果..." });

    try {
      console.log('开始将图片转换为base64');
      const clothesBase64 = await imageToBase64(clothesImage);
      const personBase64 = await imageToBase64(personImage);
      console.log('图片转换完成');

      console.log('开始调用云函数');
      const result = await Taro.cloud.callFunction({
        name: 'callHunyuanAPI',
        data: {
          clothesImage: clothesBase64,
          personImage: personBase64
        }
      });

      console.log('云函数响应:', result);

      if (result.result && result.result.success && result.result.data && result.result.data.imageUrl) {
        setResultImage(result.result.data.imageUrl);
        show({ title: "生成成功" });
        console.log('生成成功');
      } else {
        throw new Error(result.result?.error || '生成失败');
      }
    } catch (error) {
      show({ title: "生成失败，请重试" });
      console.error('生成失败:', error);
    } finally {
      setLoading(false);
    }
  }, [clothesImage, personImage, show, imageToBase64]);

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
