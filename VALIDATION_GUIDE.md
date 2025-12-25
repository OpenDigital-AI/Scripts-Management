# Input Validation Quick Reference

## Validation Functions

### Email Validation
```javascript
import { validateEmail } from '@/utils/validation';

const result = validateEmail(email);
// Returns: { valid: boolean, error: string }
```

**Rules:**
- Must be valid email format (RFC 5322)
- Max 254 characters
- Required field

---

### Username Validation
```javascript
import { validateUsername } from '@/utils/validation';

const result = validateUsername(username);
// Returns: { valid: boolean, error: string }
```

**Rules:**
- 3-50 characters
- Alphanumeric + dots, underscores, hyphens only
- No spaces or special characters

---

### Password Validation
```javascript
import { validatePassword } from '@/utils/validation';

const result = validatePassword(password);
// Returns: { valid: boolean, error: string, strength: string }
```

**Rules:**
- 8-128 characters
- At least 2 of: uppercase, lowercase, numbers, special chars
- Strength levels: weak, medium, strong

---

### Username or Email
```javascript
import { validateUsernameOrEmail } from '@/utils/validation';

const result = validateUsernameOrEmail(input);
// Returns: { valid: boolean, error: string, type: 'email'|'username' }
```

Auto-detects if input is email (contains @) or username.

---

### Password Pattern Check
```javascript
import { checkPasswordPatterns } from '@/utils/validation';

const result = checkPasswordPatterns(password, username);
// Returns: { valid: boolean, error: string }
```

**Blocks:**
- Common passwords (password123, qwerty, etc.)
- Passwords containing username
- Sequential characters (abc, 123)
- Repeated characters (aaaa)

---

### Input Sanitization
```javascript
import { sanitizeInput } from '@/utils/validation';

const clean = sanitizeInput(userInput);
// Returns: sanitized string
```

**Removes:**
- HTML/XML tags
- < and > characters
- Leading/trailing whitespace

---

## Usage in Components

```vue
<script>
import {
  validateEmail,
  validatePassword,
  sanitizeInput
} from '@/utils/validation';

export default {
  setup() {
    const handleSubmit = () => {
      // Sanitize first
      const cleanEmail = sanitizeInput(email.value);
      
      // Then validate
      const emailCheck = validateEmail(cleanEmail);
      if (!emailCheck.valid) {
        error.value = emailCheck.error;
        return;
      }
      
      const passwordCheck = validatePassword(password.value);
      if (!passwordCheck.valid) {
        error.value = passwordCheck.error;
        return;
      }
      
      // Proceed with login
    };
  }
};
</script>
```

---

## Error Messages

### Email Errors
- "Email is required"
- "Email is too long"
- "Invalid email format"

### Username Errors
- "Username is required"
- "Username must be at least 3 characters"
- "Username must not exceed 50 characters"
- "Username can only contain letters, numbers, dots, underscores, and hyphens"

### Password Errors
- "Password is required"
- "Password must be at least 8 characters"
- "Password is too long (max 128 characters)"
- "Password must contain at least 2 of: uppercase, lowercase, numbers, special characters"
- "Password should not contain your username"
- "This password is too common"
- "Avoid using sequential characters"
- "Avoid using repeated characters"

---

## Password Strength Levels

| Strength | Requirements |
|----------|-------------|
| **Strong** | 12+ chars + 3+ criteria |
| **Medium** | 10+ chars + 2+ criteria |
| **Weak** | 8-9 chars + 2 criteria |

Criteria: uppercase, lowercase, numbers, special characters

---

## Best Practices

1. **Always sanitize before validate**
   ```javascript
   const clean = sanitizeInput(input);
   const result = validateEmail(clean);
   ```

2. **Validate on both client and server**
   - Client: Better UX
   - Server: Security

3. **Clear passwords on failure**
   ```javascript
   if (!result.success) {
     password.value = '';
   }
   ```

4. **Show generic errors to users**
   ```javascript
   // Good
   error.value = 'Login failed. Please check your credentials.';
   
   // Bad - reveals too much
   error.value = error.message;
   ```

5. **Use real-time validation**
   ```vue
   <input @blur="validateField" @input="clearError" />
   ```

---

## Testing

Run tests:
```bash
node src/utils/validation.test.js
```

Test individual functions:
```javascript
import { validatePassword } from './utils/validation';

console.log(validatePassword('Test123!'));
// { valid: true, error: '', strength: 'medium' }
```

---

## Security Notes

⚠️ **Client-side validation is NOT security** - It's for UX only

✅ **Always validate on the backend** in Cloudbase Cloud Functions

✅ **Sanitize all inputs** before processing

✅ **Never trust user input** - Validate everything

✅ **Use generic error messages** - Don't leak system info

---

For more details, see [SECURITY_VALIDATION.md](SECURITY_VALIDATION.md)
