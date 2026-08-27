export const genericContent: Record<string, { concept: string, explanation: string, practice: { q: string, options: string[], answerIndex: number, explanation: string } }> = {
  'electric-charge': {
    concept: 'Electric charge is a fundamental physical property of matter that causes it to experience a force when placed in an electromagnetic field. There are two types of electric charges: positive and negative. Like charges repel each other, and opposite charges attract.',
    explanation: 'Protons carry a positive charge, while electrons carry a negative charge. In most objects, the number of protons and electrons is equal, meaning the object is electrically neutral. When an object gains or loses electrons, it becomes charged.',
    practice: {
      q: 'What happens when two negatively charged objects are brought close together?',
      options: ['They attract each other.', 'They repel each other.', 'Nothing happens.'],
      answerIndex: 1,
      explanation: 'Like charges (negative and negative) always repel each other.'
    }
  },
  'electrons': {
    concept: 'Electrons are subatomic particles with a negative elementary electric charge. They orbit the nucleus of an atom. In conductive materials, the outermost electrons (valence electrons) are loosely bound and can easily move from atom to atom.',
    explanation: 'This movement of free electrons is what constitutes an electrical current. When a voltage is applied across a conductor, it creates an electric field that pushes these free electrons in a specific direction.',
    practice: {
      q: 'Which of the following describes the role of an electron in electricity?',
      options: ['It remains stationary in the nucleus.', 'It carries a positive charge.', 'Its movement through a conductor creates an electric current.'],
      answerIndex: 2,
      explanation: 'Electricity in a wire is the flow of free electrons.'
    }
  },
  'voltage': {
    concept: 'Voltage (measured in Volts, V) is the difference in electric potential between two points. It is the "pressure" or "force" that pushes electrons through a conducting loop, enabling them to do work, such as illuminating a light bulb.',
    explanation: 'A battery provides a specific voltage (e.g., 9V) which means the positive terminal has a higher electrical potential than the negative terminal. When a circuit is closed, this potential difference forces electrons to flow.',
    practice: {
      q: 'If voltage is compared to water in a plumbing system, what does voltage represent?',
      options: ['The width of the pipe', 'The water pressure', 'The amount of water flowing'],
      answerIndex: 1,
      explanation: 'Voltage is the "pressure" that pushes the current (water) through the circuit (pipes).'
    }
  },
  'current': {
    concept: 'Current (measured in Amperes, A) is the rate at which electric charge flows past a point in a circuit. One Ampere represents one Coulomb of charge moving past a specific point in one second.',
    explanation: 'While actual electrons move from the negative terminal to the positive terminal, "Conventional Current" is traditionally drawn flowing from positive to negative. Both describe the same phenomenon.',
    practice: {
      q: 'What unit is used to measure electrical current?',
      options: ['Volts (V)', 'Ohms (Ω)', 'Amperes (A)'],
      answerIndex: 2,
      explanation: 'Current is measured in Amperes, often just called "Amps".'
    }
  },
  'resistance': {
    concept: 'Resistance (measured in Ohms, Ω) is a measure of the opposition to current flow in an electrical circuit. All materials have some resistance, except for superconductors.',
    explanation: 'A high resistance means it is difficult for electrons to flow, resulting in a lower current for a given voltage. Resistors are components specifically designed to add a known amount of resistance to a circuit to control the current.',
    practice: {
      q: 'If you increase the resistance in a circuit while keeping the voltage constant, what happens to the current?',
      options: ['It increases.', 'It decreases.', 'It stays the same.'],
      answerIndex: 1,
      explanation: 'According to Ohm\'s Law (I = V/R), if R increases, I (current) must decrease.'
    }
  },
  'ground-reference': {
    concept: 'Ground (or Earth) in electrical engineering is the reference point in an electrical circuit from which voltages are measured, a common return path for electric current, or a direct physical connection to the Earth.',
    explanation: 'Voltage is a relative measurement (a difference between two points). By defining one point in the circuit as "Ground" (0V), we can conveniently state the voltage at any other point relative to that ground.',
    practice: {
      q: 'What is the assumed voltage of the Ground node in circuit analysis?',
      options: ['1V', '5V', '0V'],
      answerIndex: 2,
      explanation: 'Ground is defined as the 0V reference point.'
    }
  },
  'electrical-power': {
    concept: 'Electrical Power (measured in Watts, W) is the rate at which electrical energy is transferred by an electric circuit. It is the rate at which work is done or energy is transformed into another form (like heat or light).',
    explanation: 'Power is calculated by multiplying Voltage and Current (P = V × I). A 100W light bulb converts electrical energy into light and heat faster than a 10W light bulb.',
    practice: {
      q: 'If a circuit has a voltage of 10V and a current of 2A, what is the power?',
      options: ['5W', '12W', '20W'],
      answerIndex: 2,
      explanation: 'P = V × I. So, P = 10V × 2A = 20 Watts.'
    }
  },
  'electrical-energy': {
    concept: 'Electrical Energy (measured in Joules, J, or Watt-hours, Wh) is the total amount of work done by an electrical circuit over a period of time.',
    explanation: 'While Power is the *rate* of energy transfer, Energy is the *total amount*. For example, running a 100W device for 2 hours consumes 200 Watt-hours (Wh) of electrical energy.',
    practice: {
      q: 'What is the relationship between power and energy?',
      options: ['They are the same thing.', 'Energy is Power multiplied by Time.', 'Power is Energy multiplied by Time.'],
      answerIndex: 1,
      explanation: 'Energy = Power × Time. Power is the rate, Energy is the total quantity.'
    }
  },
  'units-prefixes': {
    concept: 'Engineers use standard SI prefixes to easily express very large or very small values. For example, it is easier to write 5 mA (milliamps) than 0.005 A.',
    explanation: 'Common prefixes include: Mega (M, 10^6), kilo (k, 10^3), milli (m, 10^-3), micro (µ, 10^-6), nano (n, 10^-9), and pico (p, 10^-12).',
    practice: {
      q: 'How many Ohms are in a 4.7 kΩ resistor?',
      options: ['4.7 Ω', '470 Ω', '4700 Ω'],
      answerIndex: 2,
      explanation: 'The prefix "kilo" (k) means 1,000. So 4.7 × 1000 = 4700 Ω.'
    }
  },
  'power-formulas': {
    concept: 'Because of Ohm\'s Law (V = I × R), the primary power formula (P = V × I) can be rewritten in two other very useful ways by substituting variables.',
    explanation: 'If you substitute V with (I × R), you get P = I² × R. If you substitute I with (V / R), you get P = V² / R. These are extremely useful when you only know two of the three variables.',
    practice: {
      q: 'Which formula would you use to calculate power if you only know the Current (I) and Resistance (R)?',
      options: ['P = V × I', 'P = I² × R', 'P = V² / R'],
      answerIndex: 1,
      explanation: 'P = I² × R allows you to calculate power dissipation directly from current and resistance.'
    }
  },
  'circuit-safety': {
    concept: 'Working with electricity requires strict adherence to safety protocols to prevent shock, burns, or fires.',
    explanation: 'Key rules: Never work on a live circuit (unplug or remove batteries first). Current is what stops the heart; even small currents (like 50mA) can be lethal if they pass across the chest. Always double-check polarity and component ratings.',
    practice: {
      q: 'What should you ALWAYS do before modifying a circuit on a breadboard?',
      options: ['Increase the voltage.', 'Disconnect the power source.', 'Touch the components to see if they are hot.'],
      answerIndex: 1,
      explanation: 'Always disconnect the power before making changes to prevent short circuits or shocks.'
    }
  }
};
