# Yochlol scale correction

The first uploaded sheet had been registered with a 120-pixel target body height inside each 208-pixel cell. That left the ordinary idle at 122 pixels high. The revised sheet keeps the existing approved poses and applies one safe, shared scale per animation row, preserving each frame's lower-body anchor and ground contact. Idle is scaled 1.42 times and measures 173 pixels high within its 208-pixel cell. The hover reaction row, which Codex reads from the jumping state, is scaled 1.36 times and measures 166 to 184 pixels high, with a fixed ground baseline. Wider lateral movement rows use the largest shared scale that fits their longest pose.

The hover row now moves one existing outer pseudopod through a small lift and return. The body, base, scale, and all other tentacles remain fixed, so each frame keeps the same limb count and silhouette. This preserves the requested grounded hover reaction. The generic jumping-state quality check therefore continues to report zero body lift.

Final sprite sheet SHA-256: ea780267afb20ac4e79f9e77c94a97c07914cc7c87b71e94b5c13dd4ab4d3