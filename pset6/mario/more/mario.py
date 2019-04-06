from cs50 import get_int

height = get_int("Height: ")
# Check the correct input
while height < 0 or height > 23:
    height = get_int("Height: ")
# i - rows counter, s- spaces counter, b && d - sharps counter
for i in range(height):
    for s in range(height - i - 1):
        print(' ', end="")
    for d in range(i + 1):
        print("#", end="")
    print("  ", end="")
    for b in range(i + 1):
        print('#', end="")
    print('')