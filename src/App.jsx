import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Save, 
  X, 
  Sliders,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  ArrowLeft,
  Wand2,
  Terminal,
  Send,
  Download,
  Upload,
  Clock,
  Settings,
  HardDrive,
  Lock,
  Zap,
  Globe,
  Key
} from 'lucide-react';

// 預設的風格圖庫，用於自動分派縮圖
const DEFAULT_THUMBNAILS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', // Abstract
  'https://images.unsplash.com/photo-1615751072497-5f5169febeca?q=80&w=600&auto=format&fit=crop', // Neon
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop', // Portrait
  'https://images.unsplash.com/photo-1633167606207-d840b507049c?q=80&w=600&auto=format&fit=crop', // Space
  'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop', // Neon City
  'https://images.unsplash.com/photo-1620641788421-7f1c338e61a9?q=80&w=600&auto=format&fit=crop', // Paint
];

// 模擬的初始資料 (已整合您的 13 組風格)
const INITIAL_DATA = [
  {
    "id": "1768295797760",
    "title": "少女漫畫",
    "prompt": "Overall Design Settings:\n  Tone: \"Girly, Love, Dream, Shoujo Manga, Sparkle.\"\n  Visual Identity:\n    Background Color: \"#FFFFFF (White)\"\n    Text Color: \"#000000 (Black)\"\n    Accent Color: \"Screen Tone Gray.\"\n    Image Style:\n      Features: \"70-80s Shoujo Manga style.\"\n      Effects: \"Roses falling in background, Sparkling Stars.\"\n      Eyes: \"Large eyes with stars.\"\n      Atmosphere: \"Romantic and Emotional.\"\n  Typography:\n    Heading: \"Round Gothic, or Antique.\"\n    Style: \"Decorative and Cute.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/11tnGs6eNJArWzfr0GXKvMLhFt8jrLSBV",
    "updatedAt": "2026-01-13T09:25:03.577Z"
  },
  {
    "id": "1768286603435",
    "title": "瑞士風",
    "prompt": "Overall Design Settings:\n  Tone: \"International Style, Discipline, Modern, Clear, Objective.\"\n  Visual Identity:\n    Background Color: \"#F0F0F0 (Light Gray)\"\n    Text Color: \"#000000 (Black)\"\n    Accent Color: \"#FF0000 (Red) only.\"\n    Image Style:\n      Features: \"Principles of Swiss Typography.\"\n      Composition: \"Modular Grid System.\"\n      Elements: \"Typesetting itself as main visual.\"\n      Photo: \"Combination of Monochrome photo and Color plane.\"\n  Typography:\n    Heading: \"Helvetica.\"\n    Style: \"Flush Left, Large Heading.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1c_N_xkEtRstr1mXyWt6O5hfx4IqrrN2A",
    "updatedAt": "2026-01-13T06:45:59.625Z"
  },
  {
    "id": "1768286416643",
    "title": "熱能光譜",
    "prompt": "全体デザイン設定:\n  トーン: \"科学的, 異質, 視覚化, 温度, 分析。\"\n  ビジュアル・アイデンティティ:\n    背景色: \"#000080 (Cold Blue)\"\n    文字色: \"#FFFFFF (White)\"\n    アクセントカラー: \"#FF0000 (Hot Red)\"、\"#FFFF00 (Warm Yellow)\"\n    画像スタイル:\n      特徴: \"サーモグラフィーによる熱分布の可視化。\"\n      色調: \"青（冷）から赤・白（熱）へのスペクトルカラー。\"\n      イメージャリ: \"人物、建物、機械の熱画像。\"\n      質感: \"デジタルなグラデーション。\"\n  タイポグラフィ:\n    見出し: \"HUD風のテクニカルフォント。\"\n    スタイル: \"温度数値のオーバーレイ。\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1qyTd-jlUY3RoTz7GuzPpyoQW_ElLantu",
    "updatedAt": "2026-01-13T06:42:44.068Z"
  },
  {
    "id": "1768286152943",
    "title": "向量極簡工業風格",
    "prompt": "Overall Design Settings:\n  Tone: \"Sincere, Professional, Refined, Serene\"\n  Visual Identity:\n    Background Color: \"Pure White (#FFFFFF) or Pale Blue Gray (#F5F7FA)\"\n    Text Color: \"Navy Blue (#0A2540) - Conveys trust\"\n    Accent Color: \"Royal Blue (#0052CC) or Intelligent Blue (#00B8D9)\"\n    Image Style:\n      Features: \"Flat Vector Illustration, Geometric Shapes, Clean Composition\"\n      Shape: \"Sharp Edges, or Orderly Circles\"\n  Typography:\n    Heading: \"Modern Bold Sans-serif (Inter, Helvetica). Wide Kerning for Intellectual Feel.\"\n    Body: \"Clean Sans-serif. Readability First.\"\n    Numbers: \"Monospace or Geometric Numerals. Shows Data Precisely.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1hIKMh835M_Gz7hA78qTVkkSjBUiy5RRk",
    "updatedAt": "2026-01-13T06:39:43.967Z"
  },
  {
    "id": "1768285797200",
    "title": "移軸微縮",
    "prompt": "Overall Design Settings:\n  Tone: \"Cute, Miniature Garden, Toy, Bird's-eye view, Unreal.\"\n  Visual Identity:\n    Background Color: \"Real photo color of Urban or Landscape.\"\n    Text Color: \"#FFFFFF (White)\"\n    Accent Color: \"Primary colors with increased saturation.\"\n    Image Style:\n      Features: \"Miniature effect with Tilt-shift lens.\"\n      Effects: \"Strong blur at top and bottom, Focus in center, Color saturation emphasis.\"\n      Imagery: \"Urban, Cars, People looking like toys.\"\n      Viewpoint: \"Bird's-eye view from diagonally above.\"\n  Typography:\n    Heading: \"Rounded Sans-serif.\"\n    Style: \"Toy package style.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/11zzmW6Bdo3yubL63w1xoEufOJnMflpuW",
    "updatedAt": "2026-01-13T06:35:19.120Z"
  },
  {
    "id": "1768285142935",
    "title": "建築藍晒圖",
    "prompt": "Overall Design Settings:\n  Tone: \"Planning, Design, Industrial, Precise, Intellectual.\"\n  Visual Identity:\n    Background Color: \"#0047AB (Cobalt Blue) - Blueprint Color.\"\n    Text Color: \"#FFFFFF (White)\"\n    Accent Color: \"#87CEEB (Sky Blue)\"\n    Image Style:\n      Features: \"Aesthetics of Architectural Drawing (Blueprint).\"\n      Line Art: \"White Line Drafting.\"\n      Imagery: \"Floor Plan, Cross-section, Dimension Lines.\"\n      Composition: \"Geometric & Orderly Arrangement.\"\n  Typography:\n    Heading: \"Drafting Letters (Architect's Daughter style).\"\n    Style: \"All Capitals, Disciplined.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1TVTcBKUdWJDJzWs988FTOVd1f560psu_",
    "updatedAt": "2026-01-13T06:27:37.241Z"
  },
  {
    "id": "1768285016812",
    "title": "黏土定格動畫",
    "prompt": "Overall Design Settings:\n  Tone: \"Handmade, Fairy Tale, Fun, Soft, Analog.\"\n  Visual Identity:\n    Background Color: \"#87CEEB (Sky Blue) - Set sky.\"\n    Text Color: \"#FFFFFF (White)\"\n    Accent Color: \"#FF6347 (Tomato), #FFD700 (Gold)\"\n    Image Style:\n      Features: \"World of Clay Animation.\"\n      Texture: \"Clay with fingerprints, slight unevenness.\"\n      Lighting: \"Studio lighting with Natural Shadow.\"\n      Motif: \"Round characters and houses.\"\n  Typography:\n    Heading: \"Round Gothic, Handwritten.\"\n    Style: \"Dimensional letters made of clay.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1jdcx5LEDf1KdwLZE4Bjztc4WY9OebQu_",
    "updatedAt": "2026-01-13T06:18:34.189Z"
  },
  {
    "id": "1768284863404",
    "title": "塗鴉筆記本",
    "prompt": "Overall Design Settings:\n  Tone: \"Creative, Rough, Personal, Brainstorming, Authentic.\"\n  Visual Identity:\n    Background Color: \"Lined Notebook Paper, or Graph Paper.\"\n    Text Color: \"#0000CD (Blue Ballpoint ink)\"\n    Accent Color: \"#FF0000 (Red correction ink), #FFFFFF (Paper)\"\n    Image Style:\n      Features: \"Drawn on Lined Paper, Casual Handwritten Aesthetic.\"\n      Imagery: \"Stick Figures, Stars, Arrows, Coffee Stains.\"\n      Composition: \"Marginalia Style, Free Form, Brainstorming Style.\"\n  Typography:\n    Heading: \"Handwritten Font.\"\n    Style: \"Messy, Scribbled, Underlined.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1FD9QwjVpRDFJIGyICyhbJf3F5tU-tdmp",
    "updatedAt": "2026-01-13T06:16:33.236Z"
  },
  {
    "id": "1768283918182",
    "title": "手寫粉筆",
    "prompt": "Overall Design Settings:\n  Tone: \"Familiarity, Handmade, Cafe, Daily Life, Simple.\"\n  Visual Identity:\n    Background Color: \"#2F4F4F (Dark Slate Gray) - Blackboard Color.\"\n    Text Color: \"#FFFFFF (White) - Chalk.\"\n    Accent Color: \"#FF6347 (Tomato), #FFD700 (Yellow)\"\n    Image Style:\n      Features: \"Blackboard Art or Handwritten Menu style.\"\n      Texture: \"Chalk dust, Scratches, Erasure marks.\"\n      Shape: \"Handwritten illustrations and frames.\"\n      Composition: \"Freehand loose layout.\"\n  Typography:\n    Heading: \"Hand-lettering style font.\"\n    Style: \"Uneven size and tilt.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1WNY8buvbJzqV3_xNaXFOYXiylkcohLto",
    "updatedAt": "2026-01-13T06:12:53.815Z"
  },
  {
    "id": "1768283661377",
    "title": "復古半色調科幻",
    "prompt": "Overall Design Settings:\n  Tone: \"Luxurious, Jazz, Frenzy, Gold, Geometric.\"\n  Visual Identity:\n    Background Color: \"#000000 (Black Velvet)\"\n    Text Color: \"#FFD700 (Gold)\"\n    Accent Color: \"#DAA520 (Goldenrod), #F0E68C (Khaki)\"\n    Image Style:\n      Features: \"Great Gatsby style party.\"\n      Motif: \"Geometric frame decoration, Champagne glass, Fireworks.\"\n      Texture: \"Gold leaf, Rich luster.\"\n      Composition: \"Symmetrical gate structure.\"\n  Typography:\n    Heading: \"Art Deco Typeface.\"\n    Style: \"Thin lines and Geometric decoration.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1wjryZ7QybZQMujHEHOIAFxzvNyUiuMW5",
    "updatedAt": "2026-01-13T06:07:08.044Z"
  },
  {
    "id": "1768283288115",
    "title": "粉彩多邊形遊戲",
    "prompt": "Overall Design Settings:\n  Tone: \"Nostalgic, Cute, Digital, Simple, Calm.\"\n  Visual Identity:\n    Background Color: \"Simple gradient sky.\"\n    Text Color: \"#FFB6C1 (Light Pink)\"\n    Accent Color: \"#98FB98 (Mint), #87CEFA (Light Blue), #FFFFE0 (Light Yellow)\"\n    Image Style:\n      Features: \"Aesthetics of early 3D computer graphics with soft lighting.\"\n      Shape: \"Polygon mesh, Triangles, Chamfered surfaces.\"\n      Effects: \"Flat shading (no smoothing), Ambient Occlusion.\"\n      Composition: \"Isometric view or 3/4 view of the scene.\"\n  Typography:\n    Heading: \"Rounded Digital Font.\"\n    Style: \"Simple UI overlay.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1aQg3tZzNMNwO1DpknAG89CeS8E2xNkF6",
    "updatedAt": "2026-01-13T06:05:52.967Z"
  },
  {
    "id": "1768280647359",
    "title": "印象派油畫",
    "prompt": "Overall Design Settings:\n  Tone: \"Artistic, Emotional, Scenic, Timeless, Expressive.\"\n  Visual Identity:\n    Background Color: \"Canvas Texture.\"\n    Text Color: \"Mix of Pastel and Vivid highlights.\"\n    Accent Color: \"#F0E68C (Khaki), #87CEEB (Sky Blue), #DDA0DD (Plum)\"\n    Image Style:\n      Features: \"Fine Art style mimicking thick brushwork and focus on light.\"\n      Imagery: \"Painterly style landscape, Portrait, Still life.\"\n      Effects: \"Impasto (Thick paint texture), Visualization of brushstrokes.\"\n      Composition: \"Organic, Focus on Light and Shadow, Painterly Balance.\"\n  Typography:\n    Heading: \"Classic Serif (e.g. Garamond).\"\n    Style: \"Elegant, casually integrated.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1r08jazIs7qL9JuBpt9iEV3mJj5lDSrLW",
    "updatedAt": "2026-01-13T06:04:48.536Z"
  },
  {
    "id": "1768280570864",
    "title": "北歐風極簡自然風",
    "prompt": "Overall Design Settings:\n  Tone: \"Nordic, Living, Stylish, Natural, Simple.\"\n  Visual Identity:\n    Background Color: \"#FFFFFF (White)\"\n    Text Color: \"#4A4A4A (Dark Gray)\"\n    Accent Color: \"#8FBC8F (Natural Green), #DEB887 (Wood)\"\n    Image Style:\n      Features: \"Nordic textile-like patterns.\"\n      Motif: \"Simplified leaves, birds, flowers.\"\n      Color Tone: \"Calm earth colors and White.\"\n      Atmosphere: \"Bright and cozy.\"\n  Typography:\n    Heading: \"Geometric Sans-serif.\"\n    Style: \"Arrangement utilizing white space.\"",
    "thumbnail": "https://lh3.googleusercontent.com/d/1zEkQc4kPsL4b5tAGiCmHMJlQVokYFQcX",
    "updatedAt": "2026-01-13T06:13:43.109Z"
  }
];

// 主應用程式
export default function App() {
  // 資料狀態
  const [prompts, setPrompts] = useState([]);
  
  // 視圖狀態: 'library' | 'generator' | 'settings'
  const [currentView, setCurrentView] = useState('library');
  
  // 全域設定狀態 (新增 apiConfig)
  const [appSettings, setAppSettings] = useState({
    defaultWidth: 1024,
    defaultHeight: 1024,
    defaultSteps: 30,
    apiUrl: '', // API 網址
    apiKey: ''  // API 金鑰 (如果需要)
  });

  // 互動狀態
  const [activePrompt, setActivePrompt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  
  // 新增：圖片生成狀態
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const fileInputRef = useRef(null);
  
  // 權限驗證狀態
  const [authAction, setAuthAction] = useState(null); 
  const [passwordInput, setPasswordInput] = useState('');

  // 輔助狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [deleteId, setDeleteId] = useState(null); 
  const [confirmReset, setConfirmReset] = useState(false);

  // 初始化
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('nano-banana-prompts-v2');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) setPrompts(parsedData);
        else setPrompts(INITIAL_DATA);
      } else {
        setPrompts(INITIAL_DATA);
      }

      const savedSettings = localStorage.getItem('nano-banana-settings');
      if (savedSettings) {
        setAppSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('讀取 LocalStorage 發生錯誤:', error);
      setPrompts(INITIAL_DATA);
    }
  }, []);

  // 儲存資料
  useEffect(() => {
    if (prompts.length > 0) {
      localStorage.setItem('nano-banana-prompts-v2', JSON.stringify(prompts));
    }
  }, [prompts]);

  // 儲存設定
  useEffect(() => {
    localStorage.setItem('nano-banana-settings', JSON.stringify(appSettings));
  }, [appSettings]);

  const handleToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getRandomThumbnail = () => {
    return DEFAULT_THUMBNAILS[Math.floor(Math.random() * DEFAULT_THUMBNAILS.length)];
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // --- 資料匯入匯出 ---
  // (與先前相同，省略部分註解以節省空間)
  const handleExport = () => {
    const exportData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      settings: appSettings,
      prompts: prompts
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nano-banana-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleToast('已匯出完整備份 (包含設定)');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          setPrompts(importedData);
          handleToast('舊版資料匯入成功！');
        } else if (importedData.prompts && Array.isArray(importedData.prompts)) {
          setPrompts(importedData.prompts);
          if (importedData.settings) setAppSettings(importedData.settings);
          handleToast('完整備份匯入成功！');
        } else {
          handleToast('檔案格式錯誤');
        }
      } catch (err) {
        handleToast('無法解析 JSON');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // --- 權限驗證邏輯 ---
  const requestAuth = (e, type, data) => {
    e.stopPropagation();
    setAuthAction({ type, data });
    setPasswordInput('');
  };

  const verifyAuth = () => {
    if (passwordInput === '1206') {
      if (authAction.type === 'edit') {
        setActivePrompt({ ...authAction.data });
        setIsModalOpen(true);
      } else if (authAction.type === 'delete') {
        setDeleteId(authAction.data);
      }
      setAuthAction(null);
      setPasswordInput('');
      handleToast('權限驗證成功');
    } else {
      handleToast('密碼錯誤，拒絕存取');
    }
  };

  // --- 管理邏輯 ---
  const openCreator = () => {
    setActivePrompt({
      id: Date.now().toString(),
      title: '',
      prompt: '',
      thumbnail: '',
      updatedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const executeDelete = () => {
    if (deleteId) {
      const newPrompts = prompts.filter(p => p.id !== deleteId);
      setPrompts(newPrompts);
      if (newPrompts.length === 0) {
         localStorage.removeItem('nano-banana-prompts-v2');
      }
      handleToast('已刪除 Prompt');
      setDeleteId(null);
    }
  };

  const handleSave = () => {
    if (!activePrompt.title.trim()) {
      handleToast('請輸入標題');
      return;
    }
    if (!activePrompt.prompt.trim()) {
      handleToast('請輸入風格 Prompt');
      return;
    }

    let finalThumbnail = activePrompt.thumbnail.trim();
    if (finalThumbnail.includes('drive.google.com')) {
      let fileId = '';
      const fileIdMatch = finalThumbnail.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        fileId = fileIdMatch[1];
      } else {
        const idMatch = finalThumbnail.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
          fileId = idMatch[1];
        }
      }
      if (fileId) {
        finalThumbnail = `https://lh3.googleusercontent.com/d/${fileId}`;
      }
    }

    const promptToSave = {
      ...activePrompt,
      thumbnail: finalThumbnail || getRandomThumbnail(),
      updatedAt: new Date().toISOString()
    };

    const exists = prompts.find(p => p.id === promptToSave.id);
    if (exists) {
      setPrompts(prompts.map(p => p.id === promptToSave.id ? promptToSave : p));
      handleToast('更新成功');
    } else {
      setPrompts([promptToSave, ...prompts]);
      handleToast('新增成功');
    }
    setIsModalOpen(false);
  };

  const handleReset = () => {
    localStorage.removeItem('nano-banana-prompts-v2');
    localStorage.removeItem('nano-banana-settings');
    setPrompts(INITIAL_DATA);
    setAppSettings({ defaultWidth: 1024, defaultHeight: 1024, defaultSteps: 30, apiUrl: '', apiKey: '' });
    handleToast('系統已完全重置');
    setConfirmReset(false);
  };

  // --- 產生器邏輯 (包含 API 呼叫) ---

  const enterGenerator = (prompt) => {
    setActivePrompt(prompt);
    setUserInput('');
    setGeneratedResult(null);
    setGeneratedImage(null); // 清除上次的圖片
    setIsGenerating(false);
    setCurrentView('generator');
    window.scrollTo(0, 0);
  };

  const generateFinalPayload = () => {
    if (!userInput.trim()) {
      handleToast('請輸入您想產生的內容描述');
      return null;
    }

    const finalPrompt = `${userInput}, ${activePrompt.prompt}`;

    const payload = {
      // 這裡可以根據您的 API 需求調整欄位
      prompt: finalPrompt,
      negative_prompt: "low quality, bad anatomy, worst quality, lowres",
      width: appSettings.defaultWidth,
      height: appSettings.defaultHeight,
      steps: appSettings.defaultSteps,
      cfg_scale: 7.0
    };

    const jsonStr = JSON.stringify(payload, null, 2);
    setGeneratedResult(jsonStr);
    return payload; // 回傳給 API 用
  };

  // --- 核心：呼叫 API 生成圖片 ---
  const handleApiGenerate = async () => {
    if (!appSettings.apiUrl) {
      handleToast('請先至「系統設定」填寫 API 網址！');
      return;
    }

    const payload = generateFinalPayload();
    if (!payload) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // 這是一個通用的 POST 請求範本
      const response = await fetch(appSettings.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': appSettings.apiKey ? `Bearer ${appSettings.apiKey}` : undefined // 如果有 Key 就帶上
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API 錯誤: ${response.status}`);
      }

      // 假設 API 回傳的是 JSON，其中包含 image_url 或 base64
      // 您可能需要根據實際 API 回傳格式調整這裡
      const data = await response.json();
      
      // 嘗試抓取圖片網址或 Base64
      const imgSource = data.output?.[0] || data.image_url || data.image || data.base64; 
      
      if (imgSource) {
        setGeneratedImage(imgSource);
        handleToast('圖片生成成功！');
      } else {
        handleToast('API 回傳成功，但找不到圖片欄位');
        console.log('API Response:', data);
      }

    } catch (error) {
      console.error('Generation failed:', error);
      handleToast(`生成失敗: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyResult = () => {
    if (generatedResult) {
      const textArea = document.createElement("textarea");
      textArea.value = generatedResult;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) handleToast('已複製 JSON 指令');
        else handleToast('複製失敗');
      } catch (err) {
        handleToast('複製發生錯誤');
      }
      document.body.removeChild(textArea);
    }
  };

  // --- UI 元件 ---

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".json"
      />

      {/* 頂部導航列 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('library')}>
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              N
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 hidden sm:block">
              Nano Banana <span className="text-yellow-500">Pro</span>
            </h1>
          </div>

          {currentView === 'library' && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="搜尋風格..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {currentView === 'library' ? (
              <>
                <button 
                  onClick={() => setCurrentView('settings')}
                  className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-50 relative group"
                  title="系統設定"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={openCreator}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-slate-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">新增</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => setCurrentView('library')}
                className="text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                回到列表
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* === 視圖 1: Library (列表) === */}
        {currentView === 'library' && (
          <>
            {/* ... Library UI (不變) ... */}
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">風格選擇</h2>
                <p className="text-slate-500 text-sm mt-1">點擊卡片即可開始產生圖片</p>
              </div>
              <div className="text-slate-400 text-xs hidden sm:block">
                共 {filteredPrompts.length} 種風格
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filteredPrompts.map(prompt => (
                <div 
                  key={prompt.id} 
                  onClick={() => enterGenerator(prompt)}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl hover:shadow-yellow-100/50 border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
                >
                  {/* ... Card Content (不變) ... */}
                  <div className="relative aspect-[3/2] bg-slate-100 overflow-hidden">
                    <img 
                      src={prompt.thumbnail} 
                      alt={prompt.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Preview"; }} 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                       <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2 shadow-lg">
                         <Wand2 className="w-4 h-4 text-yellow-500" />
                         使用此風格
                       </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-yellow-600 transition-colors">{prompt.title}</h3>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-4 flex-1">{prompt.prompt}</p>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-1 text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(prompt.updatedAt) || '初始資料'}</span>
                      </div>
                      <div className="flex gap-1 z-10">
                        <button onClick={(e) => requestAuth(e, 'edit', prompt)} className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={(e) => requestAuth(e, 'delete', prompt.id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div onClick={openCreator} className="group border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50/50 cursor-pointer transition-all min-h-[300px]">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors"><Plus className="w-8 h-8" /></div>
                <span className="font-medium">新增風格</span>
              </div>
            </div>
          </>
        )}

        {/* === 視圖 2: Generator (產生器 - 增強版) === */}
        {currentView === 'generator' && activePrompt && (
          <div className="animate-simple-fade-up max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 左側：風格資訊 */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 mb-4">
                    <img src={activePrompt.thumbnail} className="w-full h-full object-cover" alt="style" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">{activePrompt.title}</h3>
                  <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100 font-mono break-all">
                    {activePrompt.prompt}
                  </div>
                </div>
              </div>

              {/* 右側：輸入與生成 */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-yellow-500" />
                    輸入內容描述
                  </label>
                  <textarea 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="例如：一隻戴著太陽眼鏡的貓在海灘上喝可樂..."
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none text-slate-700"
                  />
                  <div className="mt-4 flex flex-wrap justify-end gap-3">
                    <button 
                      onClick={() => { generateFinalPayload(); handleToast('指令已更新'); }}
                      className="px-4 py-3 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors"
                    >
                      僅生成 JSON
                    </button>
                    <button 
                      onClick={handleApiGenerate}
                      disabled={isGenerating || !userInput.trim()}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all shadow-lg
                        ${isGenerating || !userInput.trim()
                          ? 'bg-slate-300 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 transform hover:-translate-y-0.5'}
                      `}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 fill-current" />
                          開始生成圖片 (API)
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 生成結果區域 */}
                {(generatedResult || generatedImage) && (
                  <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 animate-slide-in-right relative overflow-hidden">
                    
                    {/* 如果有圖片，顯示圖片 */}
                    {generatedImage && (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-bold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-green-400" /> 生成結果圖片
                          </h4>
                          <a 
                            href={generatedImage} 
                            download="generated-image.png" 
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <Download className="w-3 h-3" /> 下載圖片
                          </a>
                        </div>
                        <div className="rounded-lg overflow-hidden border border-slate-700 bg-black/50 flex justify-center">
                          <img src={generatedImage} alt="Generated" className="max-w-full h-auto max-h-[500px] object-contain" />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-4 relative z-10">
                      <h4 className="text-yellow-400 font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" /> 最終指令 (JSON Payload)
                      </h4>
                      <button 
                        onClick={copyResult}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 transition-colors"
                      >
                        <Copy className="w-3 h-3" /> 複製 JSON
                      </button>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-white/10">
                        {generatedResult}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === 視圖 3: Settings (設定頁面 - 新增 API 設定) === */}
        {currentView === 'settings' && (
          <div className="max-w-3xl mx-auto animate-simple-fade-up">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-slate-600" />
                  系統設定
                </h2>
                <p className="text-slate-500 text-sm mt-1">管理資料備份、預設值與 API 連線</p>
              </div>

              <div className="p-6 space-y-8">
                
                {/* 0. API 連線設定 (新增) */}
                <section>
                  <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> API 連線設定 (進階)
                  </h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-4">
                    <p className="text-xs text-blue-700 mb-2">
                      若您有架設 Stable Diffusion API 或其他繪圖後端，請在此填入資訊以啟用「直接生成」功能。
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">API 網址 (Endpoint URL)</label>
                      <input 
                        type="text" 
                        value={appSettings.apiUrl}
                        onChange={(e) => setAppSettings({...appSettings, apiUrl: e.target.value})}
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="e.g., http://127.0.0.1:7860/sdapi/v1/txt2img"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">API 金鑰 (Authorization Key) - 選填</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 w-4 h-4 text-blue-300" />
                        <input 
                          type="password" 
                          value={appSettings.apiKey}
                          onChange={(e) => setAppSettings({...appSettings, apiKey: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          placeholder="若 API 需要驗證，請在此填入 Key"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* 1. 資料管理區 */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" /> 資料管理
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                      <h4 className="font-bold text-slate-800 mb-1">匯出備份 (Backup)</h4>
                      <p className="text-xs text-slate-500 mb-4">下載所有風格資料與設定為 JSON 檔。</p>
                      <button onClick={handleExport} className="w-full py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center gap-2"><Download className="w-4 h-4" /> 下載 JSON</button>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                      <h4 className="font-bold text-slate-800 mb-1">匯入備份 (Restore)</h4>
                      <p className="text-xs text-slate-500 mb-4">從 JSON 檔案還原所有資料。</p>
                      <button onClick={handleImportClick} className="w-full py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center gap-2"><Upload className="w-4 h-4" /> 選擇檔案</button>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* 2. 預設參數區 */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> 預設生成參數
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">預設寬度 (Width)</label>
                      <input type="number" value={appSettings.defaultWidth} onChange={(e) => setAppSettings({...appSettings, defaultWidth: parseInt(e.target.value) || 1024})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">預設高度 (Height)</label>
                      <input type="number" value={appSettings.defaultHeight} onChange={(e) => setAppSettings({...appSettings, defaultHeight: parseInt(e.target.value) || 1024})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">預設步數 (Steps)</label>
                      <input type="number" value={appSettings.defaultSteps} onChange={(e) => setAppSettings({...appSettings, defaultSteps: parseInt(e.target.value) || 30})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* 3. 危險區域 */}
                <section>
                  <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> 危險區域
                  </h3>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-red-900 text-sm">重置系統 (Factory Reset)</h4>
                      <p className="text-xs text-red-700 mt-1">這將會清除所有本地資料，還原至初始狀態。</p>
                    </div>
                    <button onClick={() => setConfirmReset(true)} className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors">重置所有資料</button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 新增/編輯 Modal (與先前相同) */}
      {isModalOpen && activePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-modal-pop overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-slate-800">{prompts.find(p => p.id === activePrompt.id) ? '編輯風格' : '新增風格'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">標題名稱</label>
                <input type="text" value={activePrompt.title} onChange={(e) => setActivePrompt({...activePrompt, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none" placeholder="例如：日系動漫風格" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">繪圖風格 Prompt</label>
                <textarea value={activePrompt.prompt} onChange={(e) => setActivePrompt({...activePrompt, prompt: e.target.value})} className="w-full h-32 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none font-mono text-sm" placeholder="例如：anime style, vibrant colors, cel shading..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">縮圖連結 (選填)</label>
                <div className="flex gap-2">
                  <input type="text" value={activePrompt.thumbnail} onChange={(e) => setActivePrompt({...activePrompt, thumbnail: e.target.value})} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm" placeholder="https://..." />
                  <button onClick={() => setActivePrompt({...activePrompt, thumbnail: getRandomThumbnail()})} className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg"><RefreshCw className="w-5 h-5" /></button>
                </div>
                <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1"><Wand2 className="w-3 h-3" /> 若留空，系統將自動產生隨機風格圖。</p>
                {activePrompt.thumbnail && <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 h-32 w-full bg-slate-50"><img src={activePrompt.thumbnail} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" /></div>}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button onClick={handleSave} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors shadow-lg">確認儲存</button>
            </div>
          </div>
        </div>
      )}

      {/* 密碼驗證/刪除/重置 Modal (與先前相同，省略以節省空間) */}
      {authAction && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-modal-pop">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-4 mx-auto"><Lock className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">權限驗證</h3>
            <p className="text-sm text-slate-500 mb-4">此操作需要管理員權限，請輸入密碼。</p>
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-center mb-4 font-mono text-lg" placeholder="請輸入密碼" autoFocus onKeyDown={(e) => e.key === 'Enter' && verifyAuth()} />
            <div className="flex gap-3">
              <button onClick={() => setAuthAction(null)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200">取消</button>
              <button onClick={verifyAuth} className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 shadow-lg">確認</button>
            </div>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-modal-pop">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto"><AlertTriangle className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">確定刪除此風格？</h3>
            <p className="text-sm text-slate-500 mb-6">此動作無法復原。</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg">取消</button>
              <button onClick={executeDelete} className="flex-1 py-2 bg-red-500 text-white rounded-lg shadow-lg shadow-red-200">刪除</button>
            </div>
          </div>
        </div>
      )}
      {confirmReset && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-modal-pop">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto"><RotateCcw className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">重置所有資料？</h3>
            <p className="text-sm text-slate-500 mb-6">這將會清除您目前所有的修改，並還原到預設範例資料。</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmReset(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">取消</button>
              <button onClick={handleReset} className="flex-1 px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-lg">確認重置</button>
            </div>
          </div>
        </div>
      )}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in-up z-[70]">
          <Check className="w-4 h-4 text-green-400" /><span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}
      <style>{`
        @keyframes slide-in-right { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fade-in-up { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes simple-fade-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes modal-pop { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
        .animate-simple-fade-up { animation: simple-fade-up 0.3s ease-out; }
        .animate-modal-pop { animation: modal-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
