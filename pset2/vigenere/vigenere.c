#include <stdio.h>
#include <cs50.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

bool checkalpha(string check) //this function checks isalpha are each letter from argv[1]
{
    for (int i = 0; i < strlen(check); i++)
    {
        if (!isalpha(check[i]))
        {
            return 1;
        }
    }
    return 0;
}

int main(int argc, string argv[])
{
    if (argc != 2 && checkalpha(argv[1]))
    {
        printf("Usage: ./caesar k\n");
        return 1;
    }
    string key = argv[1];
    string plaintext = get_string("plaintext: ");
    printf("ciphertext: ");
    //after ciphertext we'll write each letter of encrypted text by the loop
    for (int i = 0, j = 0; i < strlen(plaintext); i++, j++)
    {
        char ciphertext = plaintext[i]; //We'll write new character in this variable
        if (isalpha(plaintext[i]))
        {
            if (isupper(plaintext[i]))
            {
                ciphertext = (((plaintext[i] - 65) + (toupper(key[j % strlen(key)]) - 65)) % 26) + 65;
                //There is formula to transform plaintext to ciphertext by key: c = (p[i] + key[j]) % 26;
                //We are transforming ASCII code of letter to alphabet index, use formula and then back to ASCII
            }
            if (islower(plaintext[i]))
            {
                ciphertext = (((plaintext[i] - 97) + (toupper(key[j % strlen(key)]) - 65)) % 26) + 97;
                //We are using this formula again but for lowercase letter
            }
        }
        else //if number is non alphabetic, then we'll back by one letter in key
        {
            j--;
        }
        printf("%c", ciphertext);
    }
    printf("\n");
    return 0; //is it necessary?
}