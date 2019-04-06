#include <stdio.h>
#include <cs50.h>

int main(void)
{
    int height;
    //Check the correct input
    do
    {
        height = get_int("Height:");
    }
    while (height < 0 || height > 23);
    //i - rows counter, s- spaces counter, b - sharps counter
    for (int i = 0; i < height; ++i)
    {
        for (int s = 1; s < height - i; ++s) //Number of spaces = height - 1 - row
        {
            printf(" ");
        }
        for (int b = 0; b <= i + 1; ++b) //Number of sharps = row + 1
        {
            printf("#");
        }
        printf("\n");
    }
}