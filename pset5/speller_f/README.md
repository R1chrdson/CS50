# Questions

## What is pneumonoultramicroscopicsilicovolcanoconiosis?

It's the longes word in large dictionary, used as constant max length of the word

## According to its man page, what does `getrusage` do?

`getrusage` is the function which gets resource usage. We are using this function to calculate program processing time

## Per that same man page, how many members are in a variable of type `struct rusage`?

There are 16 members:
   struct timeval ru_utime; /* user CPU time used */
   struct timeval ru_stime; /* system CPU time used */
   long   ru_maxrss;        /* maximum resident set size */
   long   ru_ixrss;         /* integral shared memory size */
   long   ru_idrss;         /* integral unshared data size */
   long   ru_isrss;         /* integral unshared stack size */
   long   ru_minflt;        /* page reclaims (soft page faults) */
   long   ru_majflt;        /* page faults (hard page faults) */
   long   ru_nswap;         /* swaps */
   long   ru_inblock;       /* block input operations */
   long   ru_oublock;       /* block output operations */
   long   ru_msgsnd;        /* IPC messages sent */
   long   ru_msgrcv;        /* IPC messages received */
   long   ru_nsignals;      /* signals received */
   long   ru_nvcsw;         /* voluntary context switches */
   long   ru_nivcsw;        /* involuntary context switches */

## Why do you think we pass `before` and `after` by reference (instead of by value) to `calculate`, even though we're not changing their contents?

To avoid making copies of value and optimize time of calculating.

## Explain as precisely as possible, in a paragraph or more, how `main` goes about reading words from a file. In other words, convince us that you indeed understand how that function's `for` loop works.

It reads each character untill reaches EOF. It checks for is alphabetical or '\''. Also we use LENGTH to cut off all 'words' which is longer that the longest word in the dictionary. It checks to digits in the 'words' and adding terminator in the end.

## Why do you think we used `fgetc` to read each word's characters one at a time rather than use `fscanf` with a format string like `"%s"` to read whole words at a time? Put another way, what problems might arise by relying on `fscanf` alone?

If we will use fscanf to read whole words, it can cause to segmentation fault. Also `fsacnf` will read numbers and punctuation characters, so we won't get the correct word.

## Why do you think we declared the parameters for `check` and `load` as `const` (which means "constant")?

We are using const to avoid changing of words at the dictionary and text's words.
