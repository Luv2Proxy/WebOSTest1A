; Factorial: 5! = 120
MOV R0, 5
MOV R1, 1
loop:
MUL R1, R0
DEC R0
JNZ loop
OUT R1
HALT
