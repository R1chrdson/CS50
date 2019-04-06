//Second version of my programm which uses loop for checking nominal
#include <stdio.h>
#include <cs50.h>
#include <math.h>

int main(void)
{
    float input;
    int coins;
    int counter = 0; //initalizating counter
    int nominal[] = {25, 10, 5, 1};
    //check the correct input
    do
    {
        input = get_float("Change owed:");
    }
    while (input < 0);
    coins = round(input * 100); //Get amount of money in coins from float
    //Count number of coins
    for (int i = 0; i < 4; i++)
    {
        while (coins >= nominal[i])
        {
            coins -= nominal[i];
            counter++;
        }
    }
    printf("%i\n", counter);
}