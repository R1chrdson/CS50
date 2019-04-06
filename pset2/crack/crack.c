#define _XOPEN_SOURCE
#include <unistd.h>
#include <cs50.h>
#include <stdio.h>
#include <string.h>

#define HASH argv[1] //to simplify argv[1] is our hash input

int main(int argc, string argv[])
{
    if (argc != 2)
    {
        printf("Usage: ./crack hash\n");
        return 1;
    }
    string alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    string gHash; // our generated hash
    char key[6];
    //brutting first letter
    key[1] = '\0';
    for (int i = 0; i < 52; i++)
    {
        key[0] = alphabet[i];
        gHash = crypt(key, HASH);
        //if I'll use hash in argument salt, I needn't use additional variable to define salt
        if (strcmp(gHash, HASH) == 0)
        {
            printf("%s\n", key);
            return 0;
        }
    }
    //brutting second letter
    key[2] = '\0';
    for (int i = 0; i < 52; i++)
    {
        key[0] = alphabet[i];
        for (int j = 0; j < 52; j++)
        {
            key[1] = alphabet[j];
            gHash = crypt(key, HASH);
            //if I'll use hash in argument salt, I needn't use additional variable to define salt
            if (strcmp(gHash, HASH) == 0)
            {
                printf("%s\n", key);
                return 0;
            }
        }
    }
    //brutting third letter
    key[3] = '\0';
    for (int i = 0; i < 52; i++)
    {
        key[0] = alphabet[i];
        for (int j = 0; j < 52; j++)
        {
            key[1] = alphabet[j];
            for (int k = 0; k < 52; k++)
            {
                key[2] = alphabet[k];
                gHash = crypt(key, HASH);
                //if I'll use hash in argument salt, I needn't use additional variable to define salt
                if (strcmp(gHash, HASH) == 0)
                {
                    printf("%s\n", key);
                    return 0;
                }
            }
        }
    }
    //brutting fourth letter
    key[4] = '\0';
    for (int i = 0; i < 52; i++)
    {
        key[0] = alphabet[i];
        for (int j = 0; j < 52; j++)
        {
            key[1] = alphabet[j];
            for (int k = 0; k < 52; k++)
            {
                key[2] = alphabet[k];
                for (int m = 0; m < 52; m++)
                {
                    key[3] = alphabet[m];
                    gHash = crypt(key, HASH);
                    if (strcmp(gHash, HASH) == 0)
                    {
                        //if I'll use hash in argument salt, I needn't use additional variable to define salt
                        printf("%s\n", key);
                        return 0;
                    }
                }
            }
        }
    }
    //brutting fifth letter
    key[5] = '\0';
    for (int i = 0; i < 52; i++)
    {
        key[0] = alphabet[i];
        for (int j = 0; j < 52; j++)
        {
            key[1] = alphabet[j];
            for (int k = 0; k < 52; k++)
            {
                key[2] = alphabet[k];
                for (int m = 0; m < 52; m++)
                {
                    key[3] = alphabet[m];
                    for (int n = 0; n < 52; n++)
                    {
                        key[4] = alphabet[n];
                        gHash = crypt(key, HASH);
                        if (strcmp(gHash, HASH) == 0)
                        {
                            //if I'll use hash in argument salt, I needn't use additional variable to define salt
                            printf("%s\n", key);
                            return 0;
                        }
                    }
                }
            }
        }
    }
    //if password combination is not cracked, then
    printf("Password not cracked\n");
}