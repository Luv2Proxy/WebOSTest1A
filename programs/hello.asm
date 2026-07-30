; Hello World
MOV R0, message
loop:
LOAD R1, [R0]
CMP R1, 0
JZ done
OUT R1
INC R0
JMP loop
done:
HALT
message:
DB "Hello from VCPU-16!\n", 0
