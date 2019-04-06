import sys
from cs50 import get_string


if len(sys.argv) != 2:
    print("Usage: caesar.py k")
    sys.exit(1)
key = int(sys.argv[1])
plaintext = get_string("plaintext: ")
print("ciphertext: ", end='')
# after ciphertext we'll write each letter of encrypted text by the loop
for i in range(len(plaintext)):
    ciphertext = plaintext[i]
# There is formula to transform plaintext to ciphertext by key: c = (p + key) % 26;
# We are transforming ASCII code of letter to alphabet index, use formula and then back to ASCII
    if str.isupper(plaintext[i]):
        ciphertext = chr(((ord(plaintext[i]) - ord('A') + key) % 26) + ord('A'))
    elif str.islower(plaintext[i]):
        ciphertext = chr(((ord(plaintext[i]) - ord('a') + key) % 26) + ord('a'))
    print(ciphertext, end='')
print('')