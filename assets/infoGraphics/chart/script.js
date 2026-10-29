/**
 * Component Chunk 1: Environment Architecture & Datasets
 */
(function () {
    if (typeof Chart === 'undefined') {
        const container = document.getElementById('chartContainer') || document.body;
        container.innerHTML = `
            <div style="padding:20px; text-align:center; font-family:sans-serif; color:#333;">
                <h3>Chart Engine Load Error</h3>
                <p>Core runtime library missing. Check your <code>chart.umd.min.js</code> link.</p>
            </div>`;
        return;
    }

    const ctx = document.getElementById('engineeringMatrixChart').getContext('2d');
    let activeSliceKey = null;

    // Structural absolute alignment path sequence
    const allLabels = [
        'Automation', 'AI / ML', 'System Engineering',
        'Data Science', 'Data Analytics', 'Financial Engg.',
        'Mechanical Design', 'DFM', 'Reverse Engineering',
        'Mechatronics', 'Robotics + IoT', 'Simulation (CFD)',
        'Aerospace Engg.', 'Orbital Mechanics', 'Aerodynamics'
    ];

    // DYNAMIC: Fully accounts for all 5 macro parent fields natively
    const macroLabels = ['Automation', 'Data Science', 'Mechanical Design', 'Mechatronics', 'Aerospace Engg.'];

    const database = {
        'Mechatronics':        { exp: 4.2, skill: 4.0, prod: 4.3 },
        'Robotics + IoT':      { exp: 4.1, skill: 3.9, prod: 4.4 },
        'Simulation (CFD)':    { exp: 3.8, skill: 3.5, prod: 4.0 },
        'Automation':          { exp: 3.9, skill: 4.1, prod: 4.7 },
        'AI / ML':             { exp: 4.7, skill: 4.5, prod: 4.6 },
        'System Engineering':  { exp: 4.3, skill: 4.0, prod: 4.5 },
        'Data Science':        { exp: 4.2, skill: 4.0, prod: 4.5 },
        'Data Analytics':      { exp: 4.5, skill: 4.2, prod: 4.8 },
        'Financial Engg.':     { exp: 3.0, skill: 2.8, prod: 3.5 },
        'Mechanical Design':   { exp: 4.5, skill: 4.2, prod: 4.3 },
        'DFM':                 { exp: 3.7, skill: 3.5, prod: 4.0 },
        'Reverse Engineering': { exp: 3.8, skill: 4.0, prod: 4.2 },
        'Aerospace Engg.':     { exp: 4.0, skill: 3.8, prod: 4.2 },
        'Orbital Mechanics':   { exp: 4.5, skill: 4.1, prod: 4.6 },
        'Aerodynamics':        { exp: 3.9, skill: 3.7, prod: 4.4 }
    };

    let currentAngles = new Array(allLabels.length);
    let targetAngles = new Array(allLabels.length);
    let labelOpacities = new Array(allLabels.length).fill(0); 
    let animationFrameId = null;

    allLabels.forEach((_, i) => {
        let defaultAngle = (i * (2 * Math.PI)) / allLabels.length - (Math.PI / 2);
        currentAngles[i] = defaultAngle;
        targetAngles[i] = defaultAngle;
    });

    function generateDataArray(datasetKey) {
        return allLabels.map(label => {
            return macroLabels.includes(label) ? database[label][datasetKey] : NaN; 
        });
    }
    /**
     * Component Chunk 2: Dataset Styling & Animation Core Engine
     */
    const datasets = [
        {
            label: 'Experience',
            data: generateDataArray('exp'),
            backgroundColor: 'rgba(50, 50, 50, 0.04)',
            borderColor: '#333333',
            borderWidth: 2.5,
            pointBackgroundColor: '#333333',
            spanGaps: true,
            pointRadius: (ctx) => !isNaN(ctx.dataset.data[ctx.dataIndex]) ? 4 : 0
        },
        {
            label: 'Skill Level',
            data: generateDataArray('skill'),
            backgroundColor: 'rgba(120, 120, 120, 0.06)',
            borderColor: '#777777',
            borderWidth: 1.5,
            pointBackgroundColor: '#777777',
            spanGaps: true,
            pointRadius: (ctx) => !isNaN(ctx.dataset.data[ctx.dataIndex]) ? 4 : 0
        },
        {
            label: 'Productivity Score',
            data: generateDataArray('prod'),
            backgroundColor: 'rgba(200, 200, 200, 0.08)',
            borderColor: '#b8b8b8',
            borderWidth: 1.5,
            borderDash:[5,5],
            pointBackgroundColor: '#b8b8b8',
            spanGaps: true,
            pointRadius: (ctx) => !isNaN(ctx.dataset.data[ctx.dataIndex]) ? 4 : 0
        }
    ];

    function animateAngles(chart) {
        let dynamicChangeMade = false;
        const easeFactor = 0.12;

        for (let i = 0; i < currentAngles.length; i++) {
            let delta = targetAngles[i] - currentAngles[i];
            delta = Math.atan2(Math.sin(delta), Math.cos(delta)); 

            if (Math.abs(delta) > 0.001) {
                currentAngles[i] += delta * easeFactor;
                dynamicChangeMade = true;
            } else {
                currentAngles[i] = targetAngles[i];
            }

            let targetOpacity = (activeSliceKey && activeSliceKey.split('-').includes(allLabels[i])) ? 1 : 0;
            if (Math.abs(labelOpacities[i] - targetOpacity) > 0.01) {
                labelOpacities[i] += (targetOpacity - labelOpacities[i]) * easeFactor;
                dynamicChangeMade = true;
            } else {
                labelOpacities[i] = targetOpacity;
            }
        }

        if (dynamicChangeMade) {
            chart.update('none'); 
            animationFrameId = requestAnimationFrame(() => animateAngles(chart));
        } else {
            animationFrameId = null;
        }
    }

    const chartOptions = {
        responsive: true,
        animation: { duration: 400, easing: 'easeOutQuad' },
        plugins: {
            legend: { position: 'bottom', labels: { color: '#333', font: { weight: '500' } } }
        },
        scales: {
            r: {
                min: 2.0, max: 5.0,
                grid: { color: '#e5e5e5', circular: true },
                angleLines: {
                    color: (ctx) => macroLabels.includes(allLabels[ctx.index]) ? '#e5e5e5' : 'transparent'
                },
                pointLabels: {
                    color: '#222',
                    callback: (lbl) => macroLabels.includes(lbl) ? lbl : '',
                    font: { size: 12, weight: '700' }
                },
                ticks: {
                    stepSize: 1.0, display: true, color: '#888', backdropColor: 'transparent',
                    font: { size: 9 },
                    callback: function (val) { return Number.isInteger(val) ? val : val.toFixed(1); }
                }
            }
        }
    };
    /**
     * Component Chunk 3: Donut Interface Computations & Canvas Text Layering Hooks
     */
    // ROTATION CONTROL: Set your visual outer donut offset here in degrees (e.g., 0, 45, 90, etc.)
    const DONUT_PHASE_OFFSET_DEG = 272; 
    
    // Internal Structural Trigonometry
    const DEG_TO_RAD = Math.PI / 180;
    const PHASE_RAD = DONUT_PHASE_OFFSET_DEG * DEG_TO_RAD;
    const TWO_PI = 2 * Math.PI;

    const matrixChart = new Chart(ctx, {
        type: 'radar',
        data: { labels: allLabels, datasets: datasets },
        options: chartOptions,
        plugins: [{
            id: 'outerDonutExpansionEngine',
            beforeUpdate(chart) {
                const scale = chart.scales.r;
                if (scale) {
                    scale.getIndexAngle = function (idx) { return currentAngles[idx]; };
                }
            },
            afterDraw(chart) {
                const scale = chart.scales.r;
                if (!scale || scale.xCenter === undefined) return;
                const renderCtx = chart.ctx;

                // Primary Outer Ring Dimensions
                const outerRadius = scale.drawingArea + 28;
                const innerRadius = scale.drawingArea + 16;
                
                // NEW: Sub-Field Outer Ring Dimensions
                const subOuterRadius = scale.drawingArea + 44;
                const subInnerRadius = scale.drawingArea + 32;
                
                const matchKeys = [
                    'Automation-Data Science', 
                    'Data Science-Mechanical Design', 
                    'Mechanical Design-Mechatronics', 
                    'Mechatronics-Aerospace Engg.',
                    'Aerospace Engg.-Automation'
                ];
                
                const targets = {
                    'Automation-Data Science': ['AI / ML', 'System Engineering'],
                    'Data Science-Mechanical Design': ['Data Analytics', 'Financial Engg.'],
                    'Mechanical Design-Mechatronics': ['DFM', 'Reverse Engineering'],
                    'Mechatronics-Aerospace Engg.': ['Robotics + IoT', 'Simulation (CFD)'],
                    'Aerospace Engg.-Automation': ['Orbital Mechanics', 'Aerodynamics']
                };
                
                renderCtx.save();
                const sliceCount = macroLabels.length;
                for (let j = 0; j < sliceCount; j++) {
                    const startAngle = (j * TWO_PI / sliceCount) - (Math.PI / 2) + PHASE_RAD;
                    const endAngle = startAngle + (TWO_PI / sliceCount);
                    
                    // 1. Render Primary Macro Donut Ring
                    renderCtx.beginPath();
                    renderCtx.arc(scale.xCenter, scale.yCenter, outerRadius, startAngle, endAngle);
                    renderCtx.arc(scale.xCenter, scale.yCenter, innerRadius, endAngle, startAngle, true);
                    renderCtx.closePath();
                    
                    renderCtx.fillStyle = (activeSliceKey === matchKeys[j]) ? 'rgba(80, 80, 80, 0.15)' : 'rgba(235, 235, 235, 0.35)';
                    renderCtx.strokeStyle = '#d5d5d5';
                    renderCtx.lineWidth = 1;
                    renderCtx.fill();
                    renderCtx.stroke();
                    
                    // NEW: Render Secondary Sub-Field Donut Ring (Only visible on hover)
                    if (activeSliceKey === matchKeys[j]) {
                        const subs = targets[matchKeys[j]];
                        const midAngle = (startAngle + endAngle) / 2;
                        
                        // INCREASED THICKNESS: Bounds stretched from (+32px to +44px) to (+32px to +50px) -> 18px total thickness
                        const subOuterRadius = scale.drawingArea + 50;
                        const subInnerRadius = scale.drawingArea + 32;
                        
                        // Draw Sub-Sector 1
                        renderCtx.beginPath();
                        renderCtx.arc(scale.xCenter, scale.yCenter, subOuterRadius, startAngle, midAngle);
                        renderCtx.arc(scale.xCenter, scale.yCenter, subInnerRadius, midAngle, startAngle, true);
                        renderCtx.closePath();
                        renderCtx.fillStyle = 'rgba(100, 100, 100, 0.22)';
                        renderCtx.fill();
                        renderCtx.stroke();
                        
                        // Draw Sub-Sector 2
                        renderCtx.beginPath();
                        renderCtx.arc(scale.xCenter, scale.yCenter, subOuterRadius, midAngle, endAngle);
                        renderCtx.arc(scale.xCenter, scale.yCenter, subInnerRadius, endAngle, midAngle, true);
                        renderCtx.closePath();
                        renderCtx.fillStyle = 'rgba(100, 100, 100, 0.22)';
                        renderCtx.fill();
                        renderCtx.stroke();
                        
                        // Print Inline Sub-Field Text Labels
                        renderCtx.save();
                        // INCREASED FONT SIZE: Upgraded from '500 9px' to '700 11px' with tracking weight crispness
                        renderCtx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
                        renderCtx.fillStyle = '#222';
                        renderCtx.textAlign = 'center';
                        renderCtx.textBaseline = 'middle';
                        
                        const textRadius = (subOuterRadius + subInnerRadius) / 2;
                        
                        // Label 1
                        const a1 = (startAngle + midAngle) / 2;
                        renderCtx.fillText(subs[0], scale.xCenter + Math.cos(a1) * textRadius, scale.yCenter + Math.sin(a1) * textRadius);
                        
                        // Label 2
                        const a2 = (midAngle + endAngle) / 2;
                        renderCtx.fillText(subs[1], scale.xCenter + Math.cos(a2) * textRadius, scale.yCenter + Math.sin(a2) * textRadius);
                        
                        renderCtx.restore();
                    }
                }
                renderCtx.restore();

                allLabels.forEach((label, i) => {
                    if (macroLabels.includes(label) || labelOpacities[i] <= 0) return;
                    
                    const targetMetricValue = chart.data.datasets.data[i];
                    if (isNaN(targetMetricValue)) return;

                    const pointPos = scale.getPointPositionForValue(i, targetMetricValue);
                    const textOffsetX = Math.cos(currentAngles[i]) * 10;
                    const textOffsetY = Math.sin(currentAngles[i]) * 10;

                    renderCtx.save();
                    renderCtx.font = '600 10px -apple-system, BlinkMacSystemFont, sans-serif';
                    renderCtx.fillStyle = `rgba(255, 255, 255, ${labelOpacities[i] * 0.85})`;
                    renderCtx.strokeStyle = `rgba(200, 200, 200, ${labelOpacities[i] * 0.3})`;
                    renderCtx.lineWidth = 1;

                    const txtMetrics = renderCtx.measureText(label);
                    const boxW = txtMetrics.width + 10;
                    const boxH = 16;
                    const boxX = pointPos.x + textOffsetX - (Math.cos(currentAngles[i]) < -0.1 ? boxW : 0);
                    const boxY = pointPos.y + textOffsetY - (boxH / 2);

                    renderCtx.beginPath();
                    renderCtx.roundRect(boxX, boxY, boxW, boxH, 4);
                    renderCtx.fill();
                    renderCtx.stroke();

                    renderCtx.fillStyle = `rgba(40, 40, 40, ${labelOpacities[i]})`;
                    renderCtx.textAlign = 'center';
                    renderCtx.textBaseline = 'middle';
                    renderCtx.fillText(label, boxX + (boxW / 2), boxY + (boxH / 2));
                    renderCtx.restore();
                });
            },
            afterEvent(chart, args) {
                const event = args.event;
                if (event.type === 'mouseout') { resetChartState(chart); return; }
                if (event.type !== 'mousemove') return;

                const scale = chart.scales.r;
                if (!scale || scale.xCenter === undefined) return;

                const dx = event.x - scale.xCenter;
                const dy = event.y - scale.yCenter;
                const mouseRadius = Math.sqrt(dx * dx + dy * dy);
                
                // FIXED: Outer limit tracking bounds expanded to +44px to capture mouse hovers on the sub-field ring safely
                const outerRadius = scale.drawingArea + 44;
                const innerRadius = scale.drawingArea + 16;

                if (mouseRadius >= innerRadius && mouseRadius <= outerRadius) {
                    let angle = Math.atan2(dy, dx);
                    
                    let adjustedAngle = angle + (Math.PI / 2) - PHASE_RAD;
                    adjustedAngle = (adjustedAngle % TWO_PI + TWO_PI) % TWO_PI;

                    const sliceCount = macroLabels.length;
                    const size = TWO_PI / sliceCount;
                    let idx = Math.floor(adjustedAngle / size);
                    if (idx >= sliceCount) idx = sliceCount - 1;

                    const matchKeys = [
                        'Automation-Data Science', 
                        'Data Science-Mechanical Design', 
                        'Mechanical Design-Mechatronics', 
                        'Mechatronics-Aerospace Engg.',
                        'Aerospace Engg.-Automation'
                    ];
                    const sliceKey = matchKeys[idx];

                    const targets = {
                        'Automation-Data Science': ['AI / ML', 'System Engineering'],
                        'Data Science-Mechanical Design': ['Data Analytics', 'Financial Engg.'],
                        'Mechanical Design-Mechatronics': ['DFM', 'Reverse Engineering'],
                        'Mechatronics-Aerospace Engg.': ['Robotics + IoT', 'Simulation (CFD)'],
                        'Aerospace Engg.-Automation': ['Orbital Mechanics', 'Aerodynamics']
                    };

                    if (activeSliceKey !== sliceKey && targets[sliceKey]) {
                        activeSliceKey = sliceKey;
                        const activeSubs = targets[sliceKey];

                        const primaryIndexMap = {
                            'Automation-Data Science': { start: 0, end: 3, shift: 0.38 },
                            'Data Science-Mechanical Design': { start: 3, end: 6, shift: 0.38 },
                            'Mechanical Design-Mechatronics': { start: 6, end: 9, shift: 0.38 },
                            'Mechatronics-Aerospace Engg.': { start: 9, end: 12, shift: 0.38 },
                            'Aerospace Engg.-Automation': { start: 12, end: 0, shift: 0.38 }
                        };

                        const shiftConfig = primaryIndexMap[sliceKey];
                        allLabels.forEach((_, i) => {
                            let originalBase = (i * TWO_PI) / allLabels.length - (Math.PI / 2);
                            targetAngles[i] = originalBase;
                            if (shiftConfig) {
                                if (i === shiftConfig.start) targetAngles[i] = originalBase - shiftConfig.shift;
                                if (i === shiftConfig.end) targetAngles[i] = originalBase + shiftConfig.shift;
                            }
                        });

                        chart.data.datasets.forEach((dataset) => {
                            const key = dataset.label === 'Experience' ? 'exp' : dataset.label === 'Skill Level' ? 'skill' : 'prod';
                            dataset.data = allLabels.map(l => (macroLabels.includes(l) || activeSubs.includes(l)) ? database[l][key] : NaN);
                        });

                        chart.options.scales.r.ticks.stepSize = 0.5;
                        if (!animationFrameId) animationFrameId = requestAnimationFrame(() => animateAngles(chart));
                    }
                }
            }
        }]
    });

    function resetChartState(chart) {
        if (activeSliceKey === null) return;
        activeSliceKey = null;

        allLabels.forEach((_, i) => {
            targetAngles[i] = (i * TWO_PI) / allLabels.length - (Math.PI / 2);
        });

        chart.data.datasets.forEach((dataset) => {
            const key = dataset.label === 'Experience' ? 'exp' : dataset.label === 'Skill Level' ? 'skill' : 'prod';
            dataset.data = generateDataArray(key);
        });

        chart.options.scales.r.ticks.stepSize = 1.0;
        if (!animationFrameId) animationFrameId = requestAnimationFrame(() => animateAngles(chart));
    }
})();
