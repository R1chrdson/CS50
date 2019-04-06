from cs50 import get_float

# array with nominal and conter to count coins
nominal = [.25, .10, .05, .01]
counter = 0

# I won't use float to integer transfer cause of it just works
# I'm using round function

money = get_float("Change owed: ")
# Check the correct input
while money < 0:
    money = get_float("Change owed: ")

# Loop which counts coins
#   ??? I remember that there is better path to solve this problem???
#   ??? But I can't find out it
for i in nominal:
    while money >= i:
        money = round(money - i, 2)
        counter += 1
print(counter)

