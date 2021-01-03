import { useEffect, useState } from "react";

import Bar from "./components/Bar";
import Button from "@material-ui/core/Button";
import MySnackbar from "./components/Snackbar";
import { Typography } from "@material-ui/core";

const DEFAULT_SIZE = 20;
const MIN_VALUE = 50;
const MAX_VALUE = 500;
const DELAY = 10;

const MENU_BUTTONS = ["+", "-", "randomize"];
const SORTING_ALGORITHMS = ["bubble", "selection", "insertion"];

function getRandomInt(lo, hi) {
  lo = Math.ceil(lo);
  hi = Math.floor(hi);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

/**
 * Generate array of random numbers between hi and lo
 * @param {number} len length of array to generate
 * @param {number} lo lower bound, inclusive
 * @param {number} hi upper bound, non-inclusive
 */
function generateRandomArray(len, lo = MIN_VALUE, hi = MAX_VALUE) {
  return Array.from(Array(len), () => ({
    value: getRandomInt(lo, hi),
    selected: false,
    sorted: false,
  }));
}

function swap(array, i, j) {
  const tmp = array[i].value;
  array[i].value = array[j].value;
  array[j].value = tmp;
}

function App() {
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [array, setArray] = useState(() => generateRandomArray(size));
  const [running, setRunning] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [openRandomizeSnackbar, setOpenRandomizeSnackbar] = useState(false);
  const [openWaitSnackbar, setOpenWaitSnackbar] = useState(false);

  useEffect(() => {
    setSorted(false);
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

  function wrapUp() {
    markSorted(0, size);
    setSorted(true);
    setRunning(false);
    setOpenWaitSnackbar(false);
    setTimeout(() => console.log("Finished sorting"), DELAY);
  }

  /**
   * Handle menu buttons
   * @param {string} menuButton name of menu button, e.g. "+" or "randomize"
   */
  function handleMenuButtons(menuButton) {
    if (running) {
      setOpenWaitSnackbar(true);
    } else {
      switch (menuButton) {
        case "+":
          setSize(size + 1);
          break;
        case "-":
          setSize(Math.max(1, size - 1));
          break;
        case "randomize":
          setSorted(false);
          setOpenRandomizeSnackbar(false);
          setArray(generateRandomArray(size));
          break;
        default:
          break;
      }
    }
  }

  /**
   * Handle sorting algorithms
   * @param {string} sortingAlgorithm name of sorting algorithm, e.g. "bubble"
   */
  function handleSortingAlgorithms(sortingAlgorithm) {
    if (running) {
      setOpenWaitSnackbar(true);
    } else if (sorted) {
      setOpenRandomizeSnackbar(true);
    } else {
      console.log(`Running ${sortingAlgorithm} sort`);
      setRunning(true);

      switch (sortingAlgorithm) {
        case "bubble":
          bubbleSort(0, 0, false);
          break;
        case "selection":
          selectionSort(0, 1, 0);
          break;
        case "insertion":
          insertionSort(1, 1);
          break;
        default:
          break;
      }
    }
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
      wrapUp();
    } else if (i === size - j - 1) {
      if (!swapped) {
        wrapUp();
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
      wrapUp();
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
    // Mark first (i + 1) elements sorted because (i + 1)-th element is getting
    // inserted into sorted section.
    markSorted(0, Math.min(i + 1, size));

    if (i === size) {
      wrapUp();
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

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <Typography variant="h3">Size: {size}</Typography>
      </div>

      <MySnackbar
        open={openRandomizeSnackbar}
        setOpen={setOpenRandomizeSnackbar}
        message={"Randomize before attempting another sort"}
      />

      <MySnackbar
        open={openWaitSnackbar}
        setOpen={setOpenWaitSnackbar}
        message={"Please wait for the current sort to finish"}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "flex-end",
          height: `${MAX_VALUE + 10}px`,
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
        <div style={{ margin: "10px" }}>
          {MENU_BUTTONS.map((menuButton) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleMenuButtons(menuButton)}
              key={menuButton}
            >
              {menuButton}
            </Button>
          ))}
        </div>

        <div>
          {SORTING_ALGORITHMS.map((sortingAlgorithm) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSortingAlgorithms(sortingAlgorithm)}
              key={sortingAlgorithm}
            >
              {sortingAlgorithm} sort
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
