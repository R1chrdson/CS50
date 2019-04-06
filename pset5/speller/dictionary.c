// Implements a dictionary's functionality

#include "dictionary.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

//
#define HASH_MAX 65501
int counter = 0;


typedef struct node
{
    char word[LENGTH + 1];
    struct node *next;
}
node;
node *hashTable[HASH_MAX];

//hash function
int hash(char *word)
{
    unsigned int sum = 0;
    for (int i = 0; word[i] != '\0'; ++i)
    {
        // this formula for noncollisional hash
        sum = (sum << 2) ^ word[i];
        // example on word abc
        // 1'st iteration: sum = (0 << 2) ^ 97
        //                       00000000  01100001
        //           result = 97 // 01100001
        //
        // 2'nt iteration: sum = (97 << 2) ^ 98
        //                       110000100  01100010
        //           result = 486 //  111100110
        //
        // 3'rd iteration: sum = (486 << 2) ^ 99
        //                      11110011000  01100011
        //           result = 2043    // 11111111011
    }
    return sum % HASH_MAX;
}

// Returns true if word is in dictionary else false
bool check(const char *word)
{
    // crete copy of word
    int len = strlen(word);
    char wordCopy[len + 1];

    // convert word to lowercase
    for (int i = 0; i < len; i++)
    {
        wordCopy[i] = tolower(word[i]);
    }

    // add null to end of char array
    wordCopy[len] = '\0';

    // get hash bucket
    int h = hash(wordCopy);

    // create cursor for first node
    node *cursor = hashTable[h];

    // check until the end of the linked list
    while (cursor)
    {
        if (strcmp(cursor->word, wordCopy) == 0)
        {
            return true;
        }
        else
        {
            cursor = cursor->next;
        }
    }
    return false;

}

// Loads dictionary into memory, returning true if successful else false
bool load(const char *dictionary)
{
    FILE *file = fopen(dictionary, "r");
    if (!file)
    {
        fprintf(stderr, "File does not exist\n");
        return false;
    }
    while (true)
    {
        //malloc a node
        node *newNode = malloc(sizeof(node));
        if (!newNode)
        {
            printf("Can't malloc a new node\n");
            return false;
        }
        //read a word from the file
        fscanf(file, "%s", newNode->word);
        newNode->next = NULL;

        if (feof(file))
        {
            free(newNode);
            break;
        }
        //by the way we will count the words
        counter++;

        //pointer to hashed value
        int h = hash(newNode->word);
        node *head = hashTable[h];

        //if bucket is empty insert first node
        if (!head)
        {
            hashTable[h] = newNode;
        }
        //else insert to the front of list
        else
        {
            newNode->next = hashTable[h];
            hashTable[h] = newNode;
        }
    }
    fclose(file);
    return true;
}

// Returns number of words in dictionary if loaded else 0 if not yet loaded
unsigned int size(void)
{
    return counter;
}

// Unloads dictionary from memory, returning true if successful else false
bool unload(void)
{
    for (int i = 0; i < HASH_MAX; ++i)
    {
        node *cursor = hashTable[i];
        while (cursor)
        {
            node *tmp = cursor;
            cursor = cursor->next;
            free(tmp);
        }
    }
    return true;
}
