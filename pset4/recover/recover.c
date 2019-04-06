#include <stdio.h>
#include <stdint.h>

int main(int argc, char *argv[])
{
    // checking number of arguments
    if (argc != 2)
    {
        fprintf(stderr, "Usage: ./recover image\n");
        return 1;
    }

    // reading raw file
    char *infile = argv[1];
    FILE *file = fopen(infile, "r");

    // if file doesn't exist
    if (file == NULL)
    {
        fprintf(stderr, "Could not open %s\n", infile);
        return 2;
    }

    // create the buffer
    uint8_t buffer[512];
    FILE *jpg = NULL;
    int counter = 0;
    // read 512 bytes untill reach EOF
    while (fread(buffer, 1, 512, file))
    {
        //What does in mean? "buffer[3] & 0xf0) == 0xe0" < syntax??? sense???
        if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
        {
            // close pervious file if it exist
            if (jpg) // it will return false if it doesnt exist
            {
                fclose(jpg);
            }
            //open new file
            char filename[8];
            sprintf(filename, "%03i.jpg", counter);
            counter++;
            jpg = fopen(filename, "w");
        }
        if (jpg)
        {
            fwrite(buffer, 1, 512, jpg);
        }
    }
    //close all files
    fclose(jpg);
    fclose(file);
}