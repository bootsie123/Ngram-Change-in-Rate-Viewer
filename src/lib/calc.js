const funcs = {
  gradient(array) {
    const gradient = [];

    gradient.push(array[1] - array[0]);

    for (let i = 1; i < array.length - 1; i++) {
      gradient.push((array[i + 1] - array[i - 1]) / 2);
    }

    gradient.push(array[array.length - 1] - array[array.length - 2]);

    return gradient;
  },
  factorial(num) {
    if (num <= 1) return 1;

    let total = num;

    for (let i = num - 1; i > 0; i--) {
      total *= i;
    }

    return total;
  },
  async taylorPolynomial(data, iterations = 5000, terms = [], center) {
    if (!center) {
      center = Math.floor(data.length / 2);
    }

    await funcs.taylorPolynomialWorker(data, iterations, terms, center);

    return { center, terms, func: x => funcs.taylorPolynomialEvalutate(x, terms) };
  },
  taylorPolynomialWorker(data, iterations, terms, center) {
    return new Promise(resolve => {
      setImmediate(() => {
        let gradient = data;

        for (let i = terms.length; i < iterations; i++) {
          if (i === 0) {
            terms.push({ index: i, cons: data[center], func: () => data[center] });
          } else {
            gradient = funcs.gradient(gradient);

            const a = gradient[center] / funcs.factorial(i);

            terms.push({ index: i, cons: a, func: x => Math.pow(x - center, i) * a });
          }
        }

        resolve({ terms, gradient });
      });
    });
  },
  taylorPolynomialEvalutate(x, terms) {
    return new Promise(resolve => {
      let total = 0;

      for (let i = 0; i < terms.length; i++) {
        const val = terms[i].func(x);

        if (!isNaN(val) && isFinite(val)) {
          total += val;
        }
      }

      resolve(total);
    });
  }
};

export default funcs;
