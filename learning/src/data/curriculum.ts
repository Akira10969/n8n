export interface Topic {
  id: string;
  title: string;
  isImplemented?: boolean;
}

export interface Category {
  id: string;
  title: string;
  topics: Topic[];
}

export const curriculum: Category[] = [
  {
    id: 'electrical-fundamentals',
    title: '1. Electrical Fundamentals',
    topics: [
      { id: 'what-is-electricity', title: '1. What Is Electricity?', isImplemented: true },
      { id: 'electric-charge', title: '2. Electric Charge' },
      { id: 'electrons', title: '3. Electrons' },
      { id: 'conductors-insulators', title: '4. Conductors and Insulators' },
      { id: 'voltage', title: '5. Voltage' },
      { id: 'current', title: '6. Current' },
      { id: 'resistance', title: '7. Resistance' },
      { id: 'ground-reference', title: '8. Ground and Reference' },
      { id: 'dc-vs-ac', title: '9. DC vs AC' },
      { id: 'electrical-power', title: '10. Electrical Power' },
      { id: 'electrical-energy', title: '11. Electrical Energy' },
      { id: 'units-prefixes', title: '12. Units and Prefixes' },
      { id: 'ohms-law', title: '13. Ohm\'s Law', isImplemented: true },
      { id: 'power-formulas', title: '14. Electrical Power Formulas' },
      { id: 'circuit-safety', title: '15. Basic Circuit Safety' }
    ]
  },
  {
    id: 'circuit-fundamentals',
    title: '2. Circuit Fundamentals',
    topics: [
      { id: 'what-is-circuit', title: '16. What Is an Electrical Circuit?' },
      { id: 'open-closed-circuit', title: '17. Open vs Closed Circuit' },
      { id: 'circuit-paths', title: '18. Circuit Paths' },
      { id: 'circuit-symbols', title: '19. Circuit Symbols' },
      { id: 'reading-schematics', title: '20. Reading Schematics' },
      { id: 'series-circuits', title: '21. Series Circuits' },
      { id: 'parallel-circuits', title: '22. Parallel Circuits' },
      { id: 'series-parallel', title: '23. Series-Parallel Circuits' },
      { id: 'voltage-drop', title: '24. Voltage Drop' },
      { id: 'voltage-division', title: '25. Voltage Division' },
      { id: 'current-division', title: '26. Current Division' },
      { id: 'kcl', title: '27. Kirchhoff\'s Current Law' },
      { id: 'kvl', title: '28. Kirchhoff\'s Voltage Law' },
      { id: 'equivalent-resistance', title: '29. Equivalent Resistance' },
      { id: 'circuit-analysis', title: '30. Circuit Analysis Basics' }
    ]
  },
  {
    id: 'electronic-components',
    title: '3. Electronic Components',
    topics: [
      { id: 'resistors', title: '31. Resistors' },
      { id: 'resistor-color-codes', title: '32. Resistor Color Codes' },
      { id: 'resistor-tolerance', title: '33. Resistor Tolerance' },
      { id: 'resistor-power', title: '34. Resistor Power Rating' },
      { id: 'potentiometers', title: '35. Potentiometers' },
      { id: 'capacitors', title: '36. Capacitors' },
      { id: 'capacitor-polarity', title: '37. Capacitor Polarity' },
      { id: 'capacitor-charging', title: '38. Capacitor Charging' },
      { id: 'capacitor-discharging', title: '39. Capacitor Discharging' },
      { id: 'rc-time-constant', title: '40. RC Time Constant' },
      { id: 'inductors', title: '41. Inductors' },
      { id: 'diodes', title: '42. Diodes' },
      { id: 'diode-polarity', title: '43. Diode Polarity' },
      { id: 'forward-bias', title: '44. Forward Bias' },
      { id: 'reverse-bias', title: '45. Reverse Bias' },
      { id: 'zener-diodes', title: '46. Zener Diodes' },
      { id: 'leds', title: '47. LEDs' },
      { id: 'switches', title: '48. Switches' },
      { id: 'relays', title: '49. Relays' },
      { id: 'transformers', title: '50. Transformers' },
      { id: 'voltage-regulators', title: '51. Voltage Regulators' }
    ]
  },
  {
    id: 'breadboard-fundamentals',
    title: '4. Breadboard Fundamentals',
    topics: [
      { id: 'what-is-breadboard', title: '52. What Is a Breadboard?', isImplemented: true },
      { id: 'breadboard-internal', title: '53. Breadboard Internal Connections' },
      { id: 'power-rails', title: '54. Power Rails' },
      { id: 'terminal-strips', title: '55. Terminal Strips' },
      { id: 'center-gap', title: '56. Breadboard Center Gap' },
      { id: 'jumper-wires', title: '57. Jumper Wires' },
      { id: 'component-placement', title: '58. Component Placement' },
      { id: 'build-simple-circuit', title: '59. Building a Simple LED Circuit' },
      { id: 'build-series', title: '60. Building a Series Circuit' },
      { id: 'build-parallel', title: '61. Building a Parallel Circuit' },
      { id: 'breadboard-polarity', title: '62. Breadboard Polarity' },
      { id: 'common-mistakes', title: '63. Common Breadboard Mistakes' },
      { id: 'short-circuits', title: '64. Breadboard Short Circuits' },
      { id: 'breadboard-troubleshooting', title: '65. Breadboard Troubleshooting' }
    ]
  },
  {
    id: 'measurement',
    title: '5. Measurement',
    topics: [
      { id: 'what-is-multimeter', title: '66. What Is a Multimeter?' },
      { id: 'voltage-measurement', title: '67. Voltage Measurement' },
      { id: 'current-measurement', title: '68. Current Measurement' },
      { id: 'resistance-measurement', title: '69. Resistance Measurement' },
      { id: 'continuity-testing', title: '70. Continuity Testing' },
      { id: 'measuring-battery', title: '71. Measuring a Battery' },
      { id: 'measuring-resistor', title: '72. Measuring a Resistor' },
      { id: 'measuring-led', title: '73. Measuring an LED Circuit' },
      { id: 'finding-open-circuit', title: '74. Finding an Open Circuit' },
      { id: 'finding-short-circuit', title: '75. Finding a Short Circuit' },
      { id: 'reading-measurements', title: '76. Reading Circuit Measurements' },
      { id: 'oscilloscopes-intro', title: '77. Introduction to Oscilloscopes' },
      { id: 'reading-waveforms', title: '78. Reading Waveforms' }
    ]
  },
  {
    id: 'semiconductor-fundamentals',
    title: '6. Semiconductor Fundamentals',
    topics: [
      { id: 'what-is-semiconductor', title: '79. What Is a Semiconductor?' },
      { id: 'conductors-vs-semiconductors', title: '80. Conductors vs Semiconductors vs Insulators' },
      { id: 'pn-junction', title: '81. PN Junction' },
      { id: 'diode-operation', title: '82. Diode Operation' },
      { id: 'transistors', title: '83. Transistors' },
      { id: 'bjt-fundamentals', title: '84. BJT Fundamentals' },
      { id: 'npn-transistor', title: '85. NPN Transistor' },
      { id: 'pnp-transistor', title: '86. PNP Transistor' },
      { id: 'base-collector-emitter', title: '87. Base, Collector, Emitter' },
      { id: 'transistor-switch', title: '88. Transistor as a Switch' },
      { id: 'transistor-amplifier', title: '89. Transistor as an Amplifier' },
      { id: 'mosfet-fundamentals', title: '90. MOSFET Fundamentals' },
      { id: 'gate-drain-source', title: '91. Gate, Drain, Source' },
      { id: 'n-channel-mosfet', title: '92. N-Channel MOSFET' },
      { id: 'p-channel-mosfet', title: '93. P-Channel MOSFET' },
      { id: 'mosfet-switch', title: '94. MOSFET as a Switch' }
    ]
  },
  {
    id: 'analog-electronics',
    title: '7. Analog Electronics',
    topics: [
      { id: 'analog-signals', title: '95. Analog Signals' },
      { id: 'digital-vs-analog', title: '96. Digital vs Analog' },
      { id: 'amplitude', title: '97. Amplitude' },
      { id: 'frequency', title: '98. Frequency' },
      { id: 'period', title: '99. Period' },
      { id: 'phase', title: '100. Phase' },
      { id: 'waveforms', title: '101. Waveforms' },
      { id: 'rc-circuits-analog', title: '102. RC Circuits' },
      { id: 'low-pass-filters', title: '103. Low-Pass Filters' },
      { id: 'high-pass-filters', title: '104. High-Pass Filters' },
      { id: 'voltage-regulators-analog', title: '105. Voltage Regulators' },
      { id: 'op-amps', title: '106. Operational Amplifiers' },
      { id: 'op-amp-basics', title: '107. Op-Amp Basics' },
      { id: 'comparator', title: '108. Comparator' },
      { id: 'amplifier-basics', title: '109. Amplifier Basics' },
      { id: 'feedback', title: '110. Feedback' }
    ]
  },
  {
    id: 'digital-electronics',
    title: '8. Digital Electronics',
    topics: [
      { id: 'what-is-digital', title: '111. What Is Digital Electronics?' },
      { id: 'logic-0-1', title: '112. Logic 0 and Logic 1' },
      { id: 'digital-signals', title: '113. Digital Signals' },
      { id: 'binary-numbers', title: '114. Binary Numbers' },
      { id: 'decimal-binary', title: '115. Decimal ↔ Binary' },
      { id: 'hexadecimal', title: '116. Hexadecimal' },
      { id: 'and-gate', title: '117. AND Gate', isImplemented: true },
      { id: 'or-gate', title: '118. OR Gate' },
      { id: 'not-gate', title: '119. NOT Gate' },
      { id: 'nand-gate', title: '120. NAND Gate' },
      { id: 'nor-gate', title: '121. NOR Gate' },
      { id: 'xor-gate', title: '122. XOR Gate' },
      { id: 'xnor-gate', title: '123. XNOR Gate' },
      { id: 'truth-tables', title: '124. Truth Tables' },
      { id: 'boolean-algebra', title: '125. Boolean Algebra' },
      { id: 'boolean-expressions', title: '126. Boolean Expressions' },
      { id: 'demorgans-laws', title: '127. De Morgan\'s Laws' },
      { id: 'combinational-logic', title: '128. Combinational Logic' },
      { id: 'half-adder', title: '129. Half Adder' },
      { id: 'full-adder', title: '130. Full Adder' },
      { id: 'multiplexer', title: '131. Multiplexer' },
      { id: 'demultiplexer', title: '132. Demultiplexer' },
      { id: 'encoder', title: '133. Encoder' },
      { id: 'decoder', title: '134. Decoder' }
    ]
  },
  {
    id: 'sequential-logic',
    title: '9. Sequential Logic',
    topics: [
      { id: 'comb-vs-seq', title: '135. Combinational vs Sequential Logic' },
      { id: 'clock-signals', title: '136. Clock Signals' },
      { id: 'latches', title: '137. Latches' },
      { id: 'flip-flops', title: '138. Flip-Flops' },
      { id: 'sr-flip-flop', title: '139. SR Flip-Flop' },
      { id: 'd-flip-flop', title: '140. D Flip-Flop' },
      { id: 'jk-flip-flop', title: '141. JK Flip-Flop' },
      { id: 't-flip-flop', title: '142. T Flip-Flop' },
      { id: 'registers', title: '143. Registers' },
      { id: 'shift-registers', title: '144. Shift Registers' },
      { id: 'counters', title: '145. Counters' },
      { id: 'frequency-dividers', title: '146. Frequency Dividers' },
      { id: 'state-machines', title: '147. State Machines' }
    ]
  },
  {
    id: 'microcontrollers',
    title: '10. Microcontrollers',
    topics: [
      { id: 'what-is-mcu', title: '148. What Is a Microcontroller?' },
      { id: 'mcu-vs-mpu', title: '149. Microcontroller vs Microprocessor' },
      { id: 'cpu', title: '150. CPU' },
      { id: 'memory', title: '151. Memory' },
      { id: 'gpio', title: '152. GPIO' },
      { id: 'digital-input', title: '153. Digital Input' },
      { id: 'digital-output', title: '154. Digital Output' },
      { id: 'pull-up', title: '155. Pull-Up Resistors' },
      { id: 'pull-down', title: '156. Pull-Down Resistors' },
      { id: 'adc', title: '157. ADC' },
      { id: 'dac', title: '158. DAC' },
      { id: 'pwm', title: '159. PWM' },
      { id: 'timers', title: '160. Timers' },
      { id: 'interrupts', title: '161. Interrupts' },
      { id: 'uart', title: '162. UART' },
      { id: 'spi', title: '163. SPI' },
      { id: 'i2c', title: '164. I²C' },
      { id: 'sensors', title: '165. Sensors' },
      { id: 'actuators', title: '166. Actuators' },
      { id: 'motors', title: '167. Motors' },
      { id: 'relays-mcu', title: '168. Relays' }
    ]
  },
  {
    id: 'computer-architecture',
    title: '11. Computer Architecture',
    topics: [
      { id: 'what-is-computer', title: '169. What Is a Computer?' },
      { id: 'cpu-fundamentals', title: '170. CPU Fundamentals' },
      { id: 'alu', title: '171. ALU' },
      { id: 'control-unit', title: '172. Control Unit' },
      { id: 'registers-cpu', title: '173. Registers' },
      { id: 'program-counter', title: '174. Program Counter' },
      { id: 'instruction-register', title: '175. Instruction Register' },
      { id: 'clock', title: '176. Clock' },
      { id: 'buses', title: '177. Buses' },
      { id: 'data-bus', title: '178. Data Bus' },
      { id: 'address-bus', title: '179. Address Bus' },
      { id: 'control-bus', title: '180. Control Bus' },
      { id: 'memory-arch', title: '181. Memory' },
      { id: 'ram', title: '182. RAM' },
      { id: 'rom', title: '183. ROM' },
      { id: 'cache', title: '184. Cache' },
      { id: 'memory-addressing', title: '185. Memory Addressing' },
      { id: 'instruction-cycle', title: '186. Instruction Cycle' },
      { id: 'fetch', title: '187. Fetch' },
      { id: 'decode', title: '188. Decode' },
      { id: 'execute', title: '189. Execute' },
      { id: 'store', title: '190. Store' },
      { id: 'machine-instructions', title: '191. Machine Instructions' },
      { id: 'assembly', title: '192. Assembly Fundamentals' }
    ]
  },
  {
    id: 'embedded-systems',
    title: '12. Embedded Systems',
    topics: [
      { id: 'what-is-embedded', title: '193. What Is an Embedded System?' },
      { id: 'hardware-software', title: '194. Hardware + Software' },
      { id: 'firmware', title: '195. Firmware' },
      { id: 'real-time', title: '196. Real-Time Systems' },
      { id: 'sensors-embedded', title: '197. Sensors' },
      { id: 'actuators-embedded', title: '198. Actuators' },
      { id: 'interrupt-driven', title: '199. Interrupt-Driven Systems' },
      { id: 'comm-protocols', title: '200. Communication Protocols' },
      { id: 'power-management', title: '201. Power Management' },
      { id: 'debugging-embedded', title: '202. Debugging Embedded Systems' },
      { id: 'hw-sw-interaction', title: '203. Hardware/Software Interaction' }
    ]
  },
  {
    id: 'pcb-fundamentals',
    title: '13. PCB Fundamentals',
    topics: [
      { id: 'what-is-pcb', title: '204. What Is a PCB?' },
      { id: 'schematic-vs-pcb', title: '205. Schematic vs PCB' },
      { id: 'pcb-layers', title: '206. PCB Layers' },
      { id: 'copper', title: '207. Copper' },
      { id: 'pads', title: '208. Pads' },
      { id: 'traces', title: '209. Traces' },
      { id: 'vias', title: '210. Vias' },
      { id: 'through-hole', title: '211. Through-Hole Components' },
      { id: 'smd', title: '212. SMD Components' },
      { id: 'footprints', title: '213. Component Footprints' },
      { id: 'nets', title: '214. Nets' },
      { id: 'ground-planes', title: '215. Ground Planes' },
      { id: 'power-planes', title: '216. Power Planes' },
      { id: 'trace-width', title: '217. Trace Width' },
      { id: 'clearance', title: '218. Clearance' },
      { id: 'decoupling-caps', title: '219. Decoupling Capacitors' },
      { id: 'pcb-routing', title: '220. PCB Routing' },
      { id: 'signal-integrity', title: '221. Signal Integrity Basics' },
      { id: 'thermal-considerations', title: '222. Thermal Considerations' },
      { id: 'drc', title: '223. Design Rule Checks' },
      { id: 'gerber-files', title: '224. Gerber Files' },
      { id: 'pcb-manufacturing', title: '225. PCB Manufacturing' },
      { id: 'pcb-assembly', title: '226. PCB Assembly' }
    ]
  },
  {
    id: 'practical-engineering',
    title: '14. Practical Engineering',
    topics: [
      { id: 'reading-real-schematic', title: '227. Reading a Real Schematic' },
      { id: 'selecting-components', title: '228. Selecting Components' },
      { id: 'calculating-values', title: '229. Calculating Component Values' },
      { id: 'building-circuit', title: '230. Building a Circuit' },
      { id: 'measuring-circuit', title: '231. Measuring a Circuit' },
      { id: 'debugging-circuit', title: '232. Debugging a Circuit' },
      { id: 'finding-faults', title: '233. Finding Faults' },
      { id: 'using-datasheet', title: '234. Using a Datasheet' },
      { id: 'reading-specs', title: '235. Reading Component Specifications' },
      { id: 'voltage-current-reqs', title: '236. Voltage/Current Requirements' },
      { id: 'power-budgeting', title: '237. Power Budgeting' },
      { id: 'hardware-design-cons', title: '238. Hardware Design Considerations' },
      { id: 'pcb-design-review', title: '239. PCB Design Review' },
      { id: 'hardware-troubleshooting', title: '240. Hardware Troubleshooting' }
    ]
  }
];
