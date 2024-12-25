import { MaskitoOptions } from '@maskito/core';

export const kenyaPhoneMask: MaskitoOptions = {
  mask: [
    '+',
    '2',
    '5',
    '4',
    ' ',
    /[17]/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
  ],
  preprocessors: [
    // Remove any non-digit characters except '+'
    (value) => ({
      ...value,
      data: value.data.replace(/[^\d+]/g, ''),
    }),
  ],
};
