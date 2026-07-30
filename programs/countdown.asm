; Countdown
MOV R0, 10
loop:
OUT R0
DEC R0
JNZ loop
HALT
