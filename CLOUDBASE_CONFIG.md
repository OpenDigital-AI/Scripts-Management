# Cloudbase Configuration Examples

## Basic Configuration

The minimum configuration needed in `.env`:

```
VITE_CLOUDBASE_ENV=your-env-id
```

## Getting Your Environment ID

1. Visit [Tencent Cloudbase Console](https://console.cloud.tencent.com/tcb)
2. Select your environment (or create a new one)
3. Find the Environment ID in the environment settings
4. Copy and paste it into your `.env` file

## Authentication Methods

### Anonymous Login

Anonymous login is enabled by default and allows users to use the app without credentials.

**Enable in Cloudbase Console:**
1. Go to Authentication > Login Methods
2. Enable "Anonymous Login"
3. Save

**Usage in app:**
- User clicks "Anonymous" tab and logs in without credentials
- A unique anonymous user ID is generated

### Email/Password Login

**Enable in Cloudbase Console:**
1. Go to Authentication > Login Methods
2. Enable "Email & Password"
3. Configure email settings (optional)
4. Save

**Usage in app:**
- User registers with email and password
- User logs in with credentials
- Password reset available (if email configured)

### Username/Password Login

**Enable in Cloudbase Console:**
1. Go to Authentication > Login Methods
2. Enable "Username & Password"
3. Save

**Usage in app:**
- User registers with username and password
- User logs in with credentials

## Advanced Features

### Database Integration

Add database operations to `src/services/cloudbase.js`:

```javascript
// Get database reference
getDatabase() {
  return this.app.database();
}

// Query data
async queryData(collectionName) {
  const db = this.getDatabase();
  const collection = db.collection(collectionName);
  const res = await collection.get();
  return res.data;
}

// Add data
async addData(collectionName, data) {
  const db = this.getDatabase();
  const collection = db.collection(collectionName);
  const res = await collection.add(data);
  return res;
}
```

### Cloud Functions

Call cloud functions from your app:

```javascript
// In cloudbase.js
async callFunction(functionName, data) {
  try {
    const res = await this.app.callFunction({
      name: functionName,
      data: data
    });
    return { success: true, data: res.result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Cloud Storage

Upload and download files:

```javascript
// In cloudbase.js
async uploadFile(filePath, file) {
  try {
    const res = await this.app.uploadFile({
      cloudPath: filePath,
      filePath: file
    });
    return { success: true, fileID: res.fileID };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async downloadFile(fileID) {
  try {
    const res = await this.app.downloadFile({
      fileID: fileID
    });
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Security Rules

Configure security rules in Cloudbase Console to protect your data:

### Database Rules Example

```json
{
  "read": "auth.uid != null",
  "write": "auth.uid != null && doc.uid == auth.uid"
}
```

### Storage Rules Example

```json
{
  "read": "auth.uid != null",
  "write": "auth.uid != null"
}
```

## Environment-Specific Configuration

For multiple environments (dev, staging, prod):

**.env.development**
```
VITE_CLOUDBASE_ENV=dev-env-id
```

**.env.production**
```
VITE_CLOUDBASE_ENV=prod-env-id
```

## Troubleshooting

### Common Issues

1. **"Invalid environment ID"**
   - Double-check your environment ID in `.env`
   - Ensure there are no extra spaces or quotes

2. **"Authentication failed"**
   - Verify the auth method is enabled in console
   - Check that credentials are correct

3. **"Network error"**
   - Check internet connection
   - Verify firewall settings
   - Ensure Cloudbase services are accessible

4. **"Permission denied"**
   - Review security rules in Cloudbase console
   - Ensure user has proper permissions

## Additional Resources

- [Cloudbase JS SDK Documentation](https://docs.cloudbase.net/api-reference/web/initialization)
- [Authentication Guide](https://docs.cloudbase.net/authentication/introduce)
- [Database Guide](https://docs.cloudbase.net/database/introduce)
- [Cloud Functions Guide](https://docs.cloudbase.net/cloud-function/introduce)
