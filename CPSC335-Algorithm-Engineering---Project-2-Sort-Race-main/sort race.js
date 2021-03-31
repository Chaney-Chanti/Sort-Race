// CPSC335 Algorithm Engineering - Project 2: Sort Race
// CPSC 335 Algorithm Engineering
// Team CopyPasta: Chaney Chantipaporn, Christopher Ordinario, Ralph, Thomas 

function setup() // p5.js setup function | This will be called once and only once
{
    /* stringToBeSorted will be used as an original copy of the string 
    while the other four strings will be gradually modified by their 
    respective sorting algorithms. When the other four strings are fully 
    sorted, then stringToBeSorted will be changed a bit so that the four 
    sorting algorithms have a new string to sort. 
    SelectionSortHasFinished, poresortHasFinished, and 
    mergesortHasFinished are used to determine if their respective sorting 
    algorithm should be called in draw(). 
    quicksort uses something different: quicksortIntervals. It's an array
    of integers where numbers are pushed and shifted two numbers at a
    time. Each pair of numbers is a pair of indexes that represent
    endpoints of a section of the string that should be quicksorted. */
    stringToBeSorted = SelectionSortString = poresortString = mergesortString = quicksortString = "5F7D8A1593B47B80";
    SelectionSortHasFinished = poresortHasFinished = mergesortHasFinished = false;
    quicksortIntervals = [0, stringToBeSorted.length - 1];

    /* currentRow is used for printing out the results in the specified 
    row. (Note that it starts at row 1 because the algorithm names will be 
    printed at row 0)
    When numberOfIterations is equal to stringToBeSorted.length, the 
    program will come to a complete stop.
    Selection sort and mergesort use numberOfPasses in their own unique 
    ways, which will be described. */
    currentRow = 1;
    numberOfIterations = 0;
    numberOfPasses = 0;
    
    grid = { width: 80, height: stringToBeSorted.length * (stringToBeSorted.length + 1), cellSize: 20 }; // 66 cells wide, a certain amount of cells tall, with each cell being a 20px×20px square

    /* The following variables are mainly used when displaying 
    SelectionSortString, poresortString, mergeSortString, and 
    quicksortString. They help to evenly space out the 4 strings in the 
    canvas. By using the width of the grid, the length of the strings, and 
    the amount of sorting algorithms in this program, we can roughly 
    determine how many empty cells should be between each string. */
    // SelectionSortColumn = 0 * grid.cellSize; // note that SelectionSortColumn simply evaluates to 0
    poresortColumn = Math.round(stringToBeSorted.length + (grid.width - stringToBeSorted.length * 4) / 3); // amount of cells inbetween a pair of strings = (grid.width-string.length*4)/(4-1) ||4 is the amount of sorting algorithms||
    mergesortColumn = Math.round(grid.width - 2 * stringToBeSorted.length - (grid.width - stringToBeSorted.length * 4) / 3);
    quicksortColumn = grid.width - stringToBeSorted.length;

    // Create the canvas by using the grid object
    createCanvas(grid.width * grid.cellSize, grid.height * grid.cellSize); // use the grid object to create a canvas

    // Display the names of the 4 sorting algorithms as well as the string that they will sort just below
    fill(255);
    textSize(22);
    textAlign(LEFT, TOP); // when defining the location of text, we use the northwest corner of the text box
    text("Selection Sort",0,0);
    text("Gold's Poresort", poresortColumn * grid.cellSize, 0);
    text("Mergesort", mergesortColumn * grid.cellSize, 0);
    text("Quicksort", quicksortColumn * grid.cellSize, 0);
    displaySelectionSortString();
    displayPoresortString();
    displayMergesortString();
    displayQuicksortString();
    
    frameRate(2); // draw() will be called 2 times per second
}

function draw() // p5.js draw function | This will be continuously called
{
    ++currentRow; // move on to the next row

    // if all sorting algorithms are done
    if (SelectionSortHasFinished && poresortHasFinished && mergesortHasFinished && !quicksortIntervals.length)
    {
        // if there are still more strings to be sorted
        if (++numberOfIterations < stringToBeSorted.length)
        {
            stringToBeSorted = SelectionSortString = poresortString = mergesortString = quicksortString = rotateRightward(stringToBeSorted);
            SelectionSortHasFinished = poresortHasFinished = mergesortHasFinished = false;
            quicksortIntervals = [0, stringToBeSorted.length - 1];
            numberOfPasses = 0;

            ++currentRow; // skip a row
            // display the new string in each of the four columns
            displaySelectionSortString();
            displayPoresortString();
            displayMergesortString();
            displayQuicksortString();

            return; // get out of the draw() function so that the algorithms don't get a pass through their string immediately after displaying their initial string
        }
        // if there are no more strings to be sorted
        else
            noLoop(); // stop calling the draw() function
    }

    // if a sorting algorithm has not finished, then perform a pass and display the result
    if(!SelectionSortHasFinished)
    {
        SelectionSort();
        displaySelectionSortString();
    }
    if(!poresortHasFinished)
    {
        poresort();
        displayPoresortString();
    }
    if (!mergesortHasFinished)
    {
        mergesort();
        displayMergesortString();
    }
    if (quicksortIntervals.length)
    {
        quicksort();
        displayQuicksortString();
    }
    
    ++numberOfPasses; // all algorithms (minus any that are already finished) have now gotten a pass
}

/*Selection Sort ------------------------------------------------------------------------------------
    The selection sort algorithm sorts an array by repeatedly finding the minimum element 
    (considering ascending order) from unsorted part and putting it at the beginning. 
    The algorithm maintains two subarrays in a given array.

    1) The subarray which is already sorted.
    2) Remaining subarray which is unsorted.

    In every iteration of selection sort, the minimum element (considering ascending order)
     from the unsorted subarray is picked and moved to the sorted subarray.

    Time Complexity of InsertionSort
    Best Case : O(n²) #Means array is already sorted.
    Average Case : O(n²) #Means array with random numbers.
    Worst Case : O(n²) #Means array with descending order.
*/
function SelectionSort()
{
    let n = 16; //length of the array
        
    for(let i = 0; i < n; i++) {
        // Finding the smallest number in the subarray
        let min = i;
        for(let j = i + 1; j < n; j++){
            if(SelectionSortString[j] < SelectionSortString[min]) {
                min = j; 
            }
         }
         if (min != i) {
             // Swapping the elements
            // let tmp = SelectionSortString[i];
            // SelectionSortString[i] =  SelectionSortString[min];
            // SelectionSortString[min] = tmp;      
            swapCharacters(SelectionSortString, SelectionSortString[i], SelectionSortString[min])
        }
    }
    SelectionSortHasFinished = true;
}

/* Gold's poresort ------------------------------------------------------------------------------------

*/
function poresort()
{
    // Before we begin, assume that the string is currently sorted
    poresortHasFinished = true;

    // iterate through each even pair in the string
    for (let index = 0; index + 1 < stringToBeSorted.length; index += 2)
    {
        // If we need to swap characters, then swap characters. And indicate that another iteration of poresort may be necessary.
        if (poresortString[index] > poresortString[index + 1])
        {
            poresortString = swapCharacters(poresortString, index, index + 1);
            poresortHasFinished = false;
        }
    }
    
    // iterate through each odd pair in the string
    for (let index = 1; index + 1 < stringToBeSorted.length; index += 2)
    {
        // If we need to swap characters, then swap characters. And indicate that another iteration of poresort may be necessary.
        if (poresortString[index] > poresortString[index + 1])
        {
            poresortString = swapCharacters(poresortString, index, index + 1);
            poresortHasFinished = false;
        }
    }
}

/* Mergesort ------------------------------------------------------------------------------------
    Merge Sort: One of the best sorting technique. If n value is large, it follows divide 
    and conquer approach. Like QuickSort, Merge Sort is a Divide and Conquer algorithm. 
    It divides input array in two halves, calls itself for the two halves and then merges the two sorted halves. 
    The merge() function is used for merging two halves.

    Time Complexity :
    Best Case : O(nlogn) #Means array is already sorted.
    Average Case : O(nlogn) #Means array with random numbers.
    Worst Case : O(nlogn) #Means array with descending order.
*/
function mergesort()
{
    // initialize some variables
    let currentIndexOfFirstSublist = currentIndexOfSecondSublist = endOfFirstSublist = endOfSecondSublist = 0;
    let updatedMergesortString = "";
    // Note: sublistSize isn't explicitly defined here, but it is 2 ** numberOfPasses. So 2 * 2 ** numberOfPasses is the total size of two sublists

    for (let index = 0; index < stringToBeSorted.length; index += 2 * 2 ** numberOfPasses)
    {
        // set the current indexes of the two sublists to the start of their list
        currentIndexOfFirstSublist = index;
        currentIndexOfSecondSublist = index + 2 ** numberOfPasses;
        // if the first sublist doesn't have a second sublist to compare characters against, then simply append the characters in the first sublist to the updated mergesort string
        if (currentIndexOfSecondSublist >= stringToBeSorted.length)
        {
            while (currentIndexOfFirstSublist < stringToBeSorted.length)
                updatedMergesortString += mergesortString[currentIndexOfFirstSublist++];
            break;
        }

        // set the end of the two sublists
        endOfFirstSublist = currentIndexOfSecondSublist - 1;
        if (currentIndexOfSecondSublist + 2 ** numberOfPasses - 1 < stringToBeSorted.length) // if the end of the second sublist is not out-of-bounds, then don't change it
            endOfSecondSublist = currentIndexOfSecondSublist + 2 ** numberOfPasses - 1;
        else // otherwise, if the end of the second sublist is out-of-bounds, then set the end of the second sublist to the very end of the string
            endOfSecondSublist = stringToBeSorted.length - 1;
        
        // while both the first sublist isn't depleted and the second sublist isn't depleted
        while (currentIndexOfFirstSublist <= endOfFirstSublist && currentIndexOfSecondSublist <= endOfSecondSublist)
        {
            // if the current character in the first sublist is smaller, add that to the updated mergesort string
            if(mergesortString[currentIndexOfFirstSublist] <= mergesortString[currentIndexOfSecondSublist])
            {
                updatedMergesortString += mergesortString[currentIndexOfFirstSublist++]; // after this statement is executed, the "++" operator updates the first sublist's current character (the "++" operator is used like this a few more times)

                // if popping that character depleted the first sublist
                if (currentIndexOfFirstSublist > endOfFirstSublist)
                {
                    // append what's left of the second sublist to the updated mergesort string
                    while(currentIndexOfSecondSublist <= endOfSecondSublist)
                        updatedMergesortString += mergesortString[currentIndexOfSecondSublist++];
                }
            }
            // if the current character in the second sublist is smaller, add that to the updated mergesort string
            else
            {
                updatedMergesortString += mergesortString[currentIndexOfSecondSublist++];
                
                // if popping that character depleted the second sublist
                if (currentIndexOfSecondSublist > endOfSecondSublist)
                {
                    // append what's left of the second sublist to the updated mergesort string
                    while(currentIndexOfFirstSublist <= endOfFirstSublist)
                        updatedMergesortString += mergesortString[currentIndexOfFirstSublist++];
                }
            }
        }
    }

    // replace the old string with the updated mergesort string
    mergesortString = updatedMergesortString;

    // check if we're done
    if(2 * 2 ** numberOfPasses >= stringToBeSorted.length) // if the next sublist size will be larger than the string itself
        mergesortHasFinished = true;
}

/* Quicksort ------------------------------------------------------------------------------------
    Quick Sort: This is the best sort Technique. QuickSort is a Divide and Conquer algorithm. 
    It picks an element as pivot and partitions the given array around the picked pivot. 
    There are many different versions of quickSort that pick pivot in different ways.

    Always pick first element as pivot.
    Always pick last element as pivot
    Pick a random element as pivot.
    Pick median as pivot.

    Time Complexity :
    Best Case : O(nlogn) #Means array is already sorted.
    Average Case : O(nlogn) #Means array with random numbers.
    Worst Case : O(n^2) #Means array with descending order.
*/
    function quicksort()
{
    // iterate through each interval we have in the quicksortIntervals array, saving any and all newly-generated intervals for another pass
    for (let intervals = quicksortIntervals.length / 2; intervals > 0; --intervals)
    {
        // beginning and end are constant variables and are used when generating further sublists
        const beginning = i = quicksortIntervals.shift(); // beginning is also the pivot in this case
        const end = j = quicksortIntervals.shift();
        
        do
        {
            ++i; // step to the right (incrementing i before doing anything will cause i to first start at the second character (the character after pivot) similar to Selection sort)

            // if i has passed j, then swap pivot and j, and generate the two sublists
            if (i > j)
            {
                quicksortString = swapCharacters(quicksortString, beginning, j);
                break; // break out of the do-while loop so we can get to generating the sublists
            }
            // if i has found a large character to swap over, then pass control over to j
            if (quicksortString[i] > quicksortString[beginning])
            {
                while (true) // while j is in bounds
                {
                    // if j has passed i, then swap pivot and j, and generate the two sublists
                    if(j < i)
                    {
                        quicksortString = swapCharacters(quicksortString, beginning, j);
                        i = end + 1; // this is so we can also get out of the do-while loop
                        break; // break out of the while loop so we can get out of the do-while loop so we can get to generating the sublists
                    }
                    // if j has found a small character to swap over, then swap i and j, and pass control back over to i
                    if (quicksortString[j] < quicksortString[beginning])
                    {
                        quicksortString = swapCharacters(quicksortString, i, j);
                        break; // break out of the while loop so we can pass control back over to i
                    }
                    --j; // step to the left
                }
            }
        } while (i <= end); // while i is in bounds (The only reason why this isn't true as well is because I need a way to break out of this do-while loop from inside a nested while loop. I suppose I could try using labels...)

        // if the left sublist has more than 1 character, push it on the quicksortIntervals queue
        if (beginning < j - 1)
        {
            quicksortIntervals.push(beginning);
            quicksortIntervals.push(j - 1);
        }

        // if the right sublist has more than 1 character, push it on the quicksortIntervals queue
        if (j + 1 < end)
        {
            quicksortIntervals.push(j + 1);
            quicksortIntervals.push(end);
        }
    }
}

/* Displays the current progress of Selection sort in the leftmost column 
in the canvas. */
function displaySelectionSortString()
{
    for (let index = 0; index < stringToBeSorted.length; ++index)
        text(SelectionSortString[index], index * grid.cellSize, currentRow * grid.cellSize);
}

/* Displays the current progress of Gold's poresort in the second column 
to the left in the canvas. */
function displayPoresortString()
{
    for (let index = 0; index < stringToBeSorted.length; ++index)
        text(poresortString[index], (poresortColumn + index) * grid.cellSize, currentRow * grid.cellSize);
}

/* Displays the current progress of mergesort in the second column to the 
right in the canvas. */
function displayMergesortString()
{
    for (let index = 0; index < stringToBeSorted.length; ++index)
        text(mergesortString[index], (mergesortColumn + index) * grid.cellSize, currentRow * grid.cellSize);
}

/* Displays the current progress of quicksort in the rightmost column in 
the canvas. */
function displayQuicksortString()
{
    for (let index = 0; index < stringToBeSorted.length; ++index)
        text(quicksortString[index], (quicksortColumn + index) * grid.cellSize, currentRow * grid.cellSize);
}



/* This function will swap the characters at indexes a and b. If a and b 
both refer to the same spot in the string, then myString will simply be 
returned as-is. */
function swapCharacters(myString, a, b)
{
    if(a == b) return myString; // this is necessary, because otherwise, the returned string will be an extra character long, which really throws the program off

    return myString.substring(0, a) + myString[b] + myString.substring(a + 1, b) + myString[a] + myString.substring(b + 1); // left of a + b + inbetween a and b + a + right of b
}

/* This function will create a new string out of myString by taking the 
last character of myString, and moving it to the beginning of myString. */
function rotateRightward(myString)
{
    return myString[myString.length - 1] + myString.substring(0, myString.length - 1);
}