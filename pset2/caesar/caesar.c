#include <stdio.h>
#include <cs50.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

int main(int argc, string argv[])
{
    if (argc != 2)
    {
        printf("Usage: ./caesar k\n");
        return 1;
    }
    int key = atoi(argv[1]);
    string plaintext = get_string("plaintext: ");
    printf("ciphertext: ");
    //after ciphertext we'll write each letter of encrypted text by the loop
    for (int i = 0; i < strlen(plaintext); i++)
    {
        char ciphertext = plaintext[i]; //We'll write new character in this variable
        if (isalpha(plaintext[i]))
        {
            if (isupper(plaintext[i]))
            {
                ciphertext = (((plaintext[i] - 65) + key) % 26) + 65;
                //There is formula to transform plaintext to ciphertext by key: c = (p + key) % 26;
                //We are transforming ASCII code of letter to alphabet index, use formula and then back to ASCII
            }
            if (islower(plaintext[i]))
            {
                ciphertext = (((plaintext[i] - 97) + key) % 26) + 97;
                //We are using this formula again but for lowercase letter
            }
        }
        printf("%c", ciphertext);
    }
    printf("\n");
    return 0; //is it necessary?
}