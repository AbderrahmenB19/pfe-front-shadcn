# Role-Based Routing Implementation

## Overview

This implementation adds role-based access control to the application using Keycloak for authentication and authorization. The system supports three main roles:

- **ADMIN**: Can access form builder, form templates, process definition, and process builder pages
- **VALIDATOR**: Can access validator dashboard and process history pages
- **USER**: Can access available requests and my requests pages

## Implementation Details

### Key Components

1. **KeycloakService**: Handles authentication and extracts user roles from the Keycloak token
2. **AuthStore**: Stores the authentication token and user roles using Zustand
3. **ProtectedRoute**: A component that restricts access to routes based on user roles
4. **Role Utilities**: Helper functions to check user roles

### Files Modified/Created

- `src/auth/KeycloakService.tsx`: Updated to extract roles from Keycloak token
- `src/store/authStore.ts`: Updated to store user roles
- `src/components/ProtectedRoute.tsx`: Created to handle role-based route protection
- `src/utils/roleUtils.ts`: Created utility functions for role checking
- `src/utils/tokenUtils.ts`: Created utilities for token decoding and role extraction
- `src/route/AppRoute.tsx`: Updated to implement protected routes
- `src/route/AppSidebar.tsx`: Updated to show navigation items based on user roles
- `src/pages/Home.tsx`: Updated to show role-specific actions

## Testing

### Keycloak Configuration

Ensure your Keycloak server is configured with the following roles:

- ADMIN
- VALIDATOR
- USER

Assign these roles to users in the Keycloak admin console.

### Testing Different Roles

1. Log in with different user accounts that have different roles assigned
2. Verify that:
   - Users only see navigation items they have access to
   - Users cannot access restricted routes by directly entering the URL
   - The home page only shows actions relevant to the user's role

## Troubleshooting

### Common Issues

- **Role names must match exactly**: Ensure that role names in Keycloak match the role names used in the code (ADMIN, VALIDATOR, USER)
- **Token not containing roles**: Check the Keycloak configuration to ensure roles are included in the token
- **Redirect loops**: If experiencing redirect loops, check that the ProtectedRoute component is correctly evaluating roles

### Debugging

You can use the browser console to debug role-based issues:

```javascript
// Check current roles
console.log(JSON.parse(atob(localStorage.getItem('token').split('.')[1])).realm_access.roles);

// Check auth store state
import { useAuthStore } from '@/store/authStore';
console.log(useAuthStore.getState());
```

## Future Improvements

- Add role-based API access control
- Implement more granular permissions within roles
- Add role assignment and management UI for administrators