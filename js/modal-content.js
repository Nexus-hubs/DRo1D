/**
 * Modal Content Data
 */

export const modalContent = {
    'neural-architecture': {
        title: 'NEURAL ENGINE ⟡ ARCHITECTURE MAP',
        content: `
            <h3>Network Topology</h3>
            <p>The neural architecture implements a 12-layer deep learning model with residual connections enabling gradient flow across the entire depth. Each layer contains 2048 neurons with ReLU activation functions.</p>

            <div class="code-block">
LAYER_01: INPUT_BUFFER [2048 nodes]
LAYER_02-11: PROCESSING [2048 nodes each, residual skip]
LAYER_12: OUTPUT_LAYER [512 nodes]
            </div>

            <h3>Connection Patterns</h3>
            <p>Dense connectivity within layers provides maximum information flow. Sparse long-range connections enable feature composition across multiple scales. Attention mechanisms dynamically weight input significance.</p>

            <p>Total parameters: 47.3 million trainable weights. Memory footprint: 189MB in FP32, 47MB in INT8 quantized inference mode.</p>
        `
    },
    'learning-protocol': {
        title: 'NEURAL ENGINE ⟡ LEARNING LOGS',
        content: `
            <h3>Training Methodology</h3>
            <p>Initial supervised training on 2.4 million labeled examples established baseline capability. Ongoing reinforcement learning refines behavior based on operational feedback.</p>

            <h3>Recent Performance Metrics</h3>
            <div class="code-block">
ACCURACY: 97.3% (validation set)
LATENCY: 12ms average inference time
IMPROVEMENT: +2.1% over previous model version
TRAINING_CYCLES: 147,382 completed
            </div>

            <p>Error analysis reveals remaining failure modes concentrate in edge cases involving extreme lighting conditions and novel object categories not represented in training data.</p>
        `
    },
    'sensor-map': {
        title: 'SENSOR ARRAY ⟡ SPATIAL LAYOUT',
        content: `
            <h3>Sensor Distribution</h3>
            <p>47 sensors strategically positioned across the chassis provide 360-degree environmental awareness. Overlapping coverage zones ensure redundancy for critical perception tasks.</p>

            <div class="code-block">
VISUAL: 8x RGB cameras (4K resolution)
DEPTH: 4x stereo pairs + 2x LiDAR
THERMAL: 6x IR sensors (long-wave)
PROXIMITY: 12x ultrasonic rangefinders
IMU: 3x redundant 9-axis units
TACTILE: 12x force-torque sensors
            </div>

            <p>Sensor fusion algorithms combine these streams into unified world representation updated at 120Hz.</p>
        `
    },
    'power-diagram': {
        title: 'POWER CORE ⟡ DISTRIBUTION DIAGRAM',
        content: `
            <h3>Power Architecture</h3>
            <p>Multi-rail power delivery ensures stable voltage supply to all subsystems. Isolated domains prevent noise coupling between sensitive analog circuits and high-current digital loads.</p>

            <div class="code-block">
BATTERY: 8S6P Li-ion (28.8V nominal, 21Ah)
MAIN_BUS: 24V @ 50A continuous
LOGIC_RAIL: 5V @ 15A (isolated)
ANALOG_RAIL: ±15V @ 2A (ultra-low noise)
SERVO_BUS: 12V @ 30A (surge to 60A)
            </div>

            <p>Intelligent power management extends runtime by dynamically scaling voltage and frequency based on instantaneous load requirements.</p>
        `
    },
    'input-pipeline': {
        title: 'AI CORE ⟡ INPUT PIPELINE',
        content: `
            <h3>Data Ingress</h3>
            <p>Sensor streams enter through dedicated DMA channels, bypassing CPU overhead for maximum throughput. Hardware preprocessing performs color space conversion, scaling, and normalization before data reaches the AI pipeline.</p>

            <p>Priority scheduling ensures time-critical safety sensor data preempts lower-priority environmental monitoring streams when bus contention occurs.</p>
        `
    },
    'decision-tree': {
        title: 'AI CORE ⟡ DECISION TREE',
        content: `
            <h3>Evaluation Flow</h3>
            <p>Decision logic branches through hierarchical evaluation stages, with early-exit paths allowing simple cases to skip deep evaluation. Complex scenarios trigger full network inference with ensemble voting across multiple model variants.</p>

            <div class="code-block">
STAGE_1: Fast heuristic check (1ms)
  └─ PASS: Execute immediate action
  └─ FAIL: Proceed to STAGE_2
STAGE_2: Neural evaluation (12ms)
  └─ HIGH_CONFIDENCE: Execute action
  └─ LOW_CONFIDENCE: Proceed to STAGE_3
STAGE_3: Ensemble consensus (35ms)
  └─ Aggregate multiple model outputs
  └─ Execute highest-confidence action
            </div>
        `
    },
    'feedback-system': {
        title: 'AI CORE ⟡ FEEDBACK SYSTEM',
        content: `
            <h3>Continuous Learning</h3>
            <p>Every action outcome is logged with associated sensor context. Unexpected results trigger analysis cycles that identify model deficiencies. Updated training sets incorporate these examples, progressively expanding capability boundaries.</p>

            <p>Learning rate schedules decay over operational lifetime, balancing plasticity for new learning against stability of proven behaviors.</p>
        `
    },
    'processor-arch': {
        title: 'PROCESSOR ⟡ CORE LAYOUT',
        content: `
            <h3>Core Distribution</h3>
            <div class="code-block">
PERFORMANCE_CORES: 16x @ 3.2GHz
EFFICIENCY_CORES: 32x @ 1.8GHz
NEURAL_UNITS: 16x AI accelerators
GPU_COMPUTE: 1024 shader cores
            </div>

            <p>Heterogeneous architecture allows workload-appropriate core assignment. Real-time tasks run on performance cores with guaranteed latency. Background processing migrates to efficiency cores to minimize power consumption.</p>
        `
    },
    'assembly-checklist': {
        title: 'LAB ⟡ ASSEMBLY CHECKLIST',
        content: `
            <h3>Assembly Verification</h3>
            <div class="code-block">
☑ Chassis structural integrity confirmed
☑ All fasteners torqued to specification
☑ Cable routing verified (no pinch points)
☑ Connector seating confirmed (all 147 connections)
☑ Cooling system flow test passed
☑ Weight balance within 2% of nominal
☑ No foreign material detected (camera inspection)
            </div>

            <p>Each checklist item requires dual-operator verification before proceeding to next assembly stage.</p>
        `
    },
    'test-protocols': {
        title: 'LAB ⟡ TEST PROTOCOLS',
        content: `
            <h3>Functional Test Suite</h3>
            <p>Comprehensive validation covers all operational modes. Tests run automatically with results logged to quality database. Any failure triggers immediate halt and diagnostic mode activation.</p>

            <div class="code-block">
POWER_UP: All voltage rails stable
SENSOR_SWEEP: All 47 sensors responding
ACTUATOR_TEST: Full range of motion confirmed
AI_BENCHMARK: Inference performance validated
COMMUNICATION: All protocols functioning
THERMAL_PROFILE: Within operating limits
            </div>

            <p>Test duration: 47 minutes for complete suite execution.</p>
        `
    },
    'calibration-data': {
        title: 'LAB ⟡ CALIBRATION DATA',
        content: `
            <h3>Calibration Parameters</h3>
            <p>Each sensor receives unique calibration constants derived from comparison against traceable reference standards. Constants are stored in tamper-evident non-volatile memory.</p>

            <div class="code-block">
CAMERA_01:
  focal_length: 3.67mm
  distortion_k1: -0.142
  distortion_k2: 0.031
  calibration_date: 2025-11-08
  reference_std: NIST-2024-A7
            </div>

            <p>Calibration validity: 12 months under normal operating conditions. Annual re-calibration recommended for critical applications.</p>
        `
    },
    'deployment-log': {
        title: 'LAB ⟡ DEPLOYMENT LOG',
        content: `
            <h3>Unit Deployment Record</h3>
            <div class="code-block">
SERIAL: DR01D-2025-A0472
BUILD_DATE: 2025-11-09
TEST_STATUS: ALL_PASS
CALIBRATION: VALID
FIRMWARE: v2.4.7
DESTINATION: Research Facility Alpha
DEPLOYMENT_DATE: 2025-11-11
            </div>

            <p>Complete system state backed up to encrypted storage. Remote support infrastructure provisioned and validated. Unit cleared for operational deployment.</p>
        `
    }
};
