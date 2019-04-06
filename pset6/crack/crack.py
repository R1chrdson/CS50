import crypt
import sys
import string

# checking for second argument
if len(sys.argv) != 2:
    print("Usage: ./crack hash")
    sys.exit(1)

# I'm sure there is better way to solve this problem
# I've made variables for each length of password
for i in string.ascii_letters:  # This is array of ascii letters(a-Z)
    keyf = i
    # generate hash by crypt
    gHash = crypt.crypt(keyf, sys.argv[1])
    # compare hash with encrypted
    if gHash == sys.argv[1]:
        print(keyf)
        sys.exit(0)

    for j in string.ascii_letters:
        keys = keyf + j
        gHash = crypt.crypt(keys, sys.argv[1])
        if gHash == sys.argv[1]:
            print(keys)
            sys.exit(0)

        for k in string.ascii_letters:
            keyt = keys + k
            gHash = crypt.crypt(keyt, sys.argv[1])
            if gHash == sys.argv[1]:
                print(keyt)
                sys.exit(0)

            for m in string.ascii_letters:
                keyfo = keyt + m
                gHash = crypt.crypt(keyfo, sys.argv[1])
                if gHash == sys.argv[1]:
                    print(keyfo)
                    sys.exit(0)

                for n in string.ascii_letters:
                    keyfi = keyfo + n
                    gHash = crypt.crypt(keyfi, sys.argv[1])
                    if gHash == sys.argv[1]:
                        print(keyfi)
                        sys.exit(0)

print("Password not cracked")
