; Draw diagonal line in framebuffer
MOV R0, 0
loop:
MOV R1, 0xA000
MOV R2, R0
MUL R2, 320
ADD R1, R2
ADD R1, R0
MOV R2, 1
STORE [R1], R2
INC R0
CMP R0, 200
JNZ loop
HALT
