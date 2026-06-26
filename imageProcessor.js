/**
 * SinterPore-Analyzer Image Processing Module
 * Includes:
 * - Grayscale Conversion (Luminance, R, G, B channels)
 * - Median Filter (3x3, 5x5, 7x7)
 * - Gaussian Blur (3x3, 5x5)
 * - Otsu's Thresholding (and Otsu * percentage)
 * - Connected Component Labeling (8-connectivity BFS) and Boundary extraction
 */

const ImageProcessor = {
    /**
     * Convert RGBA image data to a Grayscale Uint8Array
     * @param {ImageData} imageData 
     * @param {string} channel 'luminance' | 'red' | 'green' | 'blue'
     * @returns {Uint8Array}
     */
    toGrayscale(imageData, channel = 'luminance') {
        const data = imageData.data;
        const len = data.length;
        const gray = new Uint8Array(len / 4);
        
        if (channel === 'red') {
            for (let i = 0, j = 0; i < len; i += 4, j++) {
                gray[j] = data[i];
            }
        } else if (channel === 'green') {
            for (let i = 0, j = 0; i < len; i += 4, j++) {
                gray[j] = data[i + 1];
            }
        } else if (channel === 'blue') {
            for (let i = 0, j = 0; i < len; i += 4, j++) {
                gray[j] = data[i + 2];
            }
        } else { // luminance (ITU-R BT.601)
            for (let i = 0, j = 0; i < len; i += 4, j++) {
                gray[j] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            }
        }
        return gray;
    },

    /**
     * Apply Median Filter to a grayscale array
     * @param {Uint8Array} src 
     * @param {number} W 
     * @param {number} H 
     * @param {number} kSize 3 | 5 | 7
     * @returns {Uint8Array}
     */
    medianFilter(src, W, H, kSize = 3) {
        const dst = new Uint8Array(W * H);
        const radius = Math.floor(kSize / 2);
        const bufferSize = kSize * kSize;
        const window = new Uint8Array(bufferSize);
        
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                let count = 0;
                
                // Gather neighbors
                for (let ky = -radius; ky <= radius; ky++) {
                    const ny = Math.max(0, Math.min(H - 1, y + ky));
                    const rowOffset = ny * W;
                    for (let kx = -radius; kx <= radius; kx++) {
                        const nx = Math.max(0, Math.min(W - 1, x + kx));
                        window[count++] = src[rowOffset + nx];
                    }
                }
                
                // Sort window using standard insertion sort (highly optimized for small arrays)
                for (let i = 1; i < count; i++) {
                    const key = window[i];
                    let j = i - 1;
                    while (j >= 0 && window[j] > key) {
                        window[j + 1] = window[j];
                        j--;
                    }
                    window[j + 1] = key;
                }
                
                dst[y * W + x] = window[Math.floor(count / 2)];
            }
        }
        return dst;
    },

    /**
     * Apply Gaussian Blur to a grayscale array
     * @param {Uint8Array} src 
     * @param {number} W 
     * @param {number} H 
     * @param {number} kSize 3 | 5
     * @returns {Uint8Array}
     */
    gaussianBlur(src, W, H, kSize = 3) {
        const dst = new Uint8Array(W * H);
        const radius = Math.floor(kSize / 2);
        
        let kernel, weightSum;
        if (kSize === 3) {
            // Standard integer approximations
            kernel = [
                1, 2, 1,
                2, 4, 2,
                1, 2, 1
            ];
            weightSum = 16;
        } else { // 5x5
            kernel = [
                1,  4,  7,  4, 1,
                4, 16, 26, 16, 4,
                7, 26, 41, 26, 7,
                4, 16, 26, 16, 4,
                1,  4,  7,  4, 1
            ];
            weightSum = 273;
        }
        
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                let sum = 0;
                let kIdx = 0;
                
                for (let ky = -radius; ky <= radius; ky++) {
                    const ny = Math.max(0, Math.min(H - 1, y + ky));
                    const rowOffset = ny * W;
                    for (let kx = -radius; kx <= radius; kx++) {
                        const nx = Math.max(0, Math.min(W - 1, x + kx));
                        sum += src[rowOffset + nx] * kernel[kIdx++];
                    }
                }
                dst[y * W + x] = Math.round(sum / weightSum);
            }
        }
        return dst;
    },

    /**
     * Calculate Otsu's threshold value
     * @param {Uint8Array} src 
     * @returns {number} threshold value between 0 and 255
     */
    calculateOtsuThreshold(src) {
        const len = src.length;
        const hist = new Int32Array(256);
        
        // Build histogram
        for (let i = 0; i < len; i++) {
            hist[src[i]]++;
        }
        
        let total = len;
        let sum = 0;
        for (let t = 0; t < 256; t++) {
            sum += t * hist[t];
        }
        
        let sumB = 0;
        let wB = 0;
        let wF = 0;
        
        let varMax = 0;
        let threshold = 128; // Default fallback
        
        for (let t = 0; t < 256; t++) {
            wB += hist[t];               // Weight Background
            if (wB === 0) continue;
            
            wF = total - wB;             // Weight Foreground
            if (wF === 0) break;
            
            sumB += t * hist[t];
            
            const mB = sumB / wB;            // Mean Background
            const mF = (sum - sumB) / wF;    // Mean Foreground
            
            // Calculate Between Class Variance
            const varBetween = wB * wF * (mB - mF) * (mB - mF);
            
            if (varBetween > varMax) {
                varMax = varBetween;
                threshold = t;
            }
        }
        return threshold;
    },

    /**
     * Binarize grayscale array
     * @param {Uint8Array} src 
     * @param {number} threshold 
     * @returns {Uint8Array} 0 or 255
     */
    binarize(src, threshold) {
        const len = src.length;
        const dst = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            dst[i] = src[i] >= threshold ? 255 : 0;
        }
        return dst;
    },

    /**
     * Filter noise from binary array by inverting components smaller than limits
     * @param {Uint8Array} binary 
     * @param {number} W 
     * @param {number} H 
     * @param {number} whiteLimitPx 
     * @param {number} blackLimitPx 
     * @returns {Uint8Array}
     */
    filterBinaryNoise(binary, W, H, whiteLimitPx, blackLimitPx) {
        const dst = new Uint8Array(binary);
        const visited = new Uint8Array(W * H);
        const queue = new Int32Array(W * H);
        
        // 8-neighbor offsets
        const dx8 = [-1,  0,  1, -1, 1, -1, 0, 1];
        const dy8 = [-1, -1, -1,  0, 0,  1, 1, 1];
        
        // 1. Filter white noise (255 -> 0 if pixels < whiteLimitPx)
        if (whiteLimitPx > 0) {
            for (let y = 0; y < H; y++) {
                const yOffset = y * W;
                for (let x = 0; x < W; x++) {
                    const startIdx = yOffset + x;
                    if (dst[startIdx] === 255 && visited[startIdx] === 0) {
                        let head = 0;
                        let tail = 0;
                        queue[tail++] = startIdx;
                        visited[startIdx] = 1;
                        
                        while (head < tail) {
                            const currIdx = queue[head++];
                            const cx = currIdx % W;
                            const cy = Math.floor(currIdx / W);
                            
                            for (let n = 0; n < 8; n++) {
                                const nx = cx + dx8[n];
                                const ny = cy + dy8[n];
                                if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                                    const nIdx = ny * W + nx;
                                    if (visited[nIdx] === 0 && dst[nIdx] === 255) {
                                        visited[nIdx] = 1;
                                        queue[tail++] = nIdx;
                                    }
                                }
                            }
                        }
                        
                        if (tail < whiteLimitPx) {
                            for (let i = 0; i < tail; i++) {
                                dst[queue[i]] = 0;
                            }
                        }
                    }
                }
            }
        }
        
        // Reset visited buffer
        visited.fill(0);
        
        // 2. Filter black noise (0 -> 255 if pixels < blackLimitPx)
        if (blackLimitPx > 0) {
            for (let y = 0; y < H; y++) {
                const yOffset = y * W;
                for (let x = 0; x < W; x++) {
                    const startIdx = yOffset + x;
                    if (dst[startIdx] === 0 && visited[startIdx] === 0) {
                        let head = 0;
                        let tail = 0;
                        queue[tail++] = startIdx;
                        visited[startIdx] = 1;
                        
                        while (head < tail) {
                            const currIdx = queue[head++];
                            const cx = currIdx % W;
                            const cy = Math.floor(currIdx / W);
                            
                            for (let n = 0; n < 8; n++) {
                                const nx = cx + dx8[n];
                                const ny = cy + dy8[n];
                                if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                                    const nIdx = ny * W + nx;
                                    if (visited[nIdx] === 0 && dst[nIdx] === 0) {
                                        visited[nIdx] = 1;
                                        queue[tail++] = nIdx;
                                    }
                                }
                            }
                        }
                        
                        if (tail < blackLimitPx) {
                            for (let i = 0; i < tail; i++) {
                                dst[queue[i]] = 255;
                            }
                        }
                    }
                }
            }
        }
        
        return dst;
    },

    /**
     * Connected Component Labeling using 8-connectivity BFS.
     * Extracts boundaries and geometrical features.
     * @param {Uint8Array} binary 
     * @param {number} W 
     * @param {number} H 
     * @param {number} target 0 (void) | 255 (solid)
     * @returns {Array<Object>} list of components
     */
    labelComponents(binary, W, H, target) {
        const visited = new Uint8Array(W * H);
        const components = [];
        let labelCounter = 1;
        
        // Pre-allocated flat queue for BFS to avoid GC overhead
        const queue = new Int32Array(W * H);
        
        // 8-neighbor offsets
        const dx8 = [-1,  0,  1, -1, 1, -1, 0, 1];
        const dy8 = [-1, -1, -1,  0, 0,  1, 1, 1];
        
        for (let y = 0; y < H; y++) {
            const yOffset = y * W;
            for (let x = 0; x < W; x++) {
                const startIdx = yOffset + x;
                
                if (visited[startIdx] === 0 && binary[startIdx] === target) {
                    // Start BFS
                    let head = 0;
                    let tail = 0;
                    
                    queue[tail++] = startIdx;
                    visited[startIdx] = 1;
                    
                    let pixelsCount = 0;
                    let xmin = x, xmax = x, ymin = y, ymax = y;
                    let sumX = 0, sumY = 0;
                    const boundaryCoords = []; // flat array of [x, y, x, y...]
                    
                    while (head < tail) {
                        const currIdx = queue[head++];
                        const cx = currIdx % W;
                        const cy = Math.floor(currIdx / W);
                        
                        pixelsCount++;
                        sumX += cx;
                        sumY += cy;
                        
                        if (cx < xmin) xmin = cx;
                        if (cx > xmax) xmax = cx;
                        if (cy < ymin) ymin = cy;
                        if (cy > ymax) ymax = cy;
                        
                        // Check if boundary pixel: bordering opposite color or ROI edges
                        let isBoundary = false;
                        if (cx === 0 || cx === W - 1 || cy === 0 || cy === H - 1) {
                            isBoundary = true;
                        } else {
                            if (binary[currIdx - 1] !== target ||
                                binary[currIdx + 1] !== target ||
                                binary[currIdx - W] !== target ||
                                binary[currIdx + W] !== target) {
                                isBoundary = true;
                            }
                        }
                        
                        if (isBoundary) {
                            boundaryCoords.push(cx, cy);
                        }
                        
                        // Visit 8 neighbors
                        for (let n = 0; n < 8; n++) {
                            const nx = cx + dx8[n];
                            const ny = cy + dy8[n];
                            
                            if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                                const nIdx = ny * W + nx;
                                if (visited[nIdx] === 0 && binary[nIdx] === target) {
                                    visited[nIdx] = 1;
                                    queue[tail++] = nIdx;
                                }
                            }
                        }
                    }
                    
                    components.push({
                        id: labelCounter++,
                        type: target === 255 ? 'solid' : 'void',
                        pixels: pixelsCount,
                        xmin,
                        xmax,
                        ymin,
                        ymax,
                        cx: sumX / pixelsCount,
                        cy: sumY / pixelsCount,
                        // Convert boundary list to TypedArray for performance
                        boundary: new Int32Array(boundaryCoords)
                    });
                }
            }
        }
        
        return components;
    },

    /**
     * Apply 2D FFT Bandpass Filter to a grayscale array
     * @param {Uint8Array} src 
     * @param {number} W 
     * @param {number} H 
     * @param {number} lowCutoff (High-pass limit: cuts off frequencies below this radius)
     * @param {number} highCutoff (Low-pass limit: cuts off frequencies above this radius)
     * @returns {Uint8Array}
     */
    fftBandpassFilter(src, W, H, lowCutoff, highCutoff) {
        const getNextPowerOf2 = (n) => {
            let p = 1;
            while (p < n) p <<= 1;
            return p;
        };
        const W_pad = getNextPowerOf2(W);
        const H_pad = getNextPowerOf2(H);
        
        const size = W_pad * H_pad;
        const re = new Float32Array(size);
        const im = new Float32Array(size);
        
        for (let y = 0; y < H_pad; y++) {
            const srcY = Math.min(y, H - 1);
            const rowOffsetSrc = srcY * W;
            const rowOffsetDst = y * W_pad;
            for (let x = 0; x < W_pad; x++) {
                const srcX = Math.min(x, W - 1);
                re[rowOffsetDst + x] = src[rowOffsetSrc + srcX];
            }
        }
        
        // Row-wise FFT
        const rowRe = new Float32Array(W_pad);
        const rowIm = new Float32Array(W_pad);
        for (let y = 0; y < H_pad; y++) {
            const offset = y * W_pad;
            for (let x = 0; x < W_pad; x++) {
                rowRe[x] = re[offset + x];
                rowIm[x] = 0;
            }
            this.fft1d(rowRe, rowIm, 1);
            for (let x = 0; x < W_pad; x++) {
                re[offset + x] = rowRe[x];
                im[offset + x] = rowIm[x];
            }
        }
        
        // Column-wise FFT
        const colRe = new Float32Array(H_pad);
        const colIm = new Float32Array(H_pad);
        for (let x = 0; x < W_pad; x++) {
            for (let y = 0; y < H_pad; y++) {
                colRe[y] = re[y * W_pad + x];
                colIm[y] = im[y * W_pad + x];
            }
            this.fft1d(colRe, colIm, 1);
            for (let y = 0; y < H_pad; y++) {
                re[y * W_pad + x] = colRe[y];
                im[y * W_pad + x] = colIm[y];
            }
        }
        
        const cx = W_pad / 2;
        const cy = H_pad / 2;
        
        for (let y = 0; y < H_pad; y++) {
            const v = y < cy ? y : y - H_pad;
            const rowOffset = y * W_pad;
            for (let x = 0; x < W_pad; x++) {
                const u = x < cx ? x : x - W_pad;
                const dist = Math.sqrt(u * u + v * v);
                if (dist < lowCutoff || dist > highCutoff) {
                    re[rowOffset + x] = 0;
                    im[rowOffset + x] = 0;
                }
            }
        }
        
        // Column-wise IFFT
        for (let x = 0; x < W_pad; x++) {
            for (let y = 0; y < H_pad; y++) {
                colRe[y] = re[y * W_pad + x];
                colIm[y] = im[y * W_pad + x];
            }
            this.fft1d(colRe, colIm, -1);
            for (let y = 0; y < H_pad; y++) {
                re[y * W_pad + x] = colRe[y];
                im[y * W_pad + x] = colIm[y];
            }
        }
        
        // Row-wise IFFT
        for (let y = 0; y < H_pad; y++) {
            const offset = y * W_pad;
            for (let x = 0; x < W_pad; x++) {
                rowRe[x] = re[offset + x];
                rowIm[x] = im[offset + x];
            }
            this.fft1d(rowRe, rowIm, -1);
            for (let x = 0; x < W_pad; x++) {
                re[offset + x] = rowRe[x];
            }
        }
        
        const dst = new Uint8Array(W * H);
        for (let y = 0; y < H; y++) {
            const srcOffset = y * W_pad;
            const dstOffset = y * W;
            for (let x = 0; x < W; x++) {
                const val = re[srcOffset + x];
                dst[dstOffset + x] = Math.max(0, Math.min(255, val));
            }
        }
        return dst;
    },
    
    // Cooley-Tukey 1D FFT helper
    fft1d(re, im, direction) {
        const n = re.length;
        if (n <= 1) return;
        
        // Bit reversal
        for (let i = 0, j = 0; i < n; i++) {
            if (i < j) {
                let temp = re[i]; re[i] = re[j]; re[j] = temp;
                temp = im[i]; im[i] = im[j]; im[j] = temp;
            }
            let bit = n >> 1;
            while (bit & j) {
                j ^= bit;
                bit >>= 1;
            }
            j ^= bit;
        }
        
        // Butterflies
        for (let len = 2; len <= n; len <<= 1) {
            const angle = (2 * Math.PI / len) * direction;
            const wlen_re = Math.cos(angle);
            const wlen_im = Math.sin(angle);
            for (let i = 0; i < n; i += len) {
                let w_re = 1.0;
                let w_im = 0.0;
                const half = len >> 1;
                for (let j = 0; j < half; j++) {
                    const u_idx = i + j;
                    const v_idx = i + j + half;
                    const u_re = re[u_idx];
                    const u_im = im[u_idx];
                    
                    const t_re = re[v_idx] * w_re - im[v_idx] * w_im;
                    const t_im = re[v_idx] * w_im + im[v_idx] * w_re;
                    re[u_idx] = u_re + t_re;
                    im[u_idx] = u_im + t_im;
                    re[v_idx] = u_re - t_re;
                    im[v_idx] = u_im - t_im;
                    
                    const next_w_re = w_re * wlen_re - w_im * wlen_im;
                    w_im = w_re * wlen_im + w_im * wlen_re;
                    w_re = next_w_re;
                }
            }
        }
        
        if (direction === -1) {
            for (let i = 0; i < n; i++) {
                re[i] /= n;
                im[i] /= n;
            }
        }
    }
};
