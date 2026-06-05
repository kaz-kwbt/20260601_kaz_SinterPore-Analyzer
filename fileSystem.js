/**
 * SinterPore-Analyzer File System Module
 * Handles:
 * - File System Access API (showDirectoryPicker) for direct folder writing
 * - Fallback JSZip exporter for browsers without showDirectoryPicker
 * - CSV generation from data arrays
 * - Settings JSON import / export
 */

const FileSystemHelper = {
    activeDirectoryHandle: null,

    /**
     * Request user to select a folder
     * @returns {Promise<string|null>} Selected directory name or null
     */
    async selectDirectory() {
        if (!window.showDirectoryPicker) {
            alert('File System Access API is not supported in this browser. The app will export results as a ZIP file download instead.');
            return null;
        }
        try {
            const handle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });
            this.activeDirectoryHandle = handle;
            return handle.name;
        } catch (e) {
            console.warn('Directory selection cancelled or failed:', e);
            return null;
        }
    },

    /**
     * Check if directory picker is supported
     */
    isSupported() {
        return !!window.showDirectoryPicker;
    },

    /**
     * Escape value for CSV formatting
     */
    escapeCSV(val) {
        if (val === undefined || val === null) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    },

    /**
     * Convert array of arrays to CSV string
     * @param {Array<Array>} rows 
     * @returns {string}
     */
    generateCSV(rows) {
        // Add BOM (Byte Order Mark) for Excel compatibility with UTF-8
        return '\uFEFF' + rows.map(r => r.map(this.escapeCSV).join(',')).join('\n');
    },

    /**
     * Write batch results to direct folder using File System Access API
     */
    async writeToFolder(timestamp, results, conditions, logText) {
        if (!this.activeDirectoryHandle) {
            throw new Error('No folder selected');
        }

        // Create yyyymmdd_hhmmss sub-directory
        const subDirHandle = await this.activeDirectoryHandle.getDirectoryHandle(timestamp, { create: true });

        // 1. Write Detailed CSV: timestamp_labels.csv
        const labelsCSV = this.generateLabelsCSV(results);
        await this.writeFile(subDirHandle, `${timestamp}_labels.csv`, labelsCSV);

        // 2. Write Statistical CSV: timestamp_stats.csv
        const statsCSV = this.generateStatsCSV(results, conditions);
        await this.writeFile(subDirHandle, `${timestamp}_stats.csv`, statsCSV);

        // 3. Write Processing Conditions JSON
        const conditionsJSON = JSON.stringify(conditions, null, 2);
        const conditionFileName = `${timestamp}_conditions.json`;
        await this.writeFile(subDirHandle, conditionFileName, conditionsJSON);

        // 4. Write Log TXT
        await this.writeFile(subDirHandle, `${timestamp}_log.txt`, logText);

        // 5. Write Labeled Images
        const nameCount = {};
        for (const res of results) {
            if (!res.imageBlob) continue;
            
            // Handle filename duplicate collision
            const originalName = res.fileName;
            const extIdx = originalName.lastIndexOf('.');
            const baseName = extIdx !== -1 ? originalName.slice(0, extIdx) : originalName;
            const ext = extIdx !== -1 ? originalName.slice(extIdx) : '.jpg';
            
            let saveName = `${timestamp}_labeled_${baseName}${ext}`;
            if (nameCount[saveName] !== undefined) {
                nameCount[saveName]++;
                saveName = `${timestamp}_labeled_${baseName}-${String(nameCount[saveName]).padStart(3, '0')}${ext}`;
            } else {
                nameCount[saveName] = 0;
            }

            await this.writeFile(subDirHandle, saveName, res.imageBlob);
        }
    },

    /**
     * Export all results in a ZIP file using JSZip
     */
    async writeToZIP(timestamp, results, conditions, logText) {
        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip library is not loaded');
        }
        
        const zip = new JSZip();
        // Create yyyymmdd_hhmmss sub-directory inside ZIP
        const folder = zip.folder(timestamp);

        // 1. Detailed CSV
        const labelsCSV = this.generateLabelsCSV(results);
        folder.file(`${timestamp}_labels.csv`, labelsCSV);

        // 2. Statistical CSV
        const statsCSV = this.generateStatsCSV(results, conditions);
        folder.file(`${timestamp}_stats.csv`, statsCSV);

        // 3. Conditions JSON
        const conditionsJSON = JSON.stringify(conditions, null, 2);
        folder.file(`${timestamp}_conditions.json`, conditionsJSON);

        // 4. Log TXT
        folder.file(`${timestamp}_log.txt`, logText);

        // 5. Labeled Images
        const nameCount = {};
        for (const res of results) {
            if (!res.imageBlob) continue;
            const originalName = res.fileName;
            const extIdx = originalName.lastIndexOf('.');
            const baseName = extIdx !== -1 ? originalName.slice(0, extIdx) : originalName;
            const ext = extIdx !== -1 ? originalName.slice(extIdx) : '.jpg';
            
            let saveName = `${timestamp}_labeled_${baseName}${ext}`;
            if (nameCount[saveName] !== undefined) {
                nameCount[saveName]++;
                saveName = `${timestamp}_labeled_${baseName}-${String(nameCount[saveName]).padStart(3, '0')}${ext}`;
            } else {
                nameCount[saveName] = 0;
            }
            folder.file(saveName, res.imageBlob);
        }

        // Generate and download ZIP
        const contentBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(contentBlob);
        link.download = `Outputs_${timestamp}.zip`;
        link.click();
        
        // Clean up object URL
        setTimeout(() => URL.revokeObjectURL(link.href), 10000);
    },

    /**
     * Internal helper to write a file to a DirectoryHandle
     */
    async writeFile(dirHandle, fileName, content) {
        const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
    },

    /**
     * Generate rows for labels CSV (detailed CSV)
     */
    generateLabelsCSV(results) {
        const headers = ['ファイル名', 'フォルダ名', 'ラベル', '種類', '下限判定', 'ピクセル数/px', '面積/μm2', '円相当径/μm'];
        const rows = [headers];

        for (const r of results) {
            if (!r.components) continue;
            for (const comp of r.components) {
                rows.push([
                    r.fileName,
                    r.folderName,
                    comp.id,
                    comp.type === 'solid' ? '実体' : '空隙',
                    comp.isBelowLimit ? '以下' : '以上',
                    comp.pixels,
                    comp.area.toFixed(3),
                    comp.diameter.toFixed(3)
                ]);
            }
        }
        return this.generateCSV(rows);
    },

    /**
     * Generate rows for statistics CSV
     */
    generateStatsCSV(results, conditions) {
        const headers = [
            'ファイル名', 'フォルダ名', 'ラベル画像名', 
            'ROI面積/μm2', '実体面積/μm2', '充填率/%', '空隙面積/μm2', '空隙率/%', 
            '実体下限面積/μm2', '下限以下実体面積/μm2', '下限以下実体面積率/%', 
            '空隙下限面積/μm2', '下限以下空隙面積/μm2', '下限以下空隙面積率/%'
        ];
        const rows = [headers];

        const nameCount = {};
        for (const r of results) {
            // Replicate duplicate-naming logic to report labeled image name in CSV
            const originalName = r.fileName;
            const extIdx = originalName.lastIndexOf('.');
            const baseName = extIdx !== -1 ? originalName.slice(0, extIdx) : originalName;
            const ext = extIdx !== -1 ? originalName.slice(extIdx) : '.jpg';
            
            let labelImageName = `${r.timestamp}_labeled_${baseName}${ext}`;
            if (nameCount[labelImageName] !== undefined) {
                nameCount[labelImageName]++;
                labelImageName = `${r.timestamp}_labeled_${baseName}-${String(nameCount[labelImageName]).padStart(3, '0')}${ext}`;
            } else {
                nameCount[labelImageName] = 0;
            }

            rows.push([
                r.fileName,
                r.folderName,
                labelImageName,
                r.roiArea.toFixed(3),
                r.solidArea.toFixed(3),
                (r.solidity * 100).toFixed(3),
                r.voidArea.toFixed(3),
                (r.porosity * 100).toFixed(3),
                r.solidLimitArea.toFixed(3),
                r.belowLimitSolidArea.toFixed(3),
                (r.belowLimitSolidRatio * 100).toFixed(3),
                r.voidLimitArea.toFixed(3),
                r.belowLimitVoidArea.toFixed(3),
                (r.belowLimitVoidRatio * 100).toFixed(3)
            ]);
        }
        return this.generateCSV(rows);
    },

    /**
     * Save settings config using showSaveFilePicker if available
     */
    async saveSettingsAsFile(config) {
        if (!window.showSaveFilePicker) {
            this.downloadJSON(`${config.name || 'settings'}_conditions.json`, config);
            return;
        }
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: `${config.name || 'settings'}_conditions.json`,
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] }
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(JSON.stringify(config, null, 2));
            await writable.close();
            return handle.name;
        } catch (e) {
            console.warn('Save file picker cancelled or failed:', e);
            return null;
        }
    },

    /**
     * Direct browser file download helper for settings JSON
     */
    downloadJSON(filename, obj) {
        const content = JSON.stringify(obj, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 10000);
    }
};
