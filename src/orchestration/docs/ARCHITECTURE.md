 # Architecture Overview
 
 ## System Modules
 
 ```
 ┌─────────────────────────────────────────────────────────────┐
 │                    ORCHESTRATION KERNEL                      │
 │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
 │  │  Task    │  │ Context  │  │ Verifier │  │ Autonomy │    │
 │  │  Queue   │  │ Manager  │  │ /Auditor │  │ Governor │    │
 │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
 │       │             │             │             │           │
 │       └─────────────┴─────────────┴─────────────┘           │
 │                          │                                   │
 │  ┌──────────────────────┴───────────────────────────────┐  │
 │  │              EVENT STORE (Append-Only)                │  │
 │  └──────────────────────┬───────────────────────────────┘  │
 │                          │                                   │
 │  ┌──────────────────────┴───────────────────────────────┐  │
 │  │                  SNAPSHOT STORE                       │  │
 │  └───────────────────────────────────────────────────────┘  │
 └─────────────────────────────────────────────────────────────┘
 ```
 
 ## Data Flow
 
 1. Kernel loads snapshot → selects next task → generates plan
 2. Plan steps execute → tools called → outputs verified
 3. All actions logged to Event Store
 4. Periodic snapshots for fast recovery
 5. Budgets checked after each action
 
 ## Invariants
 
 - Events are append-only and hash-chained
 - STOP halts immediately with checkpoint
 - Budgets are hard limits, never exceeded
 - Verification failures spawn fix tasks
 - Pinned context is never evicted