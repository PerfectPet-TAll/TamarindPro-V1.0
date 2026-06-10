# Security Specification & Threat Model (TDD)

## 1. Data Invariants
- **Schema Completeness**: All notifications must include key parameters (`title`, `description`, `severity`, `category`, `isRead`, `createdAt`).
- **Temporal Integrity**: `createdAt` must match server time and must be immutable.
- **Strict Bounds**: Title and Description must be constrained in length (<= 200 and <= 1000 characters).
- **ID Safety**: Document IDs must not contain poisonous characters and must be within safe lengths.

## 2. Threat Vector Payloads ("Dirty Dozen")
1. **Unauthenticated Write**: Creating a notification without auth header -> BLOCK
2. **Identity Spoofing**: Overwriting other recipient's targeted `userId` or impersonating authority -> BLOCK
3. **Ghost Field Update**: Adding a random `ghostField` inside notifications -> BLOCK
4. **Length Poisoning**: Title size exceeding 200 characters -> BLOCK
5. **Payload Inflation**: Gigantic description exceeding 1000 characters -> BLOCK
6. **Immutable Hijack**: Attempting to alter `createdAt` on update -> BLOCK
7. **Action Escape**: Modifying structural parameters like `category` or `title` during an update (which should only allow `isRead` modification) -> BLOCK
8. **Invalid Enum**: Setting `severity` to "apocalyptic" -> BLOCK
9. **Invalid Department**: Setting `category` to "finance_heist" -> BLOCK
10. **Type Mismatch**: Sending `isRead` as a string instead of a boolean -> BLOCK
11. **Malicious ID Injection**: Creating a path with special character string in the ID -> BLOCK
12. **Null Time Verification**: Sending a pre-stamped client-based date to bypass `request.time` -> BLOCK

## 3. Deployment Rules Execution
The physical security rules below will enforce these constraints completely at the Firestore database layer.
