
export const textToLeft = {
  hidden: {
    x: -100,
    opacity: 0,
  },
  visible: (custom: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: 0.2 * custom },
  }),
};

export const popUpButton = {
  hidden: {
    scale: 0.5,
    opacity: 0,
  },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.2 * custom,
    },
  }),
};

export const popUpLong = {
  hidden: {
    scale: 0.2,
    opacity: 0,
  },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.2 * custom,
    },
  }),
};
