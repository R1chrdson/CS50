import sys
from cs50 import get_string


if len(sys.argv) != 2:
    print("Usage: caesar.py key")
    sys.exit(1)
elif not str.isalpha(sys.argv[1]):
    print("Use only alphabetical characters")
    sys.exit(1)

key = sys.argv[1]
plaintext = get_string("plaintext: ")
print("ciphertext: ", end='')
# j is a counter of key letters
j = 0
# after ciphertext we'll write each letter of encrypted text by the loop
for i in range(len(plaintext)):
    ciphertext = plaintext[i]
# There is formula to transform plaintext to ciphertext by key: c = (p + key) % 26;
# We are transforming ASCII code of letter to alphabet index, use formula and then back to ASCII
    if str.isupper(plaintext[i]):
        ciphertext = chr((((ord(plaintext[i]) - ord('A')) + (ord(str.upper(key[j % len(key)])) - ord('A'))) % 26) + ord('A'))
        j += 1
    elif str.islower(plaintext[i]):
        ciphertext = chr((((ord(plaintext[i]) - ord('a')) + (ord(str.upper(key[j % len(key)])) - ord('A'))) % 26) + ord('a'))
        j += 1
    print(ciphertext, end='')
print('')