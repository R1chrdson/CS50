from cs50 import get_int


def main():
    cardnumber = get_int("Number: ")
    # checking the length of card
    length = len(str(cardnumber))
    # if length is normal > check sum of card, else print "INVALID"
    if length == 13 or length == 15 or length == 16:
        # if sum is OK, give an answer
        if checksum(length, cardnumber):
            answer(cardnumber)
        else:
            print("INVALID")
    else:
        print("INVALID")


def checksum(length, cardnumber):
    sum = 0
    for i in range(length):
        # if digit is off (from last digit of cardnumber)
        if i % 2 == 0:
            sum += cardnumber % 10
        # elif number need'nt to plus digit to remain
        elif cardnumber % 10 < 5:
            sum += (cardnumber % 10) * 2
        else:
            sum += (((cardnumber % 10) * 2) % 10) + (((cardnumber % 10) * 2) // 10)
        cardnumber //= 10
    # I'm trying to use ternar conditional
    # total sum is correct (divides by 10)
    return True if sum % 10 == 0 else False


def answer(cardnumber):
    # I'll use additional var string to check 1'st and 2'nd symbol of cardnumber
    string = str(cardnumber)
    if (len(str(cardnumber)) == 13 or len(str(cardnumber))) == 16 and string[0] == '4':
        print("VISA")
    elif len(str(cardnumber)) == 16 and string[0] == '5' and string[1] in ['1', '2', '3', '4', '5']:
        print("MASTERCARD")
    elif len(str(cardnumber)) == 15 and string[0] == '3' and string[1] in ['4', '7']:
        print("AMEX")
    else:
        print("INVALID")
    return True


if __name__ == "__main__":
    main()