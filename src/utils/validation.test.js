/**
 * Validation Utilities Test Suite
 * Run with: npm test (requires test framework setup)
 */

import {
  validateEmail,
  validateUsername,
  validatePassword,
  sanitizeInput,
  validateUsernameOrEmail,
  checkPasswordPatterns
} from './validation';

// Email Validation Tests
console.log('=== Email Validation Tests ===');

// Valid emails
console.log('Valid email test:', validateEmail('user@example.com'));
console.log('Valid email with subdomain:', validateEmail('user@mail.example.com'));
console.log('Valid email with special chars:', validateEmail('user.name+tag@example.co.uk'));

// Invalid emails
console.log('Invalid - no @:', validateEmail('userexample.com'));
console.log('Invalid - empty:', validateEmail(''));
console.log('Invalid - spaces:', validateEmail('user @example.com'));
console.log('Invalid - too long:', validateEmail('a'.repeat(256) + '@example.com'));

// Username Validation Tests
console.log('\n=== Username Validation Tests ===');

// Valid usernames
console.log('Valid username:', validateUsername('john_doe'));
console.log('Valid username with numbers:', validateUsername('user123'));
console.log('Valid username with dots:', validateUsername('john.doe'));

// Invalid usernames
console.log('Invalid - too short:', validateUsername('ab'));
console.log('Invalid - too long:', validateUsername('a'.repeat(51)));
console.log('Invalid - special chars:', validateUsername('user@name'));
console.log('Invalid - spaces:', validateUsername('user name'));
console.log('Invalid - empty:', validateUsername(''));

// Password Validation Tests
console.log('\n=== Password Validation Tests ===');

// Valid passwords
console.log('Strong password:', validatePassword('MyP@ssw0rd123'));
console.log('Medium password:', validatePassword('Password123'));
console.log('Weak but valid:', validatePassword('pass1234'));

// Invalid passwords
console.log('Invalid - too short:', validatePassword('Pass1'));
console.log('Invalid - no variety:', validatePassword('password'));
console.log('Invalid - too long:', validatePassword('a'.repeat(129)));
console.log('Invalid - empty:', validatePassword(''));

// Password Pattern Tests
console.log('\n=== Password Pattern Tests ===');

console.log('Contains username:', checkPasswordPatterns('JohnDoe123', 'johndoe'));
console.log('Common password:', checkPasswordPatterns('password123', ''));
console.log('Sequential chars:', checkPasswordPatterns('abc12345', ''));
console.log('Repeated chars:', checkPasswordPatterns('aaaa1234', ''));
console.log('Good pattern:', checkPasswordPatterns('MyS3cur3P@ss!', 'user'));

// Sanitization Tests
console.log('\n=== Sanitization Tests ===');

console.log('Remove HTML tags:', sanitizeInput('<script>alert("xss")</script>user'));
console.log('Remove angle brackets:', sanitizeInput('user<>name'));
console.log('Trim whitespace:', sanitizeInput('  username  '));
console.log('Combined:', sanitizeInput('  <b>user</b>  '));

// Username or Email Tests
console.log('\n=== Username or Email Detection Tests ===');

console.log('Detect email:', validateUsernameOrEmail('user@example.com'));
console.log('Detect username:', validateUsernameOrEmail('john_doe'));
console.log('Invalid email:', validateUsernameOrEmail('invalid@'));
console.log('Invalid username:', validateUsernameOrEmail('ab'));

console.log('\n=== All tests completed ===');
