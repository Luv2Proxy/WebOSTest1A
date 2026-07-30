; Minimal VCPU-16 kernel entry
; The host System runtime currently provides the higher-level kernel services.
start:
    MOV R0, message
    CALL print
    HALT
print:
    LOAD R1, [R0]
    CMP R1, 0
    JZ print_done
    OUT R1
    INC R0
    JMP print
print_done:
    RET
message:
    DB "VCPU-16 kernel online.\n", 0
