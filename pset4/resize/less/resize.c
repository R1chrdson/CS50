// Copies a BMP file

#include <stdio.h>
#include <stdlib.h>

#include "bmp.h"

int main(int argc, char *argv[])
{
    // remember filenames
    char *infile = argv[2];
    char *outfile = argv[3];

    // scale
    int n = atoi(argv[1]);

    // open input file
    FILE *inptr = fopen(infile, "r");

    // open output file
    FILE *outptr = fopen(outfile, "w");

    // check correct input
    if (argc != 4 || n < 0 || n > 100 || inptr == NULL || outptr == NULL)
    {
        fprintf(stderr, "Usage: ./resize n infile outfile\n");
        return 1;
    }

    // read infile's BITMAPFILEHEADER
    BITMAPFILEHEADER bf;
    fread(&bf, sizeof(BITMAPFILEHEADER), 1, inptr);

    // read infile's BITMAPINFOHEADER
    BITMAPINFOHEADER bi;
    fread(&bi, sizeof(BITMAPINFOHEADER), 1, inptr);

    // ensure infile is (likely) a 24-bit uncompressed BMP 4.0
    if (bf.bfType != 0x4d42 || bf.bfOffBits != 54 || bi.biSize != 40 ||
        bi.biBitCount != 24 || bi.biCompression != 0)
    {
        fclose(outptr);
        fclose(inptr);
        fprintf(stderr, "Unsupported file format.\n");
        return 4;
    }

    // Modify headers
    BITMAPFILEHEADER new_bf = bf;
    BITMAPINFOHEADER new_bi = bi;
    new_bi.biWidth *= n;
    new_bi.biHeight *= n;

    // padding for new file
    int new_padding = (4 - (new_bi.biWidth * sizeof(RGBTRIPLE)) % 4) % 4;

    new_bi.biSizeImage = ((sizeof(RGBTRIPLE) * new_bi.biWidth) + new_padding) * abs(new_bi.biHeight);
    new_bf.bfSize = new_bi.biSizeImage + sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER);

    // write outfile's BITMAPFILEHEADER
    fwrite(&new_bf, sizeof(BITMAPFILEHEADER), 1, outptr);

    // write outfile's BITMAPINFOHEADER
    fwrite(&new_bi, sizeof(BITMAPINFOHEADER), 1, outptr);

    // determine padding for scanlines
    int padding = (4 - (bi.biWidth * sizeof(RGBTRIPLE)) % 4) % 4;

    // iterate over infile's scanlines
    for (int i = 0, biHeight = abs(bi.biHeight); i < biHeight; i++)
    {
        // make line n times
        for (int repeat = 0; repeat < n; repeat++)
        {
            // iterate over pixels in scanline
            for (int j = 0; j < bi.biWidth; j++)
            {
                // temporary storage
                RGBTRIPLE triple;

                // read RGB triple from infile
                fread(&triple, sizeof(RGBTRIPLE), 1, inptr);

                // repeat writing each pixel n times
                for (int r = 0; r < n; r++)
                {
                    // write RGB triple to outfile
                    fwrite(&triple, sizeof(RGBTRIPLE), 1, outptr);
                }
            }

            // skip over padding, if any
            fseek(inptr, padding, SEEK_CUR);

            // padding for the new file
            for (int k = 0; k < new_padding; k++)
            {
                fputc(0x00, outptr);
            }

            // send infile cursor back
            if (repeat < n - 1)
            {
                fseek(inptr, -(bi.biWidth * 3 + padding), SEEK_CUR);
            }
        }
    }

    // close infile
    fclose(inptr);

    // close outfile
    fclose(outptr);

    // success
    return 0;
}
