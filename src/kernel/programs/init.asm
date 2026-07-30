; VCPU-64 init process
; Demonstrates that the first user-space program executes from machine code.
start:
    MOV r0, 86
    SYSCALL 1
    MOV r0, 67
    SYSCALL 1
    MOV r0, 80
    SYSCALL 1
    MOV r0, 85
    SYSCALL 1
    MOV r0, 45
    SYSCALL 1
    MOV r0, 54
    SYSCALL 1
    MOV r0, 52
    SYSCALL 1
    MOV r0, 32
    SYSCALL 1
    MOV r0, 105
    SYSCALL 1
    MOV r0, 110
    SYSCALL 1
    MOV r0, 105
    SYSCALL 1
    MOV r0, 116
    SYSCALL 1
    MOV r0, 10
    SYSCALL 1
    MOV r0, 0
    SYSCALL 5
    HALT
