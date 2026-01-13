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
  Clock
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

// 模擬的初始資料
const INITIAL_DATA = [
  {
    id: '1',
    title: '賽博龐克城市 (Cyberpunk Style)',
    prompt: 'futuristic city, neon lights, rain, reflection, 8k resolution, highly detailed, cyberpunk style, dark atmosphere',
    thumbnail: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=600&auto=format&fit=crop',
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '油畫風格 (Oil Painting)',
    prompt: 'oil painting style, thick brushstrokes, texture canvas, classic art, rembrandt lighting, masterpiece',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
    updatedAt: new Date().toISOString()
  }
];

// 主應用程式
export default function App() {
  // 資料狀態
  const [prompts, setPrompts] = useState([]);
  
  // 視圖狀態: 'library' | 'generator'
  const [currentView, setCurrentView] = useState('library');
  
  // 互動狀態
  const [activePrompt, setActivePrompt] = useState(null); // 當前選中要使用或編輯的 Prompt
  const [isModalOpen, setIsModalOpen] = useState(false); // 新增/編輯視窗
  const [userInput, setUserInput] = useState(''); // 產生器中的使用者輸入
  const [generatedResult, setGeneratedResult] = useState(null); // 最終生成的 JSON
  const fileInputRef = useRef(null); // 用於匯入檔案
  
  // 輔助狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [deleteId, setDeleteId] = useState(null); 
  const [confirmReset, setConfirmReset] = useState(false);

  // 初始化
  useEffect(() => {
    const saved = localStorage.getItem('nano-banana-prompts-v2');
    if (saved) {
      setPrompts(JSON.parse(saved));
    } else {
      setPrompts(INITIAL_DATA);
    }
  }, []);

  // 儲存
  useEffect(() => {
    if (prompts.length > 0) {
      localStorage.setItem('nano-banana-prompts-v2', JSON.stringify(prompts));
    }
  }, [prompts]);

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

  // --- 資料匯入匯出 (GitHub Ready) ---

  const handleExport = () => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nano-banana-prompts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleToast('已匯出 JSON 備份');
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
          handleToast('資料匯入成功！');
        } else {
          handleToast('檔案格式錯誤');
        }
      } catch (err) {
        handleToast('無法解析 JSON');
      }
    };
    reader.readAsText(file);
    // 重置 input 以便重複選擇同個檔案
    event.target.value = '';
  };

  // --- 管理邏輯 (CRUD) ---

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

  const openEditor = (e, prompt) => {
    e.stopPropagation(); // 阻止冒泡，避免觸發「使用」邏輯
    setActivePrompt({ ...prompt });
    setIsModalOpen(true);
  };

  const confirmDelete = (e, id) => {
    e.stopPropagation(); // 阻止冒泡
    setDeleteId(id);
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

    // 智慧縮圖邏輯：若無縮圖，自動填入隨機圖
    const promptToSave = {
      ...activePrompt,
      thumbnail: activePrompt.thumbnail.trim() || getRandomThumbnail(),
      updatedAt: new Date().toISOString() // 確保更新時間戳記
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
    setPrompts(INITIAL_DATA);
    handleToast('已重置為預設資料');
    setConfirmReset(false);
  };

  // --- 產生器邏輯 (Generator) ---

  const enterGenerator = (prompt) => {
    setActivePrompt(prompt);
    setUserInput('');
    setGeneratedResult(null);
    setCurrentView('generator');
    window.scrollTo(0, 0);
  };

  const generateFinalPayload = () => {
    if (!userInput.trim()) {
      handleToast('請輸入您想產生的內容描述');
      return;
    }

    // 核心邏輯：內容 + 風格
    const finalPrompt = `${userInput}, ${activePrompt.prompt}`;

    const payload = {
      action: "generate",
      engine: "nano-banana-pro",
      prompt: finalPrompt,
      parameters: {
        width: 1024,
        height: 1024,
        steps: 30,
        cfg_scale: 7.0
      }
    };

    setGeneratedResult(JSON.stringify(payload, null, 2));
    handleToast('指令已生成！');
  };

  const copyResult = () => {
    if (generatedResult) {
      // Fallback: 使用 textarea + execCommand 以避免 iframe 權限問題
      const textArea = document.createElement("textarea");
      textArea.value = generatedResult;
      
      // 設定樣式使其不可見且不影響版面
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          handleToast('已複製 JSON 指令');
        } else {
          handleToast('複製失敗，請手動複製');
        }
      } catch (err) {
        console.error('Copy failed', err);
        handleToast('複製發生錯誤');
      }
      
      document.body.removeChild(textArea);
    }
  };

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* 隱藏的檔案輸入框 */}
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
                 <div className="hidden sm:flex items-center gap-1 mr-2 border-r border-slate-200 pr-3">
                   <button 
                    onClick={handleImportClick}
                    className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-50"
                    title="匯入備份 (Import JSON)"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleExport}
                    className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-50"
                    title="匯出備份 (Export JSON)"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                 </div>

                <button 
                  onClick={() => setConfirmReset(true)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-50"
                  title="重置"
                >
                  <RotateCcw className="w-5 h-5" />
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

      {/* 視圖切換邏輯 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === 'library' ? (
          // =================== Library View (Prompt 列表) ===================
          <>
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
                  onClick={() => enterGenerator(prompt)} // 點擊整張卡片進入產生器
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl hover:shadow-yellow-100/50 border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
                >
                  {/* 縮圖區域 */}
                  <div className="relative aspect-[3/2] bg-slate-100 overflow-hidden">
                    <img 
                      src={prompt.thumbnail} 
                      alt={prompt.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                         e.target.onerror = null; 
                         e.target.src = "https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Preview";
                      }} 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                       <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2 shadow-lg">
                         <Wand2 className="w-4 h-4 text-yellow-500" />
                         使用此風格
                       </div>
                    </div>
                  </div>

                  {/* 卡片內容 */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                        {prompt.title}
                      </h3>
                    </div>
                    
                    <p className="text-slate-400 text-xs line-clamp-2 mb-4 flex-1">
                      {prompt.prompt}
                    </p>

                    {/* 管理按鈕區 (Stop Propagation) */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-1 text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-400" title={`最後更新: ${formatDate(prompt.updatedAt)}`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(prompt.updatedAt) || '初始資料'}</span>
                      </div>
                      <div className="flex gap-1 z-10">
                        <button 
                          onClick={(e) => openEditor(e, prompt)}
                          className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
                          title="管理/編輯"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => confirmDelete(e, prompt.id)}
                          className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                          title="刪除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 新增卡片佔位符 */}
              <div 
                onClick={openCreator}
                className="group border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50/50 cursor-pointer transition-all min-h-[300px]"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-medium">新增風格</span>
              </div>
            </div>
          </>
        ) : (
          // =================== Generator View (產生器) ===================
          // 修正：使用 simple-fade-up，避免原本 fade-in-up 帶有的水平位移
          <div className="animate-simple-fade-up max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 左側：風格資訊 */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 mb-4">
                    <img src={activePrompt.thumbnail} className="w-full h-full object-cover" alt="style" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">{activePrompt.title}</h3>
                  <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100 font-mono break-all">
                    {activePrompt.prompt}
                  </div>
                </div>
              </div>

              {/* 右側：輸入與生成 */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. 輸入區 */}
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
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={generateFinalPayload}
                      disabled={!userInput.trim()}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all shadow-lg
                        ${userInput.trim() 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 transform hover:-translate-y-0.5' 
                          : 'bg-slate-300 cursor-not-allowed'}
                      `}
                    >
                      <Wand2 className="w-5 h-5" />
                      產生最終指令
                    </button>
                  </div>
                </div>

                {/* 2. 結果區 */}
                {generatedResult && (
                  <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 animate-slide-in-right relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Terminal className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex justify-between items-center mb-4 relative z-10">
                      <h4 className="text-yellow-400 font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" /> 生成結果 (Ready for Nano Banana)
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
                      <p className="text-slate-500 text-xs mt-3 text-center">
                        此 JSON 已包含您的內容描述與選定的風格 Prompt。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 新增/編輯 Modal */}
      {isModalOpen && activePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          {/* 使用 modal-pop 確保不偏移 */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-modal-pop overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-slate-800">
                {prompts.find(p => p.id === activePrompt.id) ? '編輯風格' : '新增風格'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">標題名稱</label>
                <input 
                  type="text"
                  value={activePrompt.title}
                  onChange={(e) => setActivePrompt({...activePrompt, title: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  placeholder="例如：日系動漫風格"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">繪圖風格 Prompt</label>
                <textarea 
                  value={activePrompt.prompt}
                  onChange={(e) => setActivePrompt({...activePrompt, prompt: e.target.value})}
                  className="w-full h-32 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none font-mono text-sm"
                  placeholder="例如：anime style, vibrant colors, cel shading..."
                />
                <p className="text-xs text-slate-400 mt-1">請只輸入風格描述詞，不要包含內容。</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">縮圖連結 (選填)</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={activePrompt.thumbnail}
                    onChange={(e) => setActivePrompt({...activePrompt, thumbnail: e.target.value})}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => setActivePrompt({...activePrompt, thumbnail: getRandomThumbnail()})}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg"
                    title="隨機產生"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                  <Wand2 className="w-3 h-3" />
                  若留空，系統將自動產生隨機風格圖。
                </p>
                {activePrompt.thumbnail && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 h-32 w-full bg-slate-50">
                    <img src={activePrompt.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={handleSave}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
              >
                確認儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 刪除確認 Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          {/* 修正：動畫加在內部 div，並使用 modal-pop */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-modal-pop">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">確定刪除此風格？</h3>
            <p className="text-sm text-slate-500 mb-6">此動作無法復原。</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg">取消</button>
              <button onClick={executeDelete} className="flex-1 py-2 bg-red-500 text-white rounded-lg shadow-lg shadow-red-200">刪除</button>
            </div>
          </div>
        </div>
      )}

      {/* 重置確認 Modal */}
      {confirmReset && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           {/* 修正：動畫加在內部 div，並使用 modal-pop */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-modal-pop">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">重置所有資料？</h3>
            <p className="text-sm text-slate-500 mb-6">
              這將會清除您目前所有的修改，並還原到預設範例資料。
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setConfirmReset(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
              >
                確認重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in-up z-[70]">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in-up {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        /* 新增：純垂直位移，無水平偏移的動畫 */
        @keyframes simple-fade-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes modal-pop {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
        .animate-simple-fade-up { animation: simple-fade-up 0.3s ease-out; }
        .animate-modal-pop { animation: modal-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}