/**
 * SinterPore-Analyzer Application Logic
 * Manages:
 * - State and settings synchronization
 * - UI Language Translation (Japanese, English, Chinese)
 * - Canvas interactions (Scale measuring, ROI dragging, Component highlighting)
 * - Image processing pipeline integration
 * - Batch processing execution and file saving
 * - Configuration backup and history logs
 */

// --- TRANSLATION TABLES ---
const I18n = {
    currentLang: 'ja',
    translations: {
        ja: {
            navigation: "ナビゲーション",
            nav_general: "その他設定",
            nav_scale: "スケール設定",
            nav_roi: "ROI設定",
            nav_grayscale: "グレースケール設定",
            nav_noise: "ノイズ除去",
            nav_binarize: "2値化設定",
            nav_limit: "下限面積設定",
            nav_batch: "一括処理",
            drop_message: "画像をここにドラッグ＆ドロップ",
            load_image_hint: "右パネルから画像を読み込むか、ここにドロップしてください。",
            page_general_title: "その他設定",
            page_scale_title: "スケール設定",
            page_roi_title: "ROI設定",
            page_grayscale_title: "グレースケール設定",
            page_noise_title: "ノイズ除去設定",
            page_binarize_title: "2値化設定",
            page_limit_title: "下限面積設定",
            page_batch_title: "一括処理",
            header_gray_display: "表示設定",
            chk_gray_preview: "グレースケール表示 ON/OFF",
            header_gray_condition: "グレースケール変換設定",
            gray_instruction: "※ カラー画像を2値化する前に、輝度または特定の色彩情報を抽出してグレースケール化します。",
            summary_gray: "グレースケール:",
            label_folder_abs_path: "入力フォルダ絶対パス (Local置き換え用)",
            header_io: "データ入出力",
            btn_load_image: "画像読込",
            btn_load_settings: "設定読込",
            btn_save_settings_as: "設定別名保存",
            loaded_file: "読込中:",
            header_language: "言語設定",
            header_history: "一括処理条件履歴",
            th_date: "日付",
            th_condition_name: "条件名",
            th_action: "操作",
            no_history: "履歴はありません。",
            btn_apply: "適用",
            header_scale_condition: "スケール処理条件",
            label_um_px: "ピクセルあたりの長さ (μm/px)",
            header_scale_result: "測定結果・計算",
            label_actual_length: "スケールバーの実際の長さ (μm)",
            scale_instruction: "※ 画像プレビュー上でスケールバーの両端をクリック（またはドラッグ）してピクセル長さを読み取ります。",
            header_roi_display: "表示設定",
            chk_roi_enable: "ROI領域を表示する",
            header_roi_condition: "ROI 範囲設定",
            label_roi_x1: "左上 X (px)",
            label_roi_y1: "左上 Y (px)",
            label_roi_x2: "右下 X (px)",
            label_roi_y2: "右下 Y (px)",
            btn_roi_full: "画像全体に設定",
            roi_instruction: "※ 画像上の半透明の緑色枠線をドラッグして移動、四隅のハンドルをドラッグしてサイズ調整ができます。",
            chk_noise_enable: "ノイズ除去をプレビューに反映",
            header_noise_display: "表示設定",
            header_noise_condition: "ノイズ除去設定",
            label_noise_method: "ノイズ除去手法",
            opt_median: "メディアンフィルタ (推奨)",
            opt_gaussian: "ガウシアンフィルタ",
            opt_none: "なし",
            label_noise_kernel: "フィルタの強度 (窓サイズ)",
            noise_instruction: "※ メディアンフィルタは輪郭をシャープに保ったまま高周波ノイズを取り除くため、焼結体の空隙検出に有効です。",
            header_binarize_display: "表示設定",
            chk_bin_boundary: "2値化境界（輪郭）を表示する",
            header_binarize_condition: "2値化設定",
            label_channel: "グレースケール変換チャネル",
            opt_luminance: "輝度 (Luminance)",
            label_threshold_method: "閾値算出方法",
            opt_fixed: "固定値",
            opt_otsu: "Otsu法 × %",
            label_fixed_val: "2値化閾値 (0-255)",
            label_otsu_val: "Otsu計算値:",
            label_applied_threshold: "適用閾値:",
            label_otsu_percent: "Otsu閾値係数 (%)",
            header_limit_display: "表示設定",
            chk_limit_numbers: "プレビュー上にラベル番号を描画",
            header_limit_condition: "下限面積設定",
            title_solid_limit: "実体の下限面積 (白色部分)",
            title_void_limit: "空隙の下限面積 (黒色部分)",
            label_limit_area: "下限面積:",
            label_limit_diameter: "下限径 (円相当):",
            header_results_list: "検出コンポーネント一覧",
            th_type: "種類",
            th_limit: "判定",
            th_area: "面積(μm²)",
            th_dia: "径(μm)",
            no_results: "データがありません。",
            header_batch_conditions: "一括処理条件サマリー",
            summary_noise: "ノイズ除去:",
            summary_bin: "2値化:",
            summary_limits: "下限サイズ:",
            header_batch_files: "処理ファイルリスト",
            th_filename: "ファイル名",
            th_foldername: "フォルダ",
            btn_add_files: "ファイル追加",
            btn_add_folder: "フォルダ追加",
            btn_clear_list: "クリア",
            no_files: "ファイルが追加されていません。",
            header_output_config: "出力設定",
            chk_batch_labels: "出力画像にラベル番号を描画する",
            label_output_dir: "出力保存先フォルダ",
            zip_fallback_active: "[ZIPダウンロード (フォルダ選択なし)]",
            label_notes: "一括処理ノート (自由入力)",
            btn_run_batch: "一括処理実行",
            progress_label: "処理中:",
            header_log: "処理ログ"
        },
        en: {
            navigation: "Navigation",
            nav_general: "General Settings",
            nav_scale: "Scale Settings",
            nav_roi: "ROI Settings",
            nav_grayscale: "Grayscale Settings",
            nav_noise: "Noise Removal",
            nav_binarize: "Binarization",
            nav_limit: "Lower Limit Area",
            nav_batch: "Batch Process",
            drop_message: "Drag & Drop images here",
            load_image_hint: "Load an image from the right panel or drop it here.",
            page_general_title: "General Settings",
            page_scale_title: "Scale Settings",
            page_roi_title: "ROI Settings",
            page_grayscale_title: "Grayscale Settings",
            page_noise_title: "Noise Removal",
            page_binarize_title: "Binarization",
            page_limit_title: "Lower Limit Area",
            page_batch_title: "Batch Processing",
            header_gray_display: "Display Settings",
            chk_gray_preview: "Grayscale Preview ON/OFF",
            header_gray_condition: "Grayscale Conversion Settings",
            gray_instruction: "※ Extracts luminance or color information to grayscale the image before binarization.",
            summary_gray: "Grayscale:",
            label_folder_abs_path: "Input Folder Absolute Path",
            header_io: "Data Input/Output",
            btn_load_image: "Load Image",
            btn_load_settings: "Load Settings",
            btn_save_settings_as: "Save Settings As",
            loaded_file: "Loaded:",
            header_language: "Language Settings",
            header_history: "Batch Run History",
            th_date: "Date",
            th_condition_name: "Conditions Name",
            th_action: "Action",
            no_history: "No history found.",
            btn_apply: "Apply",
            header_scale_condition: "Scale Conditions",
            label_um_px: "Length per pixel (μm/px)",
            header_scale_result: "Measurement Results",
            label_actual_length: "Actual length of scale bar (μm)",
            scale_instruction: "※ Click and drag on the image preview to measure pixel length of the scale bar.",
            header_roi_display: "Display Settings",
            chk_roi_enable: "Display ROI Box",
            header_roi_condition: "ROI Area Settings",
            label_roi_x1: "Top-Left X (px)",
            label_roi_y1: "Top-Left Y (px)",
            label_roi_x2: "Bottom-Right X (px)",
            label_roi_y2: "Bottom-Right Y (px)",
            btn_roi_full: "Set Full Image",
            roi_instruction: "※ Drag the green translucent box to move, and drag the corner handles to resize.",
            chk_noise_enable: "Apply noise removal to preview",
            header_noise_display: "Display Settings",
            header_noise_condition: "Noise Removal Settings",
            label_noise_method: "Filter Method",
            opt_median: "Median Filter (Recommended)",
            opt_gaussian: "Gaussian Blur",
            opt_none: "None",
            label_noise_kernel: "Filter Strength (Kernel Size)",
            noise_instruction: "※ Median filtering preserves edges while removing salt-and-pepper noise, ideal for voids.",
            header_binarize_display: "Display Settings",
            chk_bin_boundary: "Show Binarization Boundary (Contour)",
            header_binarize_condition: "Binarization Settings",
            label_channel: "Grayscale Channel",
            opt_luminance: "Luminance",
            label_threshold_method: "Threshold Method",
            opt_fixed: "Fixed Value",
            opt_otsu: "Otsu's Method * %",
            label_fixed_val: "Threshold (0-255)",
            label_otsu_val: "Otsu Calculated:",
            label_applied_threshold: "Applied Threshold:",
            label_otsu_percent: "Otsu Coeff (%)",
            header_limit_display: "Display Settings",
            chk_limit_numbers: "Draw label IDs on preview",
            header_limit_condition: "Lower Limit Area Settings",
            title_solid_limit: "Solid Lower Limit Area (White)",
            title_void_limit: "Void Lower Limit Area (Black)",
            label_limit_area: "Limit Area:",
            label_limit_diameter: "Limit Dia (EqCircle):",
            header_results_list: "Detected Components List",
            th_type: "Type",
            th_limit: "Limit",
            th_area: "Area(μm²)",
            th_dia: "Dia(μm)",
            no_results: "No data available.",
            header_batch_conditions: "Batch Run Summary",
            summary_noise: "Noise:",
            summary_bin: "Binarize:",
            summary_limits: "Limits:",
            header_batch_files: "Batch File List",
            th_filename: "Filename",
            th_foldername: "Folder",
            btn_add_files: "Add Files",
            btn_add_folder: "Add Folder",
            btn_clear_list: "Clear",
            no_files: "No files added.",
            header_output_config: "Output Settings",
            chk_batch_labels: "Draw label numbers on output images",
            label_output_dir: "Output Folder",
            zip_fallback_active: "[ZIP Download (No folder selected)]",
            label_notes: "Batch Run Notes",
            btn_run_batch: "Run Batch Processing",
            progress_label: "Progress:",
            header_log: "Process Log"
        },
        zh: {
            navigation: "导航",
            nav_general: "其他设置",
            nav_scale: "比例尺设置",
            nav_roi: "ROI设置",
            nav_grayscale: "灰度设置",
            nav_noise: "降噪设置",
            nav_binarize: "二值化设置",
            nav_limit: "下限面积设置",
            nav_batch: "批量处理",
            drop_message: "将图片拖放到此处",
            load_image_hint: "从右侧面板载入图片，或将其拖放到此处。",
            page_general_title: "其他设置",
            page_scale_title: "比例尺设置",
            page_roi_title: "ROI设置",
            page_grayscale_title: "灰度设置",
            page_noise_title: "降噪设置",
            page_binarize_title: "二值化设置",
            page_limit_title: "下限面积设置",
            page_batch_title: "批量处理",
            header_gray_display: "显示设置",
            chk_gray_preview: "灰度显示 ON/OFF",
            header_gray_condition: "灰度转换设置",
            gray_instruction: "※ 在二值化之前，提取亮度或色彩通道以转化为灰度图。",
            summary_gray: "灰度:",
            label_folder_abs_path: "输入文件夹绝对路径",
            header_io: "数据导入/导出",
            btn_load_image: "导入图片",
            btn_load_settings: "导入设置",
            btn_save_settings_as: "另存设置",
            loaded_file: "已载入:",
            header_language: "语言设置",
            header_history: "批量处理条件历史记录",
            th_date: "日期",
            th_condition_name: "条件名称",
            th_action: "操作",
            no_history: "无历史记录。",
            btn_apply: "应用",
            header_scale_condition: "比例尺处理条件",
            label_um_px: "每像素长度 (μm/px)",
            header_scale_result: "测量结果・计算",
            label_actual_length: "比例尺实际长度 (μm)",
            scale_instruction: "※ 在图片预览区域点击并拖动，以读取比例尺的像素长度。",
            header_roi_display: "显示设置",
            chk_roi_enable: "显示ROI区域",
            header_roi_condition: "ROI 范围设置",
            label_roi_x1: "左上 X (px)",
            label_roi_y1: "左上 Y (px)",
            label_roi_x2: "右下 X (px)",
            label_roi_y2: "右下 Y (px)",
            btn_roi_full: "设置为整张图片",
            roi_instruction: "※ 拖动绿色半透明框可移动位置，拖动四角手柄可调整大小。",
            chk_noise_enable: "在预览中应用降噪",
            header_noise_display: "显示设置",
            header_noise_condition: "降噪设置",
            label_noise_method: "降噪算法",
            opt_median: "中值滤波 (推荐)",
            opt_gaussian: "高斯滤波",
            opt_none: "无",
            label_noise_kernel: "滤波强度 (窗口大小)",
            noise_instruction: "※ 中值滤波可在保持轮廓清晰的同时去除噪点，极适用于检测空隙结构。",
            header_binarize_display: "显示设置",
            chk_bin_boundary: "显示二值化边界 (轮廓)",
            header_binarize_condition: "二值化设置",
            label_channel: "灰度转换通道",
            opt_luminance: "亮度 (Luminance)",
            label_threshold_method: "阈值算法",
            opt_fixed: "固定值",
            opt_otsu: "大津法 * %",
            label_fixed_val: "二值化阈值 (0-255)",
            label_otsu_val: "大津法计算值:",
            label_applied_threshold: "应用阈值:",
            label_otsu_percent: "大津法系数 (%)",
            header_limit_display: "显示设置",
            chk_limit_numbers: "在预览上绘制标签编号",
            header_limit_condition: "下限面积设置",
            title_solid_limit: "实体下限面积 (白色部分)",
            title_void_limit: "空隙下限面积 (黑色部分)",
            label_limit_area: "下限面积:",
            label_limit_diameter: "下限等效圆直径:",
            header_results_list: "检测到的区域列表",
            th_type: "类型",
            th_limit: "判定",
            th_area: "面积(μm²)",
            th_dia: "直径(μm)",
            no_results: "无数据。",
            header_batch_conditions: "批量处理条件摘要",
            summary_noise: "降噪:",
            summary_bin: "二值化:",
            summary_limits: "下限大小:",
            header_batch_files: "待处理文件列表",
            th_filename: "文件名",
            th_foldername: "文件夹",
            btn_add_files: "添加文件",
            btn_add_folder: "添加文件夹",
            btn_clear_list: "清除列表",
            no_files: "未添加任何文件。",
            header_output_config: "输出设置",
            chk_batch_labels: "在输出图片中绘制标签编号",
            label_output_dir: "输出保存目录",
            zip_fallback_active: "[ZIP压缩包下载 (未选择文件夹)]",
            label_notes: "批量处理备注",
            btn_run_batch: "开始批量处理",
            progress_label: "处理进度:",
            header_log: "运行日志"
        }
    },
    set(lang) {
        this.currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[lang] && this.translations[lang][key]) {
                el.innerText = this.translations[lang][key];
            }
        });
        
        // Update document lang attribute
        document.documentElement.setAttribute('lang', lang);
    },
    get(key) {
        return (this.translations[this.currentLang] && this.translations[this.currentLang][key]) || key;
    }
};

// --- APP STATE ---
const App = {
    // Current Active Nav Page
    activePage: 'general',
    
    // Core parameters
    umPerPx: 1.0,
    actualLength: 10.0,
    
    // ROI coordinates (relative to full image space)
    roi: {
        enabled: true,
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 100
    },
    
    // FFT parameters
    fft: {
        enabled: false,
        highPassLimit: 5,
        lowPassLimit: 100
    },
    
    // Preprocessing parameters
    noise: {
        enabled: true,
        method: 'median',
        kernelSize: 5
    },
    
    // Thresholding parameters
    binarization: {
        channel: 'luminance',
        method: 'otsu',
        fixedValue: 128,
        otsuPercent: 100,
        grayscalePreview: true
    },
    
    // Component size filters (px)
    limit: {
        solidPx: 50,
        voidPx: 50
    },
    
    // Loaded image information
    imageLoaded: false,
    imageName: '',
    imageFolder: 'Local File',
    imageElement: null,
    currentLoadedFile: null,
    
    // Directory paths
    inputDirectoryPath: '',
    outputFolder: '',
    
    // Canvas dimensions
    originalWidth: 0,
    originalHeight: 0,
    zoomScale: 1.0,
    
    // Calculated component data
    otsuCalculatedVal: 128,
    appliedThreshold: 128,
    components: [],
    selectedCompId: null,
    
    // Pipeline Cache and Validity Flags
    isGrayscaleStageValid: false,
    isFFTStageValid: false,
    isNoiseStageValid: false,
    isBinarizationStageValid: false,
    isCCLStageValid: false,
    
    // Caching processed arrays for instant redrawing
    grayArray: null,
    fftArray: null,
    noiseArray: null,
    binArray: null,
    
    // Interactive canvas states
    dragMode: null, // 'move' | 'resize'
    draggedCorner: -1, // 0: TL, 1: TR, 2: BR, 3: BL
    scaleStart: null,
    scaleEnd: null,
    isMeasuringScale: false, // 2-point click measuring
    
    // Panning states
    isPanning: false,
    isPanningCandidate: false,
    panStart: { x: 0, y: 0 },
    scrollStart: { x: 0, y: 0 },
    
    // Batch processing states
    batchFiles: [], // list of File objects with custom path
    outputDirectoryHandle: null,
    
    // Results table sort states
    sortColumn: 'id',
    sortDirection: 'asc',
    activeHistoryIndex: null,
    
    // --- INIT ---
    init() {
        this.baseCanvas = document.getElementById('base-canvas');
        this.baseCtx = this.baseCanvas.getContext('2d');
        this.overlayCanvas = document.getElementById('overlay-canvas');
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        this.canvasWrapper = document.getElementById('canvas-wrapper');
        
        this.inputDirectoryPath = localStorage.getItem('sinterpore_input_dir_path') || '';
        const absPathInput = document.getElementById('input-folder-abs-path');
        if (absPathInput) {
            absPathInput.value = this.inputDirectoryPath;
        }
        
        this.loadSettingsFromStorage();
        this.bindEvents();
        this.setLanguage(I18n.currentLang);
        this.updateUIInputs();
        this.updateBatchSummary();
        this.renderHistoryTable();
    },

    // --- TRANSLATION ---
    setLanguage(lang) {
        I18n.set(lang);
        // Sync radio buttons
        const radio = document.querySelector(`input[name="ui-lang"][value="${lang}"]`);
        if (radio) radio.checked = true;
        
        // Update sidebar page title
        const sidebarTitle = document.getElementById('sidebar-page-title');
        if (sidebarTitle) {
            sidebarTitle.setAttribute('data-i18n', `page_${this.activePage}_title`);
            sidebarTitle.innerText = I18n.get(`page_${this.activePage}_title`);
        }
    },

    switchPage(pageName) {
        const pageOrder = ['general', 'scale', 'roi', 'grayscale', 'noise', 'binarization', 'limit', 'batch'];
        if (!pageOrder.includes(pageName)) return;
        this.activePage = pageName;
        
        document.getElementById('app-container').setAttribute('data-active-page', pageName);
        
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('data-page') === pageName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        const sidebarTitle = document.getElementById('sidebar-page-title');
        if (sidebarTitle) {
            sidebarTitle.setAttribute('data-i18n', `page_${pageName}_title`);
            sidebarTitle.innerText = I18n.get(`page_${pageName}_title`);
        }
        
        this.dragMode = null;
        this.isMeasuringScale = false;
        
        this.updateHeaderNavButtons();
        
        if (this.imageLoaded) {
            this.evaluatePipeline();
        } else {
            this.redraw();
        }
    },
    
    updateHeaderNavButtons() {
        const pageOrder = ['general', 'scale', 'roi', 'grayscale', 'noise', 'binarization', 'limit', 'batch'];
        const idx = pageOrder.indexOf(this.activePage);
        const prevBtn = document.getElementById('btn-prev-page');
        const nextBtn = document.getElementById('btn-next-page');
        if (prevBtn) prevBtn.disabled = (idx <= 0);
        if (nextBtn) nextBtn.disabled = (idx >= pageOrder.length - 1);
    },

    invalidateGrayscale() {
        this.isGrayscaleStageValid = false;
        this.invalidateFFT();
    },
    invalidateFFT() {
        this.isFFTStageValid = false;
        this.invalidateNoise();
    },
    invalidateNoise() {
        this.isNoiseStageValid = false;
        this.invalidateBinarization();
    },
    invalidateBinarization() {
        this.isBinarizationStageValid = false;
        this.invalidateCCL();
    },
    invalidateCCL() {
        this.isCCLStageValid = false;
    },
    
    runGrayscaleStage(roiImageData) {
        if (this.isGrayscaleStageValid && this.grayArray) return;
        this.grayArray = ImageProcessor.toGrayscale(roiImageData, this.binarization.channel);
        this.isGrayscaleStageValid = true;
    },
    
    runFFTStage(W, H) {
        if (this.isFFTStageValid && this.fftArray) return;
        if (this.fft.enabled) {
            this.fftArray = ImageProcessor.fftBandpassFilter(
                this.grayArray, W, H, 
                this.fft.highPassLimit, this.fft.lowPassLimit
            );
        } else {
            this.fftArray = new Uint8Array(this.grayArray);
        }
        this.isFFTStageValid = true;
    },
    
    runNoiseStage(W, H) {
        if (this.isNoiseStageValid && this.noiseArray) return;
        let imgArr = this.fftArray;
        if (this.noise.enabled && this.noise.method !== 'none') {
            if (this.noise.method === 'median') {
                this.noiseArray = ImageProcessor.medianFilter(imgArr, W, H, this.noise.kernelSize);
            } else if (this.noise.method === 'gaussian') {
                this.noiseArray = ImageProcessor.gaussianBlur(imgArr, W, H, this.noise.kernelSize);
            }
        } else {
            this.noiseArray = new Uint8Array(imgArr);
        }
        this.isNoiseStageValid = true;
    },
    
    runBinarizationStage() {
        if (this.isBinarizationStageValid && this.binArray) return;
        
        let imgArr = this.noiseArray;
        if (this.binarization.method === 'otsu') {
            this.otsuCalculatedVal = ImageProcessor.calculateOtsuThreshold(imgArr);
            const applied = Math.round(this.otsuCalculatedVal * this.binarization.otsuPercent / 100);
            this.appliedThreshold = Math.max(0, Math.min(255, applied));
            
            const calcEl = document.getElementById('otsu-calc-val');
            if (calcEl) calcEl.innerText = this.otsuCalculatedVal;
            const appliedEl = document.getElementById('otsu-applied-val');
            if (appliedEl) appliedEl.innerText = this.appliedThreshold;
        } else {
            this.appliedThreshold = this.binarization.fixedValue;
        }
        
        this.binArray = ImageProcessor.binarize(imgArr, this.appliedThreshold);
        this.isBinarizationStageValid = true;
    },
    
    runCCLStage(W, H) {
        if (this.isCCLStageValid && this.components.length > 0) return;
        
        const solids = ImageProcessor.labelComponents(this.binArray, W, H, 255);
        const voids = ImageProcessor.labelComponents(this.binArray, W, H, 0);
        
        const scaleSq = this.umPerPx * this.umPerPx;
        this.components = [];
        let globalId = 1;
        
        const processGroup = (group, isSolid) => {
            const pxLimit = isSolid ? this.limit.solidPx : this.limit.voidPx;
            for (const c of group) {
                const area = c.pixels * scaleSq;
                const diameter = 2 * Math.sqrt(area / Math.PI);
                
                this.components.push({
                    id: globalId++,
                    type: isSolid ? 'solid' : 'void',
                    pixels: c.pixels,
                    area: area,
                    diameter: diameter,
                    xmin: c.xmin,
                    xmax: c.xmax,
                    ymin: c.ymin,
                    ymax: c.ymax,
                    cx: c.cx,
                    cy: c.cy,
                    isBelowLimit: c.pixels < pxLimit,
                    boundary: c.boundary
                });
            }
        };
        
        processGroup(solids, true);
        processGroup(voids, false);
        
        this.isCCLStageValid = true;
    },
    
    evaluatePipeline() {
        if (!this.imageLoaded) return;
        
        const W_ROI = this.roi.enabled ? (this.roi.x2 - this.roi.x1) : this.originalWidth;
        const H_ROI = this.roi.enabled ? (this.roi.y2 - this.roi.y1) : this.originalHeight;
        const rx1 = this.roi.enabled ? this.roi.x1 : 0;
        const ry1 = this.roi.enabled ? this.roi.y1 : 0;
        
        const needsGrayscale = ['grayscale', 'noise', 'binarization', 'limit'].includes(this.activePage);
        const needsFFT = ['noise', 'binarization', 'limit'].includes(this.activePage);
        const needsNoise = ['noise', 'binarization', 'limit'].includes(this.activePage);
        const needsBinarization = ['binarization', 'limit'].includes(this.activePage);
        const needsCCL = ['limit'].includes(this.activePage);
        
        if (needsGrayscale) {
            if (!this.isGrayscaleStageValid || !this.grayArray) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = W_ROI;
                tempCanvas.height = H_ROI;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(this.imageElement, rx1, ry1, W_ROI, H_ROI, 0, 0, W_ROI, H_ROI);
                const roiImageData = tempCtx.getImageData(0, 0, W_ROI, H_ROI);
                
                this.runGrayscaleStage(roiImageData);
            }
        }
        
        if (needsFFT) {
            this.runFFTStage(W_ROI, H_ROI);
        }
        
        if (needsNoise) {
            this.runNoiseStage(W_ROI, H_ROI);
        }
        
        if (needsBinarization) {
            this.runBinarizationStage();
        }
        
        if (needsCCL) {
            this.runCCLStage(W_ROI, H_ROI);
            this.renderResultsTable();
        }
        
        this.redraw();
    },
    
    debouncedEvaluatePipeline() {
        if (this.processTimeout) {
            clearTimeout(this.processTimeout);
        }
        this.processTimeout = setTimeout(() => {
            if (this.imageLoaded) this.evaluatePipeline();
        }, 300);
    },

    // --- SETTINGS LOCAL STORAGE ---
    loadSettingsFromStorage() {
        const lastSettings = localStorage.getItem('sinterpore_last_settings');
        if (lastSettings) {
            try {
                const settings = JSON.parse(lastSettings);
                this.applyJSONConfig(settings, false); // load but don't save back immediately
            } catch (e) {
                console.warn('Failed to parse cached settings:', e);
            }
        }
    },
    
    saveSettingsToStorage() {
        const config = this.generateJSONConfigObject("直前設定");
        localStorage.setItem('sinterpore_last_settings', JSON.stringify(config));
    },

    generateJSONConfigObject(name = "直前設定") {
        return {
            name: name,
            language: I18n.currentLang,
            scale: {
                umPerPx: this.umPerPx,
                actualLength: this.actualLength
            },
            roi: {
                enabled: this.roi.enabled,
                x1: this.roi.x1,
                y1: this.roi.y1,
                x2: this.roi.x2,
                y2: this.roi.y2
            },
            fft: {
                enabled: this.fft.enabled,
                highPassLimit: this.fft.highPassLimit,
                lowPassLimit: this.fft.lowPassLimit
            },
            noise: {
                enabled: this.noise.enabled,
                method: this.noise.method,
                kernelSize: this.noise.kernelSize
            },
            binarization: {
                channel: this.binarization.channel,
                method: this.binarization.method,
                fixedValue: this.binarization.fixedValue,
                otsuPercent: this.binarization.otsuPercent,
                grayscalePreview: this.binarization.grayscalePreview
            },
            limit: {
                solidPx: this.limit.solidPx,
                voidPx: this.limit.voidPx
            },
            batch: {
                labelNumbersEnabled: document.getElementById('chk-batch-labels').checked,
                notes: document.getElementById('input-batch-notes').value,
                outputFolder: this.outputFolder
            }
        };
    },

    applyJSONConfig(config, triggerSave = true) {
        if (config.language) {
            I18n.currentLang = config.language;
            this.setLanguage(config.language);
        }
        if (config.scale) {
            this.umPerPx = config.scale.umPerPx;
            this.actualLength = config.scale.actualLength;
        }
        if (config.roi) {
            this.roi.enabled = config.roi.enabled;
            this.roi.x1 = config.roi.x1;
            this.roi.y1 = config.roi.y1;
            this.roi.x2 = config.roi.x2;
            this.roi.y2 = config.roi.y2;
        }
        if (config.fft) {
            this.fft.enabled = !!config.fft.enabled;
            this.fft.highPassLimit = config.fft.highPassLimit || 5;
            this.fft.lowPassLimit = config.fft.lowPassLimit || 100;
        }
        if (config.noise) {
            this.noise.enabled = config.noise.enabled;
            this.noise.method = config.noise.method;
            this.noise.kernelSize = config.noise.kernelSize;
        }
        if (config.binarization) {
            this.binarization.channel = config.binarization.channel || 'luminance';
            this.binarization.method = config.binarization.method;
            this.binarization.fixedValue = config.binarization.fixedValue;
            this.binarization.otsuPercent = config.binarization.otsuPercent;
            this.binarization.grayscalePreview = config.binarization.grayscalePreview !== undefined ? config.binarization.grayscalePreview : true;
        }
        if (config.limit) {
            this.limit.solidPx = config.limit.solidPx;
            this.limit.voidPx = config.limit.voidPx;
        }
        
        if (config.batch) {
            const chkLabels = document.getElementById('chk-batch-labels');
            if (chkLabels) chkLabels.checked = !!config.batch.labelNumbersEnabled;
            const batchNotes = document.getElementById('input-batch-notes');
            if (batchNotes) batchNotes.value = config.batch.notes || '';
            this.outputFolder = config.batch.outputFolder || '';
            const display = document.getElementById('display-output-path');
            if (display) {
                if (this.outputFolder) {
                    display.innerText = this.outputFolder;
                    display.classList.remove('zip-active');
                } else {
                    display.innerText = I18n.get('zip_fallback_active');
                    display.classList.add('zip-active');
                }
            }
        }
        
        this.updateUIInputs();
        this.updateBatchSummary();
        
        this.invalidateGrayscale(); // Invalidate cache since settings changed completely
        if (this.imageLoaded) {
            this.evaluatePipeline();
        } else {
            this.redraw();
        }
        
        if (triggerSave) {
            this.saveSettingsToStorage();
        }
    },

    updateUIInputs() {
        document.getElementById('input-um-px').value = this.umPerPx.toFixed(3);
        document.getElementById('input-actual-length').value = this.actualLength.toFixed(3);
        
        document.getElementById('chk-roi-enable').checked = this.roi.enabled;
        document.getElementById('input-roi-x1').value = this.roi.x1;
        document.getElementById('input-roi-y1').value = this.roi.y1;
        document.getElementById('input-roi-x2').value = this.roi.x2;
        document.getElementById('input-roi-y2').value = this.roi.y2;
        
        // FFT UI
        const fftRadio = document.querySelector(`input[name="fft-enable"][value="${this.fft.enabled ? 'enabled' : 'disabled'}"]`);
        if (fftRadio) fftRadio.checked = true;
        const hpEl = document.getElementById('input-fft-highpass');
        if (hpEl) hpEl.value = this.fft.highPassLimit;
        const lpEl = document.getElementById('input-fft-lowpass');
        if (lpEl) lpEl.value = this.fft.lowPassLimit;
        
        // Noise UI (method as radio buttons)
        const noiseMethodRadio = document.querySelector(`input[name="noise-method-choice"][value="${this.noise.method}"]`);
        if (noiseMethodRadio) noiseMethodRadio.checked = true;
        
        const noiseKernelRadio = document.querySelector(`input[name="noise-kernel-choice"][value="${this.noise.kernelSize}"]`);
        if (noiseKernelRadio) noiseKernelRadio.checked = true;
        
        // Grayscale UI (channel choice as radio buttons)
        const grayChanRadio = document.querySelector(`input[name="gray-channel-choice"][value="${this.binarization.channel}"]`);
        if (grayChanRadio) grayChanRadio.checked = true;
        
        // Binarization UI
        const binMethodRadio = document.querySelector(`input[name="bin-method"][value="${this.binarization.method}"]`);
        if (binMethodRadio) binMethodRadio.checked = true;
        
        document.getElementById('input-bin-fixed').value = this.binarization.fixedValue;
        document.getElementById('input-bin-otsu-percent').value = this.binarization.otsuPercent;
        
        // Limit UI
        document.getElementById('input-limit-solid-px').value = this.limit.solidPx;
        document.getElementById('input-limit-void-px').value = this.limit.voidPx;
        
        // Hide/show threshold groups based on selection
        this.toggleThresholdInputs();
        
        // Update equivalent limit outputs
        this.updateLimitEquivalentLabels();
    },

    toggleThresholdInputs() {
        const isFixed = document.querySelector('input[name="bin-method"][value="fixed"]').checked;
        document.getElementById('group-bin-fixed').classList.toggle('hidden', !isFixed);
        document.getElementById('group-bin-otsu').classList.toggle('hidden', isFixed);
    },

    updateLimitEquivalentLabels() {
        const scaleSq = this.umPerPx * this.umPerPx;
        
        // Solid equivalent area & diameter
        const solidArea = this.limit.solidPx * scaleSq;
        const solidDia = 2 * Math.sqrt(solidArea / Math.PI);
        document.getElementById('limit-solid-um2').innerText = `${solidArea.toFixed(3)} μm²`;
        document.getElementById('limit-solid-dia').innerText = `${solidDia.toFixed(3)} μm`;
        
        // Void equivalent area & diameter
        const voidArea = this.limit.voidPx * scaleSq;
        const voidDia = 2 * Math.sqrt(voidArea / Math.PI);
        document.getElementById('limit-void-um2').innerText = `${voidArea.toFixed(3)} μm²`;
        document.getElementById('limit-void-dia').innerText = `${voidDia.toFixed(3)} μm`;
    },

    updateBatchSummary() {
        document.getElementById('summary-um-px').innerText = this.umPerPx.toFixed(3);
        
        const roiText = this.roi.enabled 
            ? `(${this.roi.x1}, ${this.roi.y1}) - (${this.roi.x2}, ${this.roi.y2})` 
            : I18n.get('btn_roi_full');
        document.getElementById('summary-roi').innerText = roiText;
        
        const grayChanRadio = document.querySelector(`input[name="gray-channel-choice"]:checked`);
        let grayChannelText = this.binarization.channel;
        if (grayChanRadio) {
            grayChannelText = grayChanRadio.closest('label').innerText.trim();
        }
        const summaryGray = document.getElementById('summary-gray');
        if (summaryGray) {
            summaryGray.innerText = grayChannelText;
        }
        
        let noiseText = '';
        if (this.fft.enabled) {
            noiseText += `FFT (${this.fft.highPassLimit}-${this.fft.lowPassLimit}px) + `;
        }
        if (this.noise.enabled && this.noise.method !== 'none') {
            noiseText += `${this.noise.method === 'median' ? 'Median' : 'Gaussian'} (${this.noise.kernelSize}x${this.noise.kernelSize})`;
        } else {
            noiseText += this.fft.enabled ? 'None' : 'None';
        }
        if (noiseText.endsWith(' + ')) {
            noiseText = noiseText.substring(0, noiseText.length - 3);
        }
        document.getElementById('summary-noise').innerText = noiseText;
        
        const binText = this.binarization.method === 'fixed' 
            ? `Fixed: ${this.binarization.fixedValue}` 
            : `Otsu * ${this.binarization.otsuPercent}%`;
        document.getElementById('summary-bin').innerText = binText;
        
        const scaleSq = this.umPerPx * this.umPerPx;
        const solidArea = this.limit.solidPx * scaleSq;
        const solidDia = 2 * Math.sqrt(solidArea / Math.PI);
        const voidArea = this.limit.voidPx * scaleSq;
        const voidDia = 2 * Math.sqrt(voidArea / Math.PI);
        
        document.getElementById('summary-limits').innerText = `Solid: ${solidDia.toFixed(3)}μm / Void: ${voidDia.toFixed(3)}μm`;
    },

    // --- UI EVENT BINDINGS ---
    bindEvents() {
        // Navigation clicks
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchPage(item.getAttribute('data-page'));
            });
        });
        
        // Prev/Next buttons
        const prevBtn = document.getElementById('btn-prev-page');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const pageOrder = ['general', 'scale', 'roi', 'grayscale', 'noise', 'binarization', 'limit', 'batch'];
                const idx = pageOrder.indexOf(this.activePage);
                if (idx > 0) this.switchPage(pageOrder[idx - 1]);
            });
        }
        const nextBtn = document.getElementById('btn-next-page');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const pageOrder = ['general', 'scale', 'roi', 'grayscale', 'noise', 'binarization', 'limit', 'batch'];
                const idx = pageOrder.indexOf(this.activePage);
                if (idx < pageOrder.length - 1) this.switchPage(pageOrder[idx + 1]);
            });
        }
        
        // Drawer toggles
        document.getElementById('menu-toggle-btn').addEventListener('click', () => {
            document.getElementById('app-container').classList.toggle('drawer-open');
        });
        document.getElementById('close-drawer-btn').addEventListener('click', () => {
            document.getElementById('app-container').classList.remove('drawer-open');
        });
        
        // Language Selection Radio listener
        document.querySelectorAll('input[name="ui-lang"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
                this.saveSettingsToStorage();
                this.updateBatchSummary();
                this.renderHistoryTable();
            });
        });
        
        // Main Image Load buttons
        const btnLoadImg = document.getElementById('btn-load-img');
        if (btnLoadImg) {
            btnLoadImg.addEventListener('click', () => {
                document.getElementById('input-single-image').click();
            });
        }
        document.getElementById('input-single-image').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.loadImage(e.target.files[0]);
            }
        });
        
        // Settings Import/Export
        document.getElementById('btn-load-config').addEventListener('click', () => {
            document.getElementById('input-config-loader').click();
        });
        document.getElementById('input-config-loader').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const parsed = JSON.parse(event.target.result);
                        this.applyJSONConfig(parsed, true);
                        this.logMessage(`Loaded configuration: ${parsed.name || 'imported'}`);
                    } catch (err) {
                        alert('Invalid JSON configuration file');
                    }
                };
                reader.readAsText(e.target.files[0]);
            }
        });
        document.getElementById('btn-save-config').addEventListener('click', async () => {
            const name = prompt(I18n.currentLang === 'ja' ? '保存する設定の別名を入力してください：' : 'Enter name for settings backup:', 'custom_settings');
            if (name) {
                const config = this.generateJSONConfigObject(name);
                const savedName = await FileSystemHelper.saveSettingsAsFile(config);
                if (savedName) {
                    this.logMessage(`Saved configuration as: ${savedName}`);
                }
            }
        });
        
        // Zoom and canvas control clicks
        document.getElementById('btn-zoom-in').addEventListener('click', () => this.setZoom(this.zoomScale + 0.15));
        document.getElementById('btn-zoom-out').addEventListener('click', () => this.setZoom(this.zoomScale - 0.15));
        document.getElementById('btn-zoom-fit').addEventListener('click', () => this.zoomToFit());
        document.getElementById('btn-zoom-reset').addEventListener('click', () => this.setZoom(1.0));
        
        // Sync Numeric Stepper input buttons
        this.bindNumericSteppers();
        
        // Bind settings inputs to trigger re-process on change
        this.bindSettingInputs();

        // Canvas interactions
        this.bindCanvasMouseEvents();
        
        // Drag and Drop files
        this.bindDragAndDropEvents();
        
        // Batch Processing interactions
        this.bindBatchEvents();

        // Table sorting header click listeners
        document.querySelectorAll('#results-table th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const col = th.getAttribute('data-sort');
                if (this.sortColumn === col) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = col;
                    this.sortDirection = 'asc';
                }
                this.updateSortHeadersUI();
                this.renderResultsTable();
            });
        });
    },

    bindNumericSteppers() {
        document.querySelectorAll('.number-input-wrapper').forEach(wrapper => {
            const input = wrapper.querySelector('input');
            const stepUp = wrapper.querySelector('.step-up');
            const stepDown = wrapper.querySelector('.step-down');
            
            if (stepUp && stepDown && input) {
                stepUp.addEventListener('click', () => {
                    const step = parseFloat(input.step) || 1;
                    const val = parseFloat(input.value) || 0;
                    input.value = (val + step).toFixed(step.toString().split('.')[1]?.length || 0);
                    input.dispatchEvent(new Event('change'));
                });
                stepDown.addEventListener('click', () => {
                    const step = parseFloat(input.step) || 1;
                    const val = parseFloat(input.value) || 0;
                    const min = parseFloat(input.min) !== undefined ? parseFloat(input.min) : -Infinity;
                    input.value = Math.max(min, val - step).toFixed(step.toString().split('.')[1]?.length || 0);
                    input.dispatchEvent(new Event('change'));
                });
            }
        });
    },

    bindSettingInputs() {
        // scale
        const scaleUmPxInput = document.getElementById('input-um-px');
        scaleUmPxInput.addEventListener('change', (e) => {
            this.umPerPx = Math.max(0.0001, parseFloat(e.target.value) || 1.0);
            this.updateLimitEquivalentLabels();
            this.updateBatchSummary();
            this.invalidateCCL();
            if (this.imageLoaded) this.evaluatePipeline();
            this.saveSettingsToStorage();
        });
        
        const actualLengthInput = document.getElementById('input-actual-length');
        actualLengthInput.addEventListener('change', (e) => {
            this.actualLength = Math.max(0.001, parseFloat(e.target.value) || 10.0);
            this.saveSettingsToStorage();
        });
        
        // apply measurements
        document.querySelectorAll('.apply-measure-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const axis = btn.getAttribute('data-axis');
                let pxLength = 0;
                
                if (axis === 'x') {
                    pxLength = parseFloat(document.getElementById('input-scale-dx-manual').value) || 0;
                } else if (axis === 'y') {
                    pxLength = parseFloat(document.getElementById('input-scale-dy-manual').value) || 0;
                } else if (axis === 'd') {
                    pxLength = parseFloat(document.getElementById('input-scale-d-manual').value) || 0;
                }
                
                if (pxLength > 0) {
                    this.umPerPx = this.actualLength / pxLength;
                    scaleUmPxInput.value = this.umPerPx.toFixed(3);
                    scaleUmPxInput.dispatchEvent(new Event('change'));
                }
            });
        });

        // manual inputs apply enabling
        const bindManualInput = (inputId, btnId) => {
            const input = document.getElementById(inputId);
            const btn = document.getElementById(btnId);
            if (input && btn) {
                input.addEventListener('input', () => {
                    const val = parseFloat(input.value) || 0;
                    btn.disabled = val <= 0;
                });
                const val = parseFloat(input.value) || 0;
                btn.disabled = val <= 0;
            }
        };
        bindManualInput('input-scale-dx-manual', 'btn-apply-x-measure');
        bindManualInput('input-scale-dy-manual', 'btn-apply-y-measure');
        bindManualInput('input-scale-d-manual', 'btn-apply-d-measure');
        
        // roi
        const roiEnableChk = document.getElementById('chk-roi-enable');
        roiEnableChk.addEventListener('change', (e) => {
            this.roi.enabled = e.target.checked;
            this.updateBatchSummary();
            this.invalidateGrayscale();
            if (this.imageLoaded) this.evaluatePipeline();
            this.saveSettingsToStorage();
        });
        
        const bindRoiCoord = (id, field) => {
            const input = document.getElementById(id);
            const handleInput = (e) => {
                const val = parseInt(e.target.value) || 0;
                this.roi[field] = Math.max(0, val);
                this.updateBatchSummary();
                this.invalidateGrayscale();
                this.redraw(); // Redraw green box instantly
                this.debouncedEvaluatePipeline(); // Debounce heavy analysis
                this.saveSettingsToStorage();
            };
            input.addEventListener('input', handleInput);
            input.addEventListener('change', handleInput);
            input.addEventListener('blur', () => {
                if (this.processTimeout) {
                    clearTimeout(this.processTimeout);
                }
                if (this.imageLoaded) this.evaluatePipeline();
            });
        };
        bindRoiCoord('input-roi-x1', 'x1');
        bindRoiCoord('input-roi-y1', 'y1');
        bindRoiCoord('input-roi-x2', 'x2');
        bindRoiCoord('input-roi-y2', 'y2');
        
        document.getElementById('btn-roi-full').addEventListener('click', () => {
            if (this.imageLoaded) {
                this.roi.x1 = 0;
                this.roi.y1 = 0;
                this.roi.x2 = this.originalWidth;
                this.roi.y2 = this.originalHeight;
                this.updateUIInputs();
                this.invalidateGrayscale();
                this.evaluatePipeline();
            }
        });
        
        // FFT parameters
        document.querySelectorAll('input[name="fft-enable"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.fft.enabled = e.target.value === 'enabled';
                this.updateBatchSummary();
                this.invalidateFFT();
                if (this.imageLoaded) this.evaluatePipeline();
                this.saveSettingsToStorage();
            });
        });
        document.getElementById('input-fft-highpass').addEventListener('change', (e) => {
            this.fft.highPassLimit = Math.max(0, parseInt(e.target.value) || 0);
            this.updateBatchSummary();
            this.invalidateFFT();
            if (this.imageLoaded) this.evaluatePipeline();
            this.saveSettingsToStorage();
        });
        document.getElementById('input-fft-lowpass').addEventListener('change', (e) => {
            this.fft.lowPassLimit = Math.max(1, parseInt(e.target.value) || 1);
            this.updateBatchSummary();
            this.invalidateFFT();
            if (this.imageLoaded) this.evaluatePipeline();
            this.saveSettingsToStorage();
        });
        
        // Noise parameters (as radio choices)
        document.querySelectorAll('input[name="noise-method-choice"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.noise.method = e.target.value;
                this.updateBatchSummary();
                this.invalidateNoise();
                if (this.imageLoaded) this.evaluatePipeline();
                this.saveSettingsToStorage();
            });
        });
        document.querySelectorAll('input[name="noise-kernel-choice"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.noise.kernelSize = parseInt(e.target.value) || 3;
                this.updateBatchSummary();
                this.invalidateNoise();
                if (this.imageLoaded) this.evaluatePipeline();
                this.saveSettingsToStorage();
            });
        });
        document.querySelectorAll('input[name="noise-display-mode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.redraw();
            });
        });
        
        // Grayscale conversion & display settings (radios)
        document.querySelectorAll('input[name="gray-channel-choice"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.binarization.channel = e.target.value;
                this.updateBatchSummary();
                this.invalidateGrayscale();
                if (this.imageLoaded) this.evaluatePipeline();
                this.saveSettingsToStorage();
            });
        });
        document.querySelectorAll('input[name="gray-display-mode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.redraw();
            });
        });
        
        // Binarization display settings (radios)
        document.querySelectorAll('input[name="bin-display-mode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.redraw();
            });
        });
        
        document.querySelectorAll('input[name="bin-method"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.binarization.method = e.target.value;
                this.toggleThresholdInputs();
                this.updateBatchSummary();
                this.invalidateBinarization();
                if (this.imageLoaded) this.evaluatePipeline();
                this.saveSettingsToStorage();
            });
        });
        document.getElementById('input-bin-fixed').addEventListener('change', (e) => {
            this.binarization.fixedValue = Math.max(0, Math.min(255, parseInt(e.target.value) || 128));
            this.invalidateBinarization();
            if (this.imageLoaded) this.evaluatePipeline();
            this.saveSettingsToStorage();
        });
        document.getElementById('input-bin-otsu-percent').addEventListener('change', (e) => {
            this.binarization.otsuPercent = Math.max(1, parseInt(e.target.value) || 100);
            this.updateBatchSummary();
            this.invalidateBinarization();
            if (this.imageLoaded) this.evaluatePipeline();
            this.saveSettingsToStorage();
        });
        
        // boundary drawing checkboxes sync
        const syncBoundaryChk = (e) => {
            const chk = e.target.checked;
            document.getElementById('chk-bin-boundary').checked = chk;
            document.getElementById('chk-limit-boundary').checked = chk;
            this.redraw();
        };
        document.getElementById('chk-bin-boundary').addEventListener('change', syncBoundaryChk);
        document.getElementById('chk-limit-boundary').addEventListener('change', syncBoundaryChk);
        
        document.getElementById('chk-limit-numbers').addEventListener('change', () => this.redraw());
        
        // limit
        document.querySelectorAll('input[name="limit-display-mode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.redraw();
            });
        });
        document.getElementById('input-limit-solid-px').addEventListener('change', (e) => {
            this.limit.solidPx = Math.max(0, parseInt(e.target.value) || 0);
            this.updateLimitEquivalentLabels();
            this.updateBatchSummary();
            this.invalidateCCL();
            if (this.imageLoaded) this.evaluatePipeline();
            this.saveSettingsToStorage();
        });
        document.getElementById('input-limit-void-px').addEventListener('change', (e) => {
            this.limit.voidPx = Math.max(0, parseInt(e.target.value) || 0);
            this.updateLimitEquivalentLabels();
            this.updateBatchSummary();
            this.invalidateCCL();
            if (this.imageLoaded) this.evaluatePipeline();
            this.saveSettingsToStorage();
        });

        // Absolute folder path input (if exists)
        const absPathInput = document.getElementById('input-folder-abs-path');
        if (absPathInput) {
            absPathInput.addEventListener('input', (e) => {
                this.inputDirectoryPath = e.target.value;
                localStorage.setItem('sinterpore_input_dir_path', this.inputDirectoryPath);
                this.renderBatchFilesTable();
            });
        }
    },

    // --- CANVAS ZOOM & INTERACTIVE DRAWING ---
    setZoom(scale) {
        if (!this.imageLoaded) return;
        this.zoomScale = Math.max(0.1, Math.min(10.0, scale));
        
        const width = this.originalWidth * this.zoomScale;
        const height = this.originalHeight * this.zoomScale;
        
        if (this.canvasWrapper) {
            this.canvasWrapper.style.width = `${width}px`;
            this.canvasWrapper.style.height = `${height}px`;
            this.canvasWrapper.classList.add('active');
        } else {
            this.baseCanvas.style.width = `${width}px`;
            this.baseCanvas.style.height = `${height}px`;
            this.overlayCanvas.style.width = `${width}px`;
            this.overlayCanvas.style.height = `${height}px`;
        }
        
        document.getElementById('zoom-text').innerText = `${Math.round(this.zoomScale * 100)}%`;
    },
    
    zoomToFit() {
        if (!this.imageLoaded) return;
        const container = document.getElementById('canvas-container');
        const padding = 20;
        const availW = container.clientWidth - padding;
        const availH = container.clientHeight - padding;
        
        const scaleX = availW / this.originalWidth;
        const scaleY = availH / this.originalHeight;
        
        this.setZoom(Math.min(scaleX, scaleY, 1.0));
    },

    getImgCoords(e) {
        const rect = this.baseCanvas.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        
        // Map to 1:1 image coordinates
        const x = Math.round((clientX / rect.width) * this.originalWidth);
        const y = Math.round((clientY / rect.height) * this.originalHeight);
        
        return {
            x: Math.max(0, Math.min(this.originalWidth, x)),
            y: Math.max(0, Math.min(this.originalHeight, y))
        };
    },

    bindCanvasMouseEvents() {
        const container = document.getElementById('canvas-container');
        
        container.addEventListener('wheel', (e) => {
            if (!this.imageLoaded) return;
            e.preventDefault();
            const zoomStep = 0.05;
            const factor = e.deltaY < 0 ? (1 + zoomStep) : (1 - zoomStep);
            this.setZoom(this.zoomScale * factor);
        }, { passive: false });
        
        this.baseCanvas.addEventListener('mousedown', (e) => {
            if (!this.imageLoaded) return;
            const pt = this.getImgCoords(e);
            
            // Check if ROI corner or edge is dragged (only in ROI page)
            let isROIDrag = false;
            if (this.activePage === 'roi' && this.roi.enabled) {
                const handleRadius = Math.max(12, 12 / this.zoomScale); // hit area based on zoom
                const corners = [
                    { x: this.roi.x1, y: this.roi.y1 }, // TL
                    { x: this.roi.x2, y: this.roi.y1 }, // TR
                    { x: this.roi.x2, y: this.roi.y2 }, // BR
                    { x: this.roi.x1, y: this.roi.y2 }  // BL
                ];
                
                let clickedCorner = -1;
                for (let i = 0; i < 4; i++) {
                    const dx = pt.x - corners[i].x;
                    const dy = pt.y - corners[i].y;
                    if (Math.sqrt(dx*dx + dy*dy) <= handleRadius) {
                        clickedCorner = i;
                        break;
                    }
                }
                
                if (clickedCorner !== -1) {
                    this.dragMode = 'resize';
                    this.draggedCorner = clickedCorner;
                    isROIDrag = true;
                } else {
                    // Check edges
                    const edgeTolerance = Math.max(8, 8 / this.zoomScale);
                    let clickedEdge = null;
                    
                    // Check horizontal edges (top/bottom) within x1..x2
                    if (pt.x >= this.roi.x1 - edgeTolerance && pt.x <= this.roi.x2 + edgeTolerance) {
                        if (Math.abs(pt.y - this.roi.y1) <= edgeTolerance) {
                            clickedEdge = 'top';
                        } else if (Math.abs(pt.y - this.roi.y2) <= edgeTolerance) {
                            clickedEdge = 'bottom';
                        }
                    }
                    // Check vertical edges (left/right) within y1..y2
                    if (pt.y >= this.roi.y1 - edgeTolerance && pt.y <= this.roi.y2 + edgeTolerance) {
                        if (Math.abs(pt.x - this.roi.x1) <= edgeTolerance) {
                            clickedEdge = 'left';
                        } else if (Math.abs(pt.x - this.roi.x2) <= edgeTolerance) {
                            clickedEdge = 'right';
                        }
                    }
                    
                    if (clickedEdge) {
                        this.dragMode = 'resize-edge';
                        this.draggedEdge = clickedEdge;
                        isROIDrag = true;
                    }
                }
            }
            
            // If not dragging/resizing ROI, start panning candidate
            if (!isROIDrag) {
                this.isPanningCandidate = true;
                this.panStart = { x: e.clientX, y: e.clientY };
                this.scrollStart = { x: container.scrollLeft, y: container.scrollTop };
            }
        });

        container.addEventListener('mousemove', (e) => {
            if (!this.imageLoaded) return;
            const pt = this.getImgCoords(e);
            
            // Update coordinates label
            const coordsText = document.getElementById('coords-text');
            if (coordsText) {
                coordsText.innerText = `X: ${pt.x}, Y: ${pt.y}`;
            }
            
            // 1. If currently panning
            if (this.isPanning) {
                const dx = e.clientX - this.panStart.x;
                const dy = e.clientY - this.panStart.y;
                container.scrollLeft = this.scrollStart.x - dx;
                container.scrollTop = this.scrollStart.y - dy;
                return;
            }
            
            // 2. Check if we should upgrade panning candidate to active panning
            if (this.isPanningCandidate) {
                const dist = Math.hypot(e.clientX - this.panStart.x, e.clientY - this.panStart.y);
                if (dist > 5) {
                    this.isPanning = true;
                    this.isPanningCandidate = false;
                    container.style.cursor = 'grabbing';
                    return;
                }
            }
            
            // 3. If drawing scale (following 2-point click first point)
            if (this.activePage === 'scale' && this.isMeasuringScale) {
                this.scaleEnd = pt;
                this.updateScaleBarInfo();
                this.redraw();
                return;
            }
            
            // 4. Set cursors when hovering over handle / edges / interior
            if (this.activePage === 'roi' && this.roi.enabled && !this.dragMode && !this.isPanning) {
                const handleRadius = Math.max(12, 12 / this.zoomScale);
                const corners = [
                    { x: this.roi.x1, y: this.roi.y1 }, // TL
                    { x: this.roi.x2, y: this.roi.y1 }, // TR
                    { x: this.roi.x2, y: this.roi.y2 }, // BR
                    { x: this.roi.x1, y: this.roi.y2 }  // BL
                ];
                let hoverCorner = -1;
                for (let i = 0; i < 4; i++) {
                    const dx = pt.x - corners[i].x;
                    const dy = pt.y - corners[i].y;
                    if (Math.sqrt(dx*dx + dy*dy) <= handleRadius) {
                        hoverCorner = i;
                        break;
                    }
                }
                
                if (hoverCorner === 0 || hoverCorner === 2) {
                    this.baseCanvas.style.cursor = 'nwse-resize';
                } else if (hoverCorner === 1 || hoverCorner === 3) {
                    this.baseCanvas.style.cursor = 'nesw-resize';
                } else {
                    const edgeTolerance = Math.max(8, 8 / this.zoomScale);
                    let hoverEdge = null;
                    if (pt.x >= this.roi.x1 - edgeTolerance && pt.x <= this.roi.x2 + edgeTolerance) {
                        if (Math.abs(pt.y - this.roi.y1) <= edgeTolerance) hoverEdge = 'top';
                        else if (Math.abs(pt.y - this.roi.y2) <= edgeTolerance) hoverEdge = 'bottom';
                    }
                    if (pt.y >= this.roi.y1 - edgeTolerance && pt.y <= this.roi.y2 + edgeTolerance) {
                        if (Math.abs(pt.x - this.roi.x1) <= edgeTolerance) hoverEdge = 'left';
                        else if (Math.abs(pt.x - this.roi.x2) <= edgeTolerance) hoverEdge = 'right';
                    }
                    
                    if (hoverEdge === 'top' || hoverEdge === 'bottom') {
                        this.baseCanvas.style.cursor = 'ns-resize';
                    } else if (hoverEdge === 'left' || hoverEdge === 'right') {
                        this.baseCanvas.style.cursor = 'ew-resize';
                    } else if (pt.x > this.roi.x1 && pt.x < this.roi.x2 && pt.y > this.roi.y1 && pt.y < this.roi.y2) {
                        this.baseCanvas.style.cursor = 'grab';
                    } else {
                        this.baseCanvas.style.cursor = '';
                    }
                }
            } else if (!this.dragMode && !this.isPanning) {
                this.baseCanvas.style.cursor = '';
            }
            
            // 5. If ROI dragging
            if (this.activePage === 'roi' && this.roi.enabled && this.dragMode) {
                if (this.dragMode === 'resize') {
                    // Resize ROI corner
                    if (this.draggedCorner === 0) { // TL
                        this.roi.x1 = Math.min(pt.x, this.roi.x2 - 10);
                        this.roi.y1 = Math.min(pt.y, this.roi.y2 - 10);
                    } else if (this.draggedCorner === 1) { // TR
                        this.roi.x2 = Math.max(pt.x, this.roi.x1 + 10);
                        this.roi.y1 = Math.min(pt.y, this.roi.y2 - 10);
                    } else if (this.draggedCorner === 2) { // BR
                        this.roi.x2 = Math.max(pt.x, this.roi.x1 + 10);
                        this.roi.y2 = Math.max(pt.y, this.roi.y1 + 10);
                    } else if (this.draggedCorner === 3) { // BL
                        this.roi.x1 = Math.min(pt.x, this.roi.x2 - 10);
                        this.roi.y2 = Math.max(pt.y, this.roi.y1 + 10);
                    }
                } else if (this.dragMode === 'resize-edge') {
                    // Resize ROI edge
                    if (this.draggedEdge === 'top') {
                        this.roi.y1 = Math.min(pt.y, this.roi.y2 - 10);
                    } else if (this.draggedEdge === 'bottom') {
                        this.roi.y2 = Math.max(pt.y, this.roi.y1 + 10);
                    } else if (this.draggedEdge === 'left') {
                        this.roi.x1 = Math.min(pt.x, this.roi.x2 - 10);
                    } else if (this.draggedEdge === 'right') {
                        this.roi.x2 = Math.max(pt.x, this.roi.x1 + 10);
                    }
                }
                
                // Clamp coordinates to image boundaries
                this.roi.x1 = Math.max(0, Math.min(this.originalWidth, this.roi.x1));
                this.roi.y1 = Math.max(0, Math.min(this.originalHeight, this.roi.y1));
                this.roi.x2 = Math.max(0, Math.min(this.originalWidth, this.roi.x2));
                this.roi.y2 = Math.max(0, Math.min(this.originalHeight, this.roi.y2));
                
                this.updateUIInputs();
                this.invalidateGrayscale();
                this.redraw();
            }
        });

        window.addEventListener('mouseup', (e) => {
            // Restore cursor
            container.style.cursor = '';
            
            // If was panning, stop
            if (this.isPanning) {
                this.isPanning = false;
                return;
            }
            
            // If panning candidate was not upgraded, it counts as a click
            if (this.isPanningCandidate) {
                this.isPanningCandidate = false;
                const pt = this.getImgCoords(e);
                
                if (this.activePage === 'scale') {
                    if (!this.isMeasuringScale) {
                        // First click
                        this.scaleStart = pt;
                        this.scaleEnd = null;
                        this.isMeasuringScale = true;
                        this.redraw();
                    } else {
                        // Second click
                        this.scaleEnd = pt;
                        this.isMeasuringScale = false;
                        this.updateScaleBarInfo();
                        this.redraw();
                    }
                } else if (this.activePage === 'limit' && this.imageLoaded) {
                    this.handleComponentClick(pt);
                }
            }
            
            if (this.dragMode) {
                this.dragMode = null;
                this.saveSettingsToStorage();
                this.updateBatchSummary();
                this.evaluatePipeline();
            }
        });
    },

    handleComponentClick(pt) {
        const rx1 = this.roi.enabled ? this.roi.x1 : 0;
        const ry1 = this.roi.enabled ? this.roi.y1 : 0;
        const w = this.roi.enabled ? (this.roi.x2 - this.roi.x1) : this.originalWidth;
        const h = this.roi.enabled ? (this.roi.y2 - this.roi.y1) : this.originalHeight;
        
        const rx = pt.x - rx1;
        const ry = pt.y - ry1;
        
        if (rx >= 0 && rx < w && ry >= 0 && ry < h && this.binArray) {
            const idx = ry * w + rx;
            const targetVal = this.binArray[idx]; // 0 or 255
            
            // BFS to identify clicked connected region
            const visited = new Uint8Array(w * h);
            const queue = new Int32Array(w * h);
            let head = 0, tail = 0;
            
            queue[tail++] = idx;
            visited[idx] = 1;
            
            let count = 0;
            let sumX = 0, sumY = 0;
            
            const dx8 = [-1, 0, 1, -1, 1, -1, 0, 1];
            const dy8 = [-1, -1, -1, 0, 0, 1, 1, 1];
            
            while (head < tail) {
                const curr = queue[head++];
                const cx = curr % w;
                const cy = Math.floor(curr / w);
                count++;
                sumX += cx;
                sumY += cy;
                
                for (let i = 0; i < 8; i++) {
                    const nx = cx + dx8[i];
                    const ny = cy + dy8[i];
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                        const nIdx = ny * w + nx;
                        if (visited[nIdx] === 0 && this.binArray[nIdx] === targetVal) {
                            visited[nIdx] = 1;
                            queue[tail++] = nIdx;
                        }
                    }
                }
            }
            
            const cx = sumX / count;
            const cy = sumY / count;
            
            // Find component with matching type, pixel count, and centroid
            const type = targetVal === 255 ? 'solid' : 'void';
            const matched = this.components.find(c => 
                c.type === type &&
                Math.abs(c.pixels - count) < 2 &&
                Math.abs(c.cx - cx) < 0.1 &&
                Math.abs(c.cy - cy) < 0.1
            );
            
            if (matched) {
                this.selectedCompId = matched.id;
                this.redraw();
                
                // Update table select highlight
                document.querySelectorAll('#results-table tbody tr').forEach(r => r.classList.remove('selected'));
                const row = document.querySelector(`#results-table tbody tr[data-id="${matched.id}"]`);
                if (row) {
                    row.classList.add('selected');
                    row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else {
                this.selectedCompId = null;
                this.redraw();
                document.querySelectorAll('#results-table tbody tr').forEach(r => r.classList.remove('selected'));
            }
        }
    },

    updateScaleBarInfo() {
        if (!this.scaleStart || !this.scaleEnd) return;
        const dx = Math.abs(this.scaleEnd.x - this.scaleStart.x);
        const dy = Math.abs(this.scaleEnd.y - this.scaleStart.y);
        const d = Math.sqrt(dx*dx + dy*dy);
        
        document.getElementById('scale-dx').innerText = `${dx.toFixed(0)} px`;
        document.getElementById('scale-dy').innerText = `${dy.toFixed(0)} px`;
        
        const manualInput = document.getElementById('input-scale-d-manual');
        if (manualInput) {
            manualInput.value = d.toFixed(1);
            manualInput.dispatchEvent(new Event('input')); // trigger enabling apply button
        }
        
        const btnApplyD = document.getElementById('btn-apply-d-measure');
        if (btnApplyD) {
            btnApplyD.disabled = d === 0;
        }
        document.querySelectorAll('.apply-measure-btn').forEach(btn => {
            const axis = btn.getAttribute('data-axis');
            if (axis !== 'd') {
                btn.disabled = d === 0;
            }
        });
    },

    loadImage(file) {
        this.currentLoadedFile = file;
        this.imageName = file.name;
        const relPath = this.getFileRelativePath(file);
        this.imageFolder = relPath 
            ? relPath.substring(0, relPath.lastIndexOf('/')) 
            : 'Local File';
            
        this.logMessage(`Loading image file: ${this.imageName}`);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.imageElement = img;
                this.originalWidth = img.naturalWidth;
                this.originalHeight = img.naturalHeight;
                this.imageLoaded = true;
                
                // Set canvas coordinates
                this.baseCanvas.width = this.originalWidth;
                this.baseCanvas.height = this.originalHeight;
                this.overlayCanvas.width = this.originalWidth;
                this.overlayCanvas.height = this.originalHeight;
                
                // Initialize default ROI to 10% margins if not set or out of bounds
                if (this.roi.x2 <= this.roi.x1 || this.roi.x2 > this.originalWidth || this.roi.y2 > this.originalHeight) {
                    this.roi.x1 = Math.round(this.originalWidth * 0.1);
                    this.roi.y1 = Math.round(this.originalHeight * 0.1);
                    this.roi.x2 = Math.round(this.originalWidth * 0.9);
                    this.roi.y2 = Math.round(this.originalHeight * 0.9);
                }
                
                // Show info bar (safely guarded)
                const loadedFileName = document.getElementById('loaded-file-name');
                if (loadedFileName) loadedFileName.innerText = this.imageName;
                const loadedImageInfo = document.getElementById('loaded-image-info');
                if (loadedImageInfo) loadedImageInfo.classList.remove('hidden');
                
                const placeholder = document.getElementById('canvas-placeholder');
                if (placeholder) placeholder.classList.add('hidden');
                
                this.updateUIInputs();
                this.updateBatchSummary();
                this.zoomToFit();
                this.invalidateGrayscale();
                this.evaluatePipeline();
                this.updateActiveFileHighlight();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    },

    processTimeout: null,
    debouncedProcessImage() {
        if (this.processTimeout) {
            clearTimeout(this.processTimeout);
        }
        this.processTimeout = setTimeout(() => {
            if (this.imageLoaded) this.processImage();
        }, 300);
    },

    // --- CORE IMAGE PROCESSING PIPELINE (Full Compatibility Method) ---
    processImage() {
        if (!this.imageLoaded) return;
        
        const W_ROI = this.roi.enabled ? (this.roi.x2 - this.roi.x1) : this.originalWidth;
        const H_ROI = this.roi.enabled ? (this.roi.y2 - this.roi.y1) : this.originalHeight;
        const rx1 = this.roi.enabled ? this.roi.x1 : 0;
        const ry1 = this.roi.enabled ? this.roi.y1 : 0;
        
        // Extract ROI image data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = W_ROI;
        tempCanvas.height = H_ROI;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.imageElement, rx1, ry1, W_ROI, H_ROI, 0, 0, W_ROI, H_ROI);
        const roiImageData = tempCtx.getImageData(0, 0, W_ROI, H_ROI);
        
        this.invalidateGrayscale();
        this.runGrayscaleStage(roiImageData);
        this.runFFTStage(W_ROI, H_ROI);
        this.runNoiseStage(W_ROI, H_ROI);
        this.runBinarizationStage();
        this.runCCLStage(W_ROI, H_ROI);
        
        this.renderResultsTable();
        this.redraw();
    },


    renderResultsTable() {
        const tbody = document.querySelector('#results-table tbody');
        tbody.innerHTML = '';
        
        if (this.components.length === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="5" class="text-center" data-i18n="no_results">${I18n.get('no_results')}</td></tr>`;
            return;
        }
        
        // Sort components dynamically based on state
        const sorted = [...this.components].sort((a, b) => {
            let valA, valB;
            if (this.sortColumn === 'id') {
                valA = a.id;
                valB = b.id;
            } else if (this.sortColumn === 'type') {
                valA = a.type;
                valB = b.type;
            } else if (this.sortColumn === 'limit') {
                valA = a.isBelowLimit ? 1 : 0;
                valB = b.isBelowLimit ? 1 : 0;
            } else if (this.sortColumn === 'area') {
                valA = a.area;
                valB = b.area;
            } else if (this.sortColumn === 'dia') {
                valA = a.diameter;
                valB = b.diameter;
            }
            
            if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        sorted.forEach(comp => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', comp.id);
            if (this.selectedCompId === comp.id) {
                tr.classList.add('selected');
            }
            
            const typeText = comp.type === 'solid' 
                ? `<span class="text-blue font-semibold">${I18n.currentLang === 'ja' ? '実体' : comp.type}</span>` 
                : `<span class="text-purple font-semibold">${I18n.currentLang === 'ja' ? '空隙' : comp.type}</span>`;
            
            const limitText = comp.isBelowLimit 
                ? `<span style="color:var(--warning); font-weight:600;">${I18n.currentLang === 'ja' ? '以下' : 'Below'}</span>` 
                : `<span style="color:var(--success); font-weight:600;">${I18n.currentLang === 'ja' ? '以上' : 'Above'}</span>`;
                
            tr.innerHTML = `
                <td>${comp.id}</td>
                <td>${typeText}</td>
                <td>${limitText}</td>
                <td class="text-right">${comp.area.toFixed(3)}</td>
                <td class="text-right">${comp.diameter.toFixed(3)}</td>
            `;
            
            tr.addEventListener('click', () => {
                if (this.selectedCompId === comp.id) {
                    this.selectedCompId = null;
                    tr.classList.remove('selected');
                } else {
                    this.selectedCompId = comp.id;
                    document.querySelectorAll('#results-table tbody tr').forEach(r => r.classList.remove('selected'));
                    tr.classList.add('selected');
                    this.scrollToComponent(comp);
                }
                this.redraw();
            });
            tbody.appendChild(tr);
        });
    },

    updateSortHeadersUI() {
        document.querySelectorAll('#results-table th.sortable').forEach(th => {
            const col = th.getAttribute('data-sort');
            const icon = th.querySelector('.sort-icon');
            if (icon) {
                if (col === this.sortColumn) {
                    icon.innerHTML = this.sortDirection === 'asc' ? ' &#9650;' : ' &#9660;';
                } else {
                    icon.innerHTML = '';
                }
            }
        });
    },

    scrollToComponent(comp) {
        // Calculate coordinate in image space
        const rx1 = this.roi.enabled ? this.roi.x1 : 0;
        const ry1 = this.roi.enabled ? this.roi.y1 : 0;
        const targetImgX = rx1 + comp.cx;
        const targetImgY = ry1 + comp.cy;
        
        // Map to client pixel space inside scrollable container
        const container = document.getElementById('canvas-container');
        
        // Scroll container to center this point
        const clientX = targetImgX * this.zoomScale;
        const clientY = targetImgY * this.zoomScale;
        
        container.scrollTo({
            left: clientX - container.clientWidth / 2,
            top: clientY - container.clientHeight / 2,
            behavior: 'smooth'
        });
    },

    // --- CANVAS RENDERING CONTROLLER ---
    redraw() {
        // Clear canvases
        this.baseCtx.clearRect(0, 0, this.originalWidth, this.originalHeight);
        this.overlayCtx.clearRect(0, 0, this.originalWidth, this.originalHeight);
        
        if (!this.imageLoaded) return;
        
        // 1. Draw base image
        this.baseCtx.drawImage(this.imageElement, 0, 0);
        
        // 2. Overwrite ROI with processed pixels depending on active page and display settings
        const rx1 = this.roi.enabled ? this.roi.x1 : 0;
        const ry1 = this.roi.enabled ? this.roi.y1 : 0;
        const w = this.roi.enabled ? (this.roi.x2 - this.roi.x1) : this.originalWidth;
        const h = this.roi.enabled ? (this.roi.y2 - this.roi.y1) : this.originalHeight;
        
        if (w > 0 && h > 0) {
            if (this.activePage === 'grayscale') {
                const displayModeRadio = document.querySelector('input[name="gray-display-mode"]:checked');
                const displayMode = displayModeRadio ? displayModeRadio.value : 'gray';
                if (displayMode === 'gray' && this.grayArray) {
                    this.drawProcessedROI(this.grayArray, rx1, ry1, w, h);
                }
            } else if (this.activePage === 'noise') {
                const displayModeRadio = document.querySelector('input[name="noise-display-mode"]:checked');
                const displayMode = displayModeRadio ? displayModeRadio.value : 'smooth';
                if (displayMode === 'gray' && this.grayArray) {
                    this.drawProcessedROI(this.grayArray, rx1, ry1, w, h);
                } else if (displayMode === 'fft' && this.fftArray) {
                    this.drawProcessedROI(this.fftArray, rx1, ry1, w, h);
                } else if (displayMode === 'smooth' && this.noiseArray) {
                    this.drawProcessedROI(this.noiseArray, rx1, ry1, w, h);
                }
            } else if (this.activePage === 'binarization') {
                const displayModeRadio = document.querySelector('input[name="bin-display-mode"]:checked');
                const displayMode = displayModeRadio ? displayModeRadio.value : 'bin';
                if (displayMode === 'gray' && this.grayArray) {
                    this.drawProcessedROI(this.grayArray, rx1, ry1, w, h);
                } else if (displayMode === 'noise' && this.noiseArray) {
                    this.drawProcessedROI(this.noiseArray, rx1, ry1, w, h);
                } else if (displayMode === 'bin' && this.binArray) {
                    this.drawProcessedROI(this.binArray, rx1, ry1, w, h);
                }
            } else if (this.activePage === 'limit') {
                const displayModeRadio = document.querySelector('input[name="limit-display-mode"]:checked');
                const displayMode = displayModeRadio ? displayModeRadio.value : 'bin';
                if (displayMode === 'gray' && this.grayArray) {
                    this.drawProcessedROI(this.grayArray, rx1, ry1, w, h);
                } else if (displayMode === 'noise' && this.noiseArray) {
                    this.drawProcessedROI(this.noiseArray, rx1, ry1, w, h);
                } else if (displayMode === 'bin' && this.binArray) {
                    this.drawProcessedROI(this.binArray, rx1, ry1, w, h);
                }
            }
        }
        
        // 3. Draw scale bar ticks in scale mode
        if (this.activePage === 'scale' && (this.scaleStart || this.scaleEnd)) {
            this.drawScaleLine();
        }
        
        // 4. Draw ROI rectangle in ROI mode or if enabled
        if (this.roi.enabled && (this.activePage === 'roi' || 
            ['noise', 'binarization', 'limit'].includes(this.activePage) || 
            this.activePage === 'batch')) {
            this.drawROIRect();
        }
        
        // 5. Draw binary contours and details on analysis pages
        if (['binarization', 'limit', 'batch'].includes(this.activePage)) {
            const chkBoundary = document.getElementById('chk-bin-boundary');
            const showBoundaries = chkBoundary ? chkBoundary.checked : true;
            if (showBoundaries && this.components.length > 0) {
                this.drawBoundaries();
            }
        }
    },

    drawProcessedROI(pixels, rx1, ry1, w, h) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext('2d');
        const imgData = tempCtx.createImageData(w, h);
        const data = imgData.data;
        
        const len = pixels.length;
        for (let i = 0; i < len; i++) {
            const val = pixels[i];
            const idx = i * 4;
            data[idx] = val;     // R
            data[idx + 1] = val; // G
            data[idx + 2] = val; // B
            data[idx + 3] = 255; // A
        }
        
        tempCtx.putImageData(imgData, 0, 0);
        this.baseCtx.drawImage(tempCanvas, rx1, ry1);
    },

    drawScaleLine() {
        const ctx = this.overlayCtx;
        const start = this.scaleStart;
        const end = this.scaleEnd;
        
        ctx.save();
        
        // Draw crosshair at start
        if (start) {
            this.drawCrosshair(ctx, start.x, start.y, '#00d2ff');
        }
        
        // Draw line and crosshair at end
        if (end) {
            ctx.strokeStyle = '#00d2ff';
            ctx.lineWidth = Math.max(2, 2 / this.zoomScale);
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            
            this.drawCrosshair(ctx, end.x, end.y, '#00d2ff');
        }
        
        ctx.restore();
    },

    drawCrosshair(ctx, x, y, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1.5, 1.5 / this.zoomScale);
        const size = Math.max(8, 8 / this.zoomScale);
        
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y + size);
        ctx.stroke();
        ctx.restore();
    },

    drawROIRect() {
        const ctx = this.overlayCtx;
        const { x1, y1, x2, y2 } = this.roi;
        
        ctx.save();
        
        // Outside ROI shading (kept on all pages)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        // Top block
        ctx.fillRect(0, 0, this.originalWidth, y1);
        // Bottom block
        ctx.fillRect(0, y2, this.originalWidth, this.originalHeight - y2);
        // Left block
        ctx.fillRect(0, y1, x1, y2 - y1);
        // Right block
        ctx.fillRect(x2, y1, this.originalWidth - x2, y2 - y1);
        
        // Draw green bounding rect and resize handles ONLY on the ROI page
        if (this.activePage === 'roi') {
            ctx.strokeStyle = '#10b981'; // neon green
            ctx.lineWidth = Math.max(2, 2 / this.zoomScale);
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            
            // Draw translucent inner shading
            ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            
            ctx.restore(); // cancel dashes
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = Math.max(2, 2 / this.zoomScale);
            
            const handleRadius = Math.max(6, 6 / this.zoomScale);
            const corners = [
                { x: x1, y: y1 }, // TL
                { x: x2, y: y1 }, // TR
                { x: x2, y: y2 }, // BR
                { x: x1, y: y2 }  // BL
            ];
            
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.arc(corners[i].x, corners[i].y, handleRadius, 0, 2*Math.PI);
                ctx.fill();
                ctx.stroke();
            }
        } else {
            ctx.restore();
        }
    },

    drawBoundaries() {
        const W_ROI = this.roi.enabled ? (this.roi.x2 - this.roi.x1) : this.originalWidth;
        const H_ROI = this.roi.enabled ? (this.roi.y2 - this.roi.y1) : this.originalHeight;
        const rx1 = this.roi.enabled ? this.roi.x1 : 0;
        const ry1 = this.roi.enabled ? this.roi.y1 : 0;
        
        // Create offscreen buffer image data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = W_ROI;
        tempCanvas.height = H_ROI;
        const tempCtx = tempCanvas.getContext('2d');
        const overlayData = tempCtx.createImageData(W_ROI, H_ROI);
        const data = overlayData.data;
        
        // Define color palette (RGBA)
        const colors = {
            solidNormal: [59, 130, 246, 210],    // Blue
            solidBelow:  [249, 115, 22, 210],    // Orange
            voidNormal:  [6, 182, 212, 210],     // Cyan
            voidBelow:   [239, 68, 68, 210],     // Red
            selected:    [255, 255, 255, 0]      // We'll overlay selected separately
        };
        
        let selectedComp = null;
        
        // Fill boundary pixels
        for (const c of this.components) {
            if (c.id === this.selectedCompId) {
                selectedComp = c;
                continue; // Draw selected component boundary with a thick vector path later
            }
            
            let color;
            if (c.type === 'solid') {
                color = c.isBelowLimit ? colors.solidBelow : colors.solidNormal;
            } else {
                color = c.isBelowLimit ? colors.voidBelow : colors.voidNormal;
            }
            
            const r = color[0], g = color[1], b = color[2], a = color[3];
            const boundary = c.boundary;
            const len = boundary.length;
            
            for (let i = 0; i < len; i += 2) {
                const bx = boundary[i];
                const by = boundary[i + 1];
                const idx = (by * W_ROI + bx) * 4;
                
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = a;
            }
        }
        
        // Write boundary pixels
        tempCtx.putImageData(overlayData, 0, 0);
        this.overlayCtx.drawImage(tempCanvas, rx1, ry1);
        
        // Vector-draw the selected component boundary thick and glowing (only on limit page)
        if (selectedComp && this.activePage === 'limit') {
            const ctx = this.overlayCtx;
            ctx.save();
            ctx.strokeStyle = '#ffffff';
            ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'; // translucent red fill
            ctx.lineWidth = Math.max(3, 3 / this.zoomScale);
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
            
            const boundary = selectedComp.boundary;
            const len = boundary.length;
            
            ctx.beginPath();
            // Since boundary coords are unsorted list of points, just fill small squares for thick boundary
            // or trace outer bounds? Since it's a list of pixels, fillRect is easiest and fastest for drawing thick contours.
            ctx.fillStyle = '#ff003c';
            const size = Math.max(2, 2 / this.zoomScale);
            for (let i = 0; i < len; i += 2) {
                ctx.fillRect(rx1 + boundary[i] - size/2, ry1 + boundary[i+1] - size/2, size, size);
            }
            ctx.restore();
        }
        
        // Draw label numbers
        const drawNumbers = document.getElementById('chk-limit-numbers').checked;
        if (drawNumbers && this.activePage === 'limit') {
            const ctx = this.overlayCtx;
            ctx.save();
            ctx.font = `bold ${Math.max(10, 11 / this.zoomScale)}px var(--font-outfit)`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            for (const c of this.components) {
                // If it is below limit and very small (< 10px), skip label to prevent extreme clutter
                if (c.isBelowLimit && c.pixels < 10) continue;
                
                const lx = rx1 + c.cx;
                const ly = ry1 + c.cy;
                
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = Math.max(2, 2 / this.zoomScale);
                ctx.strokeText(c.id, lx, ly);
                
                ctx.fillStyle = c.type === 'solid' ? '#60a5fa' : '#c084fc';
                ctx.fillText(c.id, lx, ly);
            }
            ctx.restore();
        }
    },

    traverseFileEntries(items) {
        return new Promise((resolve) => {
            const files = [];
            let pending = 0;
            
            const traverse = async (entry) => {
                pending++;
                if (entry.isFile) {
                    try {
                        const file = await new Promise((res, rej) => entry.file(res, rej));
                        if (file.type.startsWith('image/')) {
                            const relPath = entry.fullPath.startsWith('/') ? entry.fullPath.substring(1) : entry.fullPath;
                            Object.defineProperty(file, 'customRelativePath', {
                                value: relPath,
                                writable: true,
                                configurable: true
                            });
                            files.push(file);
                        }
                    } catch (e) {
                        console.error('Error reading file entry:', e);
                    }
                } else if (entry.isDirectory) {
                    try {
                        const dirReader = entry.createReader();
                        const entries = await new Promise((res) => {
                            const allEntries = [];
                            const readAll = () => {
                                dirReader.readEntries((results) => {
                                    if (results.length === 0) {
                                        res(allEntries);
                                    } else {
                                        allEntries.push(...results);
                                        readAll();
                                    }
                                }, () => res(allEntries));
                            };
                            readAll();
                        });
                        for (const child of entries) {
                            await traverse(child);
                        }
                    } catch (e) {
                        console.error('Error reading directory entry:', e);
                    }
                }
                pending--;
                if (pending === 0) {
                    resolve(files);
                }
            };
            
            for (const item of items) {
                if (item.kind === 'file') {
                    const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
                    if (entry) {
                        traverse(entry);
                    } else {
                        const file = item.getAsFile();
                        if (file && file.type.startsWith('image/')) {
                            files.push(file);
                        }
                    }
                }
            }
            if (pending === 0) {
                resolve(files);
            }
        });
    },

    getFileRelativePath(file) {
        return file.customRelativePath || file.webkitRelativePath || '';
    },

    // --- DRAG AND DROP HANDLERS ---
    bindDragAndDropEvents() {
        const dropZone = document.getElementById('drop-zone');
        const container = document.getElementById('preview-panel');
        const commonLoadCard = document.getElementById('common-load-card');
        const configDropZone = document.getElementById('config-drop-zone');
        
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('active');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('active');
        });
        
        dropZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropZone.classList.remove('active');
            
            const items = e.dataTransfer.items;
            if (items && items.length > 0) {
                const files = await this.traverseFileEntries(items);
                if (files.length > 0) {
                    if (this.activePage === 'batch') {
                        this.addFilesToList(files);
                    } else {
                        this.loadImage(files[0]);
                    }
                }
            }
        });
        
        if (commonLoadCard) {
            commonLoadCard.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                commonLoadCard.classList.add('drag-over');
            });
            commonLoadCard.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                commonLoadCard.classList.remove('drag-over');
            });
            commonLoadCard.addEventListener('drop', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                commonLoadCard.classList.remove('drag-over');
                
                const items = e.dataTransfer.items;
                if (items && items.length > 0) {
                    const files = await this.traverseFileEntries(items);
                    if (files.length > 0) {
                        this.addFilesToList(files);
                    }
                }
            });
        }
        
        if (configDropZone) {
            configDropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                configDropZone.classList.add('drag-over');
            });
            configDropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                configDropZone.classList.remove('drag-over');
            });
            configDropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                configDropZone.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const file = files[0];
                    if (file.name.endsWith('.json')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            try {
                                const parsed = JSON.parse(event.target.result);
                                this.applyJSONConfig(parsed, true);
                                this.logMessage(`Loaded configuration from drag & drop: ${parsed.name || 'imported'}`);
                            } catch (err) {
                                alert('Invalid JSON configuration file');
                            }
                        };
                        reader.readAsText(file);
                    }
                }
            });
        }
    },

    // --- BATCH PROCESSING ---
    bindBatchEvents() {
        const btnAddFiles = document.getElementById('btn-add-files');
        const btnAddFolder = document.getElementById('btn-add-folder');
        const btnClear = document.getElementById('btn-clear-files');
        const filePicker = document.getElementById('input-files-picker');
        const folderPicker = document.getElementById('input-folder-picker');
        
        btnAddFiles.addEventListener('click', () => filePicker.click());
        btnAddFolder.addEventListener('click', () => folderPicker.click());
        
        filePicker.addEventListener('change', (e) => {
            this.addFilesToList(e.target.files);
            filePicker.value = ''; // Reset picker
        });
        
        folderPicker.addEventListener('change', (e) => {
            this.addFilesToList(e.target.files);
            folderPicker.value = '';
        });
        
        btnClear.addEventListener('click', () => {
            this.batchFiles = [];
            this.renderBatchFilesTable();
            this.updateBatchRunButtonState();
        });
        
        // Output picker
        document.getElementById('btn-pick-output').addEventListener('click', async () => {
            const dirName = await FileSystemHelper.selectDirectory();
            const display = document.getElementById('display-output-path');
            if (dirName) {
                this.outputFolder = dirName;
                display.innerText = dirName;
                display.classList.remove('zip-active');
                this.logMessage(`Selected output folder: ${dirName}`);
            } else {
                this.outputFolder = '';
                display.innerText = I18n.get('zip_fallback_active');
                display.classList.add('zip-active');
            }
            this.saveSettingsToStorage();
        });
        
        // Run Batch Process Button
        document.getElementById('btn-run-batch').addEventListener('click', () => {
            this.executeBatchProcessing();
        });
    },

    addFilesToList(filesList) {
        let addedCount = 0;
        for (const file of filesList) {
            // Filter image types
            if (file.type.startsWith('image/')) {
                // Avoid duplicates in list
                const isDup = this.batchFiles.some(f => f.name === file.name && f.size === file.size);
                if (!isDup) {
                    this.batchFiles.push(file);
                    addedCount++;
                }
            }
        }
        if (addedCount > 0) {
            this.logMessage(`Added ${addedCount} images to batch list.`);
            this.renderBatchFilesTable();
            this.updateBatchRunButtonState();
        }
    },

    renderBatchFilesTable() {
        const tbody = document.querySelector('#batch-file-table tbody');
        tbody.innerHTML = '';
        
        if (this.batchFiles.length === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="3" class="text-center" data-i18n="no_files">${I18n.get('no_files')}</td></tr>`;
            return;
        }
        
        this.batchFiles.forEach((file, idx) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-index', idx);
            
            if (this.currentLoadedFile && 
                this.currentLoadedFile.name === file.name && 
                this.currentLoadedFile.size === file.size) {
                tr.classList.add('active-file');
            }
            
            // Absolute folder path display logic
            let folder = this.inputDirectoryPath || 'Local';
            const relPath = this.getFileRelativePath(file);
            if (relPath) {
                const relFolder = relPath.substring(0, relPath.lastIndexOf('/'));
                if (this.inputDirectoryPath) {
                    const cleanBase = this.inputDirectoryPath.replace(/\/$/, '').replace(/\\$/, '');
                    folder = `${cleanBase}\\${relFolder.replace(/\//g, '\\')}`;
                } else {
                    folder = relFolder;
                }
            }
                
            tr.innerHTML = `
                <td>
                    <button class="delete-row-btn" data-index="${idx}" title="Delete">
                        <span class="material-icons-round" style="font-size: 16px;">delete</span>
                    </button>
                </td>
                <td class="text-truncate" style="max-width: 180px;" title="${file.name}">${file.name}</td>
                <td class="text-truncate" style="max-width: 100px;" title="${folder}">${folder}</td>
            `;
            
            // Delete click
            tr.querySelector('.delete-row-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.batchFiles.splice(idx, 1);
                this.renderBatchFilesTable();
                this.updateBatchRunButtonState();
            });
            
            // Row click triggers previewing this file
            tr.addEventListener('click', () => {
                this.loadImage(file);
            });
            
            tbody.appendChild(tr);
        });
    },

    updateActiveFileHighlight() {
        document.querySelectorAll('#batch-file-table tbody tr').forEach(tr => {
            const idx = parseInt(tr.getAttribute('data-index'));
            if (!isNaN(idx) && this.batchFiles[idx]) {
                const f = this.batchFiles[idx];
                const isActive = this.currentLoadedFile && 
                                 this.currentLoadedFile.name === f.name && 
                                 this.currentLoadedFile.size === f.size;
                tr.classList.toggle('active-file', !!isActive);
            }
        });
    },

    updateBatchRunButtonState() {
        const btn = document.getElementById('btn-run-batch');
        btn.disabled = this.batchFiles.length === 0;
    },

    logMessage(msg) {
        const term = document.getElementById('log-terminal');
        const timestamp = new Date().toLocaleTimeString();
        term.innerText += `\n[${timestamp}] ${msg}`;
        term.scrollTop = term.scrollHeight;
    },

    // --- BATCH PROCESSING EXECUTION LOOP ---
    async executeBatchProcessing() {
        if (this.batchFiles.length === 0) return;
        
        const total = this.batchFiles.length;
        const progressBox = document.getElementById('batch-progress-box');
        const fill = document.getElementById('batch-progress-fill');
        const txt = document.getElementById('batch-progress-text');
        const runBtn = document.getElementById('btn-run-batch');
        
        // Show progress, disable buttons
        progressBox.classList.remove('hidden');
        runBtn.disabled = true;
        
        const date = new Date();
        const timestamp = date.getFullYear() +
            String(date.getMonth() + 1).padStart(2, '0') +
            String(date.getDate()).padStart(2, '0') + '_' +
            String(date.getHours()).padStart(2, '0') +
            String(date.getMinutes()).padStart(2, '0') +
            String(date.getSeconds()).padStart(2, '0');
            
        this.logMessage(`=========================================`);
        this.logMessage(`Starting batch processing for ${total} images...`);
        this.logMessage(`Conditions: μm/px = ${this.umPerPx.toFixed(3)}, Method = ${this.binarization.method}`);
        
        let batchLogText = `SinterPore-Analyzer Batch Processing Log\n`;
        batchLogText += `Timestamp: ${date.toLocaleString()}\n`;
        batchLogText += `Total files: ${total}\n`;
        batchLogText += `Notes: ${document.getElementById('input-batch-notes').value}\n`;
        batchLogText += `-----------------------------------------\n`;
        batchLogText += `Conditions Summary:\n`;
        batchLogText += `- scale: ${this.umPerPx.toFixed(3)} μm/px\n`;
        batchLogText += `- roi: enabled=${this.roi.enabled}, bounds=(${this.roi.x1},${this.roi.y1}) to (${this.roi.x2},${this.roi.y2})\n`;
        batchLogText += `- fft: enabled=${this.fft.enabled}, highpass=${this.fft.highPassLimit}px, lowpass=${this.fft.lowPassLimit}px\n`;
        batchLogText += `- noise: enabled=${this.noise.enabled}, method=${this.noise.method}, size=${this.noise.kernelSize}\n`;
        batchLogText += `- binarization: channel=${this.binarization.channel}, method=${this.binarization.method}, fixedVal=${this.binarization.fixedValue}, otsu%=${this.binarization.otsuPercent}\n`;
        batchLogText += `- limit: solid=${this.limit.solidPx}px, void=${this.limit.voidPx}px\n`;
        batchLogText += `=========================================\n`;

        const results = [];
        const scaleSq = this.umPerPx * this.umPerPx;
        const solidLimitArea = this.limit.solidPx * scaleSq;
        const voidLimitArea = this.limit.voidPx * scaleSq;
        
        const drawLabels = document.getElementById('chk-batch-labels').checked;
        
        for (let i = 0; i < total; i++) {
            const file = this.batchFiles[i];
            const currentNum = i + 1;
            
            txt.innerText = `${currentNum} / ${total}`;
            fill.style.width = `${(currentNum / total) * 100}%`;
            
            this.logMessage(`[${currentNum}/${total}] Loading: ${file.name}`);
            batchLogText += `\n[${currentNum}/${total}] FILE: ${file.name}\n`;
            
            try {
                // 1. Load image offscreen
                const img = await this.loadImageOffscreen(file);
                const W = img.naturalWidth;
                const H = img.naturalHeight;
                
                // Coordinates clamping
                const rx1 = this.roi.enabled ? Math.min(this.roi.x1, W - 1) : 0;
                const ry1 = this.roi.enabled ? Math.min(this.roi.y1, H - 1) : 0;
                const rx2 = this.roi.enabled ? Math.max(rx1 + 10, Math.min(this.roi.x2, W)) : W;
                const ry2 = this.roi.enabled ? Math.max(ry1 + 10, Math.min(this.roi.y2, H)) : H;
                
                const W_ROI = rx2 - rx1;
                const H_ROI = ry2 - ry1;
                
                // 2. Draw offscreen to get pixels
                const canvas = document.createElement('canvas');
                canvas.width = W_ROI;
                canvas.height = H_ROI;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, rx1, ry1, W_ROI, H_ROI, 0, 0, W_ROI, H_ROI);
                
                const roiImgData = ctx.getImageData(0, 0, W_ROI, H_ROI);
                
                // 3. Grayscale
                let gray = ImageProcessor.toGrayscale(roiImgData, this.binarization.channel);
                
                // 3.5. FFT Bandpass Filter
                if (this.fft.enabled) {
                    gray = ImageProcessor.fftBandpassFilter(gray, W_ROI, H_ROI, this.fft.highPassLimit, this.fft.lowPassLimit);
                }
                
                // 4. Noise Filter
                if (this.noise.enabled && this.noise.method !== 'none') {
                    if (this.noise.method === 'median') {
                        gray = ImageProcessor.medianFilter(gray, W_ROI, H_ROI, this.noise.kernelSize);
                    } else if (this.noise.method === 'gaussian') {
                        gray = ImageProcessor.gaussianBlur(gray, W_ROI, H_ROI, this.noise.kernelSize);
                    }
                }
                
                // 5. Threshold
                let threshVal = this.binarization.fixedValue;
                if (this.binarization.method === 'otsu') {
                    const otsu = ImageProcessor.calculateOtsuThreshold(gray);
                    threshVal = Math.max(0, Math.min(255, Math.round(otsu * this.binarization.otsuPercent / 100)));
                    batchLogText += `  Otsu threshold calculated: ${otsu}, Applied (x${this.binarization.otsuPercent}%): ${threshVal}\n`;
                } else {
                    batchLogText += `  Fixed threshold: ${threshVal}\n`;
                }
                
                // 6. Binarize
                const bin = ImageProcessor.binarize(gray, threshVal);
                
                // 7. Labeling
                const solids = ImageProcessor.labelComponents(bin, W_ROI, H_ROI, 255);
                const voids = ImageProcessor.labelComponents(bin, W_ROI, H_ROI, 0);
                
                // 8. Stats calculations
                const roiPx = W_ROI * H_ROI;
                const roiArea = roiPx * scaleSq;
                
                let solidPxTotal = 0;
                let voidPxTotal = 0;
                let belowLimitSolidPx = 0;
                let belowLimitVoidPx = 0;
                
                const combinedComps = [];
                let localId = 1;
                
                const processBatchComps = (list, isSolid) => {
                    const pxLimit = isSolid ? this.limit.solidPx : this.limit.voidPx;
                    for (const c of list) {
                        solidPxTotal += isSolid ? c.pixels : 0;
                        voidPxTotal += !isSolid ? c.pixels : 0;
                        
                        const isBelow = c.pixels < pxLimit;
                        if (isBelow) {
                            belowLimitSolidPx += isSolid ? c.pixels : 0;
                            belowLimitVoidPx += !isSolid ? c.pixels : 0;
                        }
                        
                        combinedComps.push({
                            id: localId++,
                            type: isSolid ? 'solid' : 'void',
                            pixels: c.pixels,
                            area: c.pixels * scaleSq,
                            diameter: 2 * Math.sqrt((c.pixels * scaleSq) / Math.PI),
                            isBelowLimit: isBelow,
                            boundary: c.boundary,
                            cx: c.cx,
                            cy: c.cy
                        });
                    }
                };
                
                processBatchComps(solids, true);
                processBatchComps(voids, false);
                
                const solidity = solidPxTotal / roiPx;
                const porosity = voidPxTotal / roiPx;
                
                const solidAreaTotal = solidPxTotal * scaleSq;
                const voidAreaTotal = voidPxTotal * scaleSq;
                const subLimitSolidArea = belowLimitSolidPx * scaleSq;
                const subLimitVoidArea = belowLimitVoidPx * scaleSq;
                
                batchLogText += `  ROI Area: ${roiArea.toFixed(3)} μm², Solidity: ${(solidity*100).toFixed(2)}%, Porosity: ${(porosity*100).toFixed(2)}%\n`;
                batchLogText += `  Components detected: Solids=${solids.length} (Below limit=${combinedComps.filter(c => c.type === 'solid' && c.isBelowLimit).length}), Voids=${voids.length} (Below limit=${combinedComps.filter(c => c.type === 'void' && c.isBelowLimit).length})\n`;
                
                // 9. Render Labeled Image
                const labeledBlob = await this.renderLabeledImageBlob(img, rx1, ry1, W_ROI, H_ROI, combinedComps, drawLabels);
                
                const fileRelPath = this.getFileRelativePath(file);
                results.push({
                    timestamp: timestamp,
                    fileName: file.name,
                    folderName: fileRelPath ? fileRelPath.substring(0, fileRelPath.lastIndexOf('/')) : 'Local',
                    roiArea,
                    solidArea: solidAreaTotal,
                    solidity,
                    voidArea: voidAreaTotal,
                    porosity,
                    solidLimitArea,
                    belowLimitSolidArea: subLimitSolidArea,
                    belowLimitSolidRatio: solidAreaTotal > 0 ? (subLimitSolidArea / solidAreaTotal) : 0,
                    voidLimitArea,
                    belowLimitVoidArea: subLimitVoidArea,
                    belowLimitVoidRatio: voidAreaTotal > 0 ? (subLimitVoidArea / voidAreaTotal) : 0,
                    components: combinedComps,
                    imageBlob: labeledBlob
                });
                
            } catch (err) {
                this.logMessage(`Error processing ${file.name}: ${err.message}`);
                batchLogText += `  ERROR: ${err.message}\n`;
            }
        }
        
        batchLogText += `\n=========================================\n`;
        batchLogText += `Batch process completed. Generating report files.\n`;
        this.logMessage(`Saving output files...`);
        
        // Save files
        const conditions = this.generateJSONConfigObject(timestamp);
        
        try {
            if (FileSystemHelper.activeDirectoryHandle) {
                // Direct Folder Write
                await FileSystemHelper.writeToFolder(timestamp, results, conditions, batchLogText);
                this.logMessage(`Saved output files directly to chosen directory.`);
            } else {
                // Fallback ZIP
                await FileSystemHelper.writeToZIP(timestamp, results, conditions, batchLogText);
                this.logMessage(`Saved output ZIP file wrapper.`);
            }
            this.logMessage(`Batch processing completed successfully!`);
            
            // Save run to local history
            this.saveRunToHistory(timestamp);
            
        } catch (err) {
            this.logMessage(`Error writing batch files: ${err.message}`);
            alert(`File write error: ${err.message}`);
        }
        
        // Re-enable run btn
        runBtn.disabled = false;
        progressBox.classList.add('hidden');
    },

    loadImageOffscreen(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(new Error('Image failed to load'));
            img.src = URL.createObjectURL(file);
        });
    },

    renderLabeledImageBlob(img, rx1, ry1, W_ROI, H_ROI, components, drawLabels) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            
            // 1. Draw base image
            ctx.drawImage(img, 0, 0);
            
            // 2. Draw shaded ROI box overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.fillRect(0, 0, canvas.width, ry1);
            ctx.fillRect(0, ry1 + H_ROI, canvas.width, canvas.height - (ry1 + H_ROI));
            ctx.fillRect(0, ry1, rx1, H_ROI);
            ctx.fillRect(rx1 + W_ROI, ry1, canvas.width - (rx1 + W_ROI), H_ROI);
            
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.strokeRect(rx1, ry1, W_ROI, H_ROI);
            
            // 3. Draw boundary pixels inside ROI
            const boundaryCanvas = document.createElement('canvas');
            boundaryCanvas.width = W_ROI;
            boundaryCanvas.height = H_ROI;
            const bCtx = boundaryCanvas.getContext('2d');
            const imgData = bCtx.createImageData(W_ROI, H_ROI);
            const data = imgData.data;
            
            // Color codes (RGBA)
            const colors = {
                solidNormal: [59, 130, 246, 210],    // Blue
                solidBelow:  [249, 115, 22, 210],    // Orange
                voidNormal:  [6, 182, 212, 210],     // Cyan
                voidBelow:   [239, 68, 68, 210]      // Red
            };
            
            for (const c of components) {
                const color = c.type === 'solid' 
                    ? (c.isBelowLimit ? colors.solidBelow : colors.solidNormal)
                    : (c.isBelowLimit ? colors.voidBelow : colors.voidNormal);
                    
                const r = color[0], g = color[1], b = color[2], a = color[3];
                const boundary = c.boundary;
                const len = boundary.length;
                for (let j = 0; j < len; j += 2) {
                    const bx = boundary[j];
                    const by = boundary[j + 1];
                    const idx = (by * W_ROI + bx) * 4;
                    data[idx] = r;
                    data[idx+1] = g;
                    data[idx+2] = b;
                    data[idx+3] = a;
                }
            }
            bCtx.putImageData(imgData, 0, 0);
            ctx.drawImage(boundaryCanvas, rx1, ry1);
            
            // 4. Draw label numbers if checked
            if (drawLabels) {
                ctx.font = 'bold 11px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                for (const c of components) {
                    if (c.isBelowLimit && c.pixels < 10) continue; // skip tiny clutter labels
                    const lx = rx1 + c.cx;
                    const ly = ry1 + c.cy;
                    
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 2;
                    ctx.strokeText(c.id, lx, ly);
                    
                    ctx.fillStyle = c.type === 'solid' ? '#60a5fa' : '#c084fc';
                    ctx.fillText(c.id, lx, ly);
                }
            }
            
            canvas.toBlob(resolve, 'image/jpeg', 0.9);
        });
    },

    // --- BATCH RUN HISTORY MANAGER ---
    saveRunToHistory(timestamp) {
        const historyJson = localStorage.getItem('sinterpore_history');
        let history = [];
        if (historyJson) {
            try {
                history = JSON.parse(historyJson);
            } catch(e) {}
        }
        
        // Add new run conditions
        const runConditions = this.generateJSONConfigObject(timestamp);
        history.unshift({
            timestamp: new Date().toLocaleString(),
            name: timestamp,
            config: runConditions
        });
        
        // Limit history to last 50 items
        if (history.length > 50) history.pop();
        
        localStorage.setItem('sinterpore_history', JSON.stringify(history));
        this.renderHistoryTable();
    },

    renderHistoryTable() {
        const tbody = document.querySelector('#history-table tbody');
        tbody.innerHTML = '';
        
        const historyJson = localStorage.getItem('sinterpore_history');
        if (!historyJson) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="3" class="text-center" data-i18n="no_history">${I18n.get('no_history')}</td></tr>`;
            return;
        }
        
        let history = [];
        try {
            history = JSON.parse(historyJson);
        } catch(e) {}
        
        if (history.length === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="3" class="text-center" data-i18n="no_history">${I18n.get('no_history')}</td></tr>`;
            return;
        }
        
        history.forEach((run, idx) => {
            const tr = document.createElement('tr');
            if (this.activeHistoryIndex === idx) {
                tr.classList.add('selected');
            }
            tr.innerHTML = `
                <td>${run.timestamp}</td>
                <td class="text-truncate" style="max-width: 140px;" title="${run.name}">${run.name}</td>
                <td>
                    <button class="apply-measure-btn" data-index="${idx}">${I18n.get('btn_apply')}</button>
                </td>
            `;
            
            tr.querySelector('.apply-measure-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.activeHistoryIndex = idx;
                this.applyJSONConfig(run.config, true);
                this.logMessage(`Applied settings from history: ${run.name}`);
                this.renderHistoryTable();
            });
            
            tr.addEventListener('click', () => {
                this.activeHistoryIndex = idx;
                this.applyJSONConfig(run.config, true);
                this.logMessage(`Applied settings from history: ${run.name}`);
                this.renderHistoryTable();
            });
            
            tbody.appendChild(tr);
        });
    }
};

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
