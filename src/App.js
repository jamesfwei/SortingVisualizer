import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Bar from "./components/Bar";

const DEFAULT_SIZE = 10;
const DEFAULT_MIN_VALUE = 50;
const DEFAULT_MAX_VALUE = 500;
const DELAY = 1000;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function swap(array, i, j) {
  const tmp = array[i].value;
  array[i].value = array[j].value;
  array[j].value = tmp;
}

function App() {
  function generateRandomArray(arrLength) {
    const arr = new Array(arrLength);

    for (let i = 0; i < arrLength; i++) {
      arr[i] = {
        value: getRandomInt(DEFAULT_MIN_VALUE, DEFAULT_MAX_VALUE),
        selected: false,
        sorted: false,
      };
    }

    return arr;
  }

  const [size, setSize] = useState(DEFAULT_SIZE);
  const [array, setArray] = useState(() => generateRandomArray(size));
  // const [test, setTest] = useState([]);
  // const [count, setCount] = useState(0);

  useEffect(() => {
    setArray(generateRandomArray(size));
  }, [size]);

  function unselectAll() {
    const newArray = [...array];
    newArray.forEach((o) => {
      o.selected = false;
    });
    setArray(newArray);
  }

  function markSorted(lo, hi) {
    const newArray = [...array];
    for (let i = lo; i < hi; i++) {
      newArray[i].sorted = true;
    }
    setArray(newArray);
  }

  /**
   * Bubble sort
   * @param i index to check for swapping with neighbor to the right
   * @param j number of completed passes
   * @param swapped boolean whether we have performed a swap yet for the current pass
   */
  function bubbleSort(i, j, swapped) {
    unselectAll();
    markSorted(size - j, size);

    if (j === size - 1) {
      markSorted(0, size);
      setTimeout(() => console.log("Finished sorting"), DELAY);
    } else if (i === size - j - 1) {
      if (!swapped) {
        markSorted(0, size);
        setTimeout(() => console.log("Finished sorting"), DELAY);
      } else {
        bubbleSort(0, j + 1, false);
      }
    } else {
      const newArray = [...array];

      if (newArray[i].value > newArray[i + 1].value) {
        swapped = true;
        swap(newArray, i, i + 1);
      }

      newArray[i].selected = true;
      newArray[i + 1].selected = true;

      setArray(newArray);
      setTimeout(() => bubbleSort(i + 1, j, swapped), DELAY);
    }
  }

  /**
   * Selection sort
   * @param {number} i number of sorted elements
   * @param {number} j index to check if less than the minimum value
   * @param {number} minIndex index of minimum value from index i to end
   */
  function selectionSort(i, j, minIndex) {
    unselectAll();
    markSorted(0, i);

    if (i === size - 1) {
      markSorted(0, size);
      setTimeout(() => console.log("Finished sorting"), DELAY);
    } else if (j === size) {
      // Swap
      const newArray = [...array];
      swap(newArray, i, minIndex);

      // Mark selected values
      newArray[i].selected = true;
      newArray[minIndex].selected = true;

      // Call next iteration of selection sort after delay
      setArray(newArray);
      setTimeout(() => selectionSort(i + 1, i + 2, i + 1), DELAY);
    } else {
      const newArray = [...array];
      newArray[j].selected = true;
      newArray[minIndex].selected = true;
      setArray(newArray);
      const newMinIndex =
        newArray[j].value < newArray[minIndex].value ? j : minIndex;
      setTimeout(() => selectionSort(i, j + 1, newMinIndex), DELAY);
    }
  }

  /**
   * Insertion sort
   * @param {number} i number of sorted elements
   * @param {number} j index of element currently being inserted
   */
  function insertionSort(i, j) {
    unselectAll();
    markSorted(0, i);

    if (i === size) {
      markSorted(0, size);
      setTimeout(() => console.log("Finished sorting"), DELAY);
    } else if (j === 0) {
      insertionSort(i + 1, i + 1);
    } else {
      const newArray = [...array];
      newArray[j].selected = true;
      newArray[j - 1].selected = true;

      if (newArray[j].value < newArray[j - 1].value) {
        swap(newArray, j, j - 1);
        setArray(newArray);
        setTimeout(() => insertionSort(i, j - 1), DELAY);
      } else {
        setArray(newArray);
        setTimeout(() => insertionSort(i + 1, i + 1), DELAY);
      }
    }
  }

  // function addElement() {
  //   const newTest = [...test];
  //   newTest.push(100);
  //   setTest((test) => newTest);
  // }

  // function increment() {
  //   setCount((count) => count + 1);
  // }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          height: `${DEFAULT_MAX_VALUE} + 10`,
        }}
      >
        {array.map((value, idx) => (
          <Bar
            value={value.value}
            selected={value.selected}
            sorted={value.sorted}
            key={idx}
          />
        ))}
      </div>

      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSize((size) => size + 1)}
        >
          Increase size
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setArray(generateRandomArray(size))}
        >
          Randomize
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => bubbleSort(0, 0, false)}
        >
          Bubble sort
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => selectionSort(0, 1, 0)}
        >
          Selection sort
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => insertionSort(1, 1)}
        >
          Insertion sort
        </Button>

        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => {
            addElement();
            addElement();
          }}
        >
          Add element
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            increment();
            increment();
          }}
        >
          Increment count
        </Button> */}

        {/* <h1>{test.length}</h1>
        <h1>Count: {count}</h1> */}
      </div>
    </div>
  );
}

export default App;
