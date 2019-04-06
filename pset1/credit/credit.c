#include <stdio.h>
#include <cs50.h>

int main(void)
{
    long long cardnumber;
    int length;
    bool checksum();
    int checklen();
    int answer();
    cardnumber =  get_long_long("Number:");
    length = checklen(cardnumber); //checking the length of card
    if (length == 13 || length == 15 || length == 16) //if length is normal > check sum of card, else print "INVALID"
    {
        if (checksum(length, cardnumber) == true) //if sum is OK, give an answer
        {
            answer(cardnumber);
        }
        else
        {
            printf("INVALID\n");
        }
    }
    else
    {
        printf("INVALID\n");
    }
}

bool checksum(int length, long long cardnumber) //checks sum of card
{
    int sum = 0;
    for (int i = 0; i < length; ++i, cardnumber /= 10) //each iteration removes last number
    {
        if (i % 2 == 0) //if digit is odd (from last digit of cardnumber)
        {
            sum += (cardnumber % 10);
        }
        else if ((cardnumber % 10) < 5)// else if number need'nt to plus digit to remain
        {
            sum += ((cardnumber % 10) * 2);
        }
        else
        {
            sum += (((cardnumber % 10) * 2) % 10) + (((cardnumber % 10) * 2) / 10);
        }
    }
    if (sum % 10 == 0) // if total sum is correct (divides by 10)
    {
        return true;
    }
    else
    {
        return false;
    }
}

int checklen(long long cardnumber) //gives length of card number
{
    long long number = cardnumber;
    int len = 0;
    while (number > 0)
    {
        number /= 10;
        len++;
    }
    return len;
}

int answer(long long cardnumber) //prints card company
{
    //check 4 for visa
    if ((cardnumber >= 4000000000000 && cardnumber < 5000000000000) || (cardnumber >= 4000000000000000 &&
            cardnumber < 5000000000000000)) // ~~~~~~~~~~~~~~ ASK!!!!!!!! Why style50 needs more tabs ~~~~~~~~~~
    {
        printf("VISA\n");
    }
    //checks 51 52 53 54 55 for mastercard and 34 or 37 for amex
    else if (cardnumber >= 5100000000000000 && cardnumber < 5600000000000000)
    {
        printf("MASTERCARD\n");
    }
    //checks 34 or 37 for amex
    else if ((cardnumber >= 340000000000000 && cardnumber < 350000000000000) || (cardnumber >= 370000000000000 &&
             cardnumber < 380000000000000))
    {
        printf("AMEX\n");
    }
    else
    {
        printf("INVALID\n");
    }
    return 0;
}