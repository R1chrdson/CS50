#include <stdio.h>
#include <cs50.h>
#include <math.h>

int main(void)
{
    float input;
    int coins;
    int counter = 0; //initalizating counter
    //check the correct input
    do
    {
        input = get_float("Change owed:");
    }
    while (input < 0);
    coins = round(input * 100); //Get coins from float
    //Count number of coins
    while (coins >= 25)
    {
        coins -= 25;
        counter++;
    }
    while (coins >= 10)
    {
        coins -= 10;
        counter++;
    }
    while (coins >= 5)
    {
        coins -= 5;
        counter++;
    }
    while (coins >= 1)
    {
        coins--;
        counter++;
    }
    printf("%i\n", counter);
}