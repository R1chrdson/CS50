# Questions

## What's `stdint.h`?

### *It is the header file which declares sets of integer types.*

## What's the point of using `uint8_t`, `uint32_t`, `int32_t`, and `uint16_t` in a program?

### *Unsigned int means that first bit won't be used to reverse sign*

## How many bytes is a `BYTE`, a `DWORD`, a `LONG`, and a `WORD`, respectively?

### *BYTE = 1 byte* || *DWORD = 4 byte* || *LONG = 4 byte* || *WORD = 2 byte*

## What (in ASCII, decimal, or hexadecimal) must the first two bytes of any BMP file be? Leading bytes used to identify file formats (with high probability) are generally called "magic numbers."

### *0x424d*

## What's the difference between `bfSize` and `biSize`?

### *bfSize is size of whole file* || *biSize is size of BITMAPINFOHEADER*

## What does it mean if `biHeight` is negative?

### *Negative biHeight means the bitmap is is a top-down DIB with the origin at the upper left corner.*

## What field in `BITMAPINFOHEADER` specifies the BMP's color depth (i.e., bits per pixel)?

### *biBitCount*

## Why might `fopen` return `NULL` in lines 24 and 32 of `copy.c`?

### *The file doesn't exist.*

## Why is the third argument to `fread` always `1` in our code?

### *The third argument to `fread` is number of elements to read. We are reading one RGB triple, so we need 1 element to read.*

## What value does line 65 of `copy.c` assign to `padding` if `bi.biWidth` is `3`?

### *3 pixels * 3 bytes per pixel = 9 and we need additional 3 pixels of padding to get 12 (which is multiple of 4)*

## What does `fseek` do?

### *It's file position indicator which moves "cursor" to correct position (in copy.c this function skips padding)*

## What is `SEEK_CUR`?

### *It's argument to `fseek` which counts from current position of file*

## Whodunit?

### *__It was Professor Plum with the candlestick in the library.__*
