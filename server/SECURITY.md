# Village Hub Security Architecture & Audit Report

## 1. Authentication System
- **Algorithm**: `bcryptjs` with a cost factor of 10 for password hashing. Original passwords are never stored.
- **Protocol**: JWT (JSON Web Tokens) for stateless authentication.
  - **Access Tokens**: Short-lived (15 minutes).
  - **Refresh Tokens**: Long-lived (7 days), stored in a dedicated database table (`RefreshToken`).
- **Secure Logout**: Revocation is handled by deleting the refresh token from the database, preventing further session renewals even if the client-side token isn't cleared.

## 2. Role-Based Access Control (RBAC)
- **Deny-by-Default**: Authorization middleware explicitly requires roles for protected routes.
- **Roles Defined**:
  - `ADMIN`: Full access to user management, budgets, and all system data.
  - `OPERATOR`: Access to asset updates and complaints; restricted from budgets and user management.
  - `VIEWER`: Read-only access to dashboards.
- **Strict Enforcement**: Permission checks are performed server-side on every request after JWT verification.

## 3. Database & User Model
- **Schema**: Implemented using Prisma ORM with a relational structure.
- **Audit Logging**: Every authentication event (success/failure) and critical data modification is logged to the `AuditLog` table with timestamps and user context.
- **Active Status**: Users can be deactivated instantly by the Admin, which is checked during every login attempt.

## 4. Protected API Implementation
- **Headers**: `helmet` middleware used to set secure HTTP headers (HSTS, CSP, etc.).
- **CORS**: Restricted to the white-listed client origin.
- **Payload**: JWT claims are kept minimal to reduce bandwidth usage for rural deployments.

## 5. Village Office Deployment Considerations
- **Low Bandwidth**: JWTs eliminate the need for session lookups on every request, reducing server-to-db latency.
- **Non-Technical Resilience**: Use of mobile number as a primary identifier simplifies access for local staff.
- **Audit Readiness**: The `AuditLog` provides a tamper-evident record of actions taken by local government staff, essential for accountability in rural administration.

---
*Developed by the Village Hub Security Engineering Team.*
