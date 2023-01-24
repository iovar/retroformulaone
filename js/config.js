export const CHANCES = [
    [2,5],
    [2,6],
    [3,6],
    [3,7],
    [4,7],
    [4,8],
    [5,8],
    [5,9],
    [6,9],
    [7,9]
];

// Defines points that advance to a next level
export const LEVELS = [
    300,
    600,
    900,
    1200,
    1800,
    2600,
    3600,
    4500,
    6000,
    9999
];

// Defines points at which a pitstop happens
export const PITSTOPS = [
    2000,
    5000,
    7800,
    10000
];

// Defines speed of each level
export const ROUNDS = [
    14,
    13,
    12,
    11,
    10,
    9,
    8,
    7,
    6,
    5
];

export const DEFAULT_MATRIX = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, true, false]
];

export const audioMarkers = {
    roll: { start: 0, end: 0.3 },
    move: { start: 2, end: 2.3 },
    crash: { start: 4, end: 4.3 },
    die: { start: 6, end: 7.6 },
    win: { start: 9, end: 12.6 },
};

export const audioFilename = 'audio/sounds.mp3';
