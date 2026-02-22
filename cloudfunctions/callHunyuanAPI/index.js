const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  try {
    const { clothesImage, personImage } = event
    
    console.log('开始调用混元生图API')
    
    const result = await cloud.openapi.aiPlatform.text2image({
      prompt: "请帮我将衣服图片合成到人像图片上，生成一张试衣效果图。注意要保持合成的自然度，确保衣服贴合人像的体型和姿势。",
      clothesImage: clothesImage,
      personImage: personImage,
      size: "1024x1024"
    })
    
    console.log('混元生图API调用成功:', result)
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('调用混元生图API失败:', error)
    return {
      success: false,
      error: error.message || '调用失败，请检查云开发配置'
    }
  }
}

