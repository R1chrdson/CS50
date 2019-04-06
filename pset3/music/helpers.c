// Helper functions for music

#include <cs50.h>
#include "helpers.h"
#include <string.h>
#include <math.h>

// Converts a fraction formatted as X/Y to eighths
int duration(string fraction)
{
    int numerator = fraction[0] - '0';
    int denominator = fraction[2] - '0';
    while (denominator != 8) //Equivalent fractions
    {
        denominator *= 2;
        numerator *= 2;
    }
    return numerator; //If my denominator == 8, numerator is a quantity of eighths
}

// Calculates frequency (in Hz) of a note
int frequency(string note)
{
    int len = strlen(note);
    string notesArrayS[12] = {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"};
    string notesArrayB[12] = {"C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"};
    int octave = note[len - 1] - '0';
    note[len - 1] = '\0';
    float result;
    int notePos;
    for (int i = 0; i < 12; i++)
    {
        if ((strcmp(note, notesArrayS[i]) == 0) || (strcmp(note, notesArrayB[i]) == 0))
        {
            notePos = i - 9;
            result = 440 * powf(2, notePos / 12.);
        }
    }
    result *= pow(2, octave - 4);
    return round(result);
}

// Determines whether a string represents a rest
bool is_rest(string s)
{
    //get_string returns "" if line is empty, so
    if (strcmp(s, "") == 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}
