export default {
  gradient(array) {
    const gradient = [];

    gradient.push(array[1] - array[0]);

    for (let i = 1; i < array.length - 1; i++) {
      gradient.push((array[i + 1] - array[i - 1]) / 2);
    }

    gradient.push(array[array.length - 1] - array[array.length - 2]);

    return gradient;
  }
};
