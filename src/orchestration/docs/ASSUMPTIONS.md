 # Assumptions & Design Decisions
 
 ## Default Choices Made
 
 1. **Storage**: In-memory stores (EventStore, SnapshotStore) for simplicity
    - Configurable: Can swap for Postgres persistence
 
 2. **Token Estimation**: 4 chars = 1 token approximation
    - Configurable: Inject custom tokenizer via LLMProvider
 
 3. **LLM/Tools**: Mock implementations provided
    - Configurable: Implement LLMProvider/ToolExecutor interfaces
 
 4. **Checkpoint Interval**: Default 10 actions
    - Configurable via KernelConfig.checkpoint_interval
 
 5. **Working Context Limit**: 8000 tokens default
    - Configurable via constructor parameter
 
 6. **Risk Levels**: delete/drop=high, write/update=medium, external=medium
    - Configurable via RiskyActionPolicy
 
 7. **Approval Timeout**: 5 minutes
    - Hardcoded but easily changeable
 
 8. **Contradiction Detection**: Simple pattern matching
    - Production would use semantic similarity + LLM
 
 ## Test Harness
 
 - 12 test specifications covering all required categories
 - Mock LLM returns predictable outputs for determinism
 - Timeout default: 60 seconds per test