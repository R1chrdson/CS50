import crypt
import sys
import string

key = ''

def crack(i, HASH):
    global key
    key = key + i
    gHash = crypt.crypt(key, sys.argv[1])
    if gHash == HASH:
        print(key)
        sys.exit(0)
    if len(key) > 5:
        break;
    for i in string.ascii_letters:
        crack(key, HASH)


if len(sys.argv) != 2:
    print("Usage: ./crack hash")
    sys.exit(1)


for i in string.ascii_letters:
    crack(i, sys.argv[1])
    print("Password not cracked")

