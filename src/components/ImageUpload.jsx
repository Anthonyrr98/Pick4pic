import { useState, useRef } from 'react'
import './ImageUpload.css'

const ImageUpload = ({ onUpload, maxSize = 5 * 1024 * 1024, accept = 'image/*' }) => {
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件大小
    if (file.size > maxSize) {
      alert(`图片大小不能超过 ${maxSize / 1024 / 1024}MB`)
      return
    }

    setUploading(true)

    try {
      // 转换为 base64
      const base64 = await fileToBase64(file)
      setPreview(base64)
      
      // 保存到 localStorage (IndexedDB)
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await saveImageToStorage(imageId, base64, file.name)
      
      if (onUpload) {
        onUpload(base64, imageId)
      }
    } catch (error) {
      console.error('图片上传失败:', error)
      alert('图片上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const saveImageToStorage = async (id, base64, filename) => {
    try {
      const { saveToDB } = await import('../services/storageService')
      await saveToDB(`image_${id}`, { base64, filename, uploadedAt: new Date().toISOString() })
    } catch (error) {
      console.error('保存图片失败:', error)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {preview ? (
        <div className="image-upload__preview">
          <img src={preview} alt="预览" />
          <button
            type="button"
            onClick={handleRemove}
            className="image-upload__remove"
            aria-label="删除"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="image-upload__button"
          disabled={uploading}
        >
          {uploading ? '上传中...' : '📷 上传图片'}
        </button>
      )}
    </div>
  )
}

export default ImageUpload

