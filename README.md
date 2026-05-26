# @wazdl/pelicanjs

A modern JavaScript/TypeScript module for interacting with the Pelican Panel API. Designed to be simple, efficient, and fully typed.

## 🚀 Installation

```bash
npm install @wazdl/pelicanjs
```

## ✨ Features

- ✅ Full TypeScript support with generated types
- ✅ Client API (user actions) and Application API (admin actions)
- ✅ Automatic error handling with descriptive messages
- ✅ Server and user management support
- ✅ Power management methods (start, stop, restart, kill)
- ✅ Server reinstallation support
- ✅ Server deletion support (with force option)
- ✅ Network allocations and resources management
- ✅ Compatible with Discord.js and other frameworks
- ✅ Automatic URL normalization
- ✅ Configurable timeout (30s default)
- ✅ Pelican role system support

## 📖 Usage

### Client API (User Actions)

```javascript
const { PelicanClient } = require('@wazdl/pelicanjs');

const client = new PelicanClient({
  url: 'https://panel.example.com',
  clientKey: 'your_client_api_key'
});

// Fetch a server
const server = await client.servers.fetch('server-uuid');
console.log(`Server: ${server.name}`);

// Start a server
await server.start();

// Reinstall a server
await server.reinstall();

// Delete a server (DANGEROUS!)
await server.delete(); // Normal deletion
await server.delete(true); // Force deletion (even if running)

// Get connection information
const connectionInfo = await server.getConnectionInfo();
console.log(`Connect to: ${connectionInfo.ip}:${connectionInfo.port}`);

// Resource management
const resources = await server.fetchResources();
console.log(`Status: ${resources.current_state}`);
console.log(`RAM: ${resources.resources.memory_bytes / 1024 / 1024} MB`);
```

### Application API (Admin Actions)

```javascript
const { PelicanApp, PelicanRoles } = require('@wazdl/pelicanjs');

const app = new PelicanApp({
  url: 'https://panel.example.com',
  adminKey: 'your_admin_api_key'
});

// Create a user with role system
const newUser = await app.users.create({
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  role: PelicanRoles.USER // 'user', 'admin', 'moderator'
});

console.log(`User created: ${newUser.username} (Role: ${newUser.role})`);

// Fetch all users
const users = await app.users.fetchAll();
console.log(`${users.length} users found`);
```

## 🎭 Role System

Pelican uses a string-based role system instead of simple boolean admin flags:

```javascript
const { PelicanRoles } = require('@wazdl/pelicanjs');

// Available roles
console.log(PelicanRoles.ADMIN);     // 'admin'
console.log(PelicanRoles.USER);      // 'user'
console.log(PelicanRoles.MODERATOR); // 'moderator'

// Create users with different roles
const adminUser = await app.users.create({
  username: 'admin',
  email: 'admin@example.com',
  password: 'password123',
  role: PelicanRoles.ADMIN
});

const regularUser = await app.users.create({
  username: 'user',
  email: 'user@example.com',
  password: 'password123',
  role: PelicanRoles.USER // Default role
});

// Check user roles
console.log(adminUser.isAdmin);      // true
console.log(adminUser.hasRole('admin')); // true
console.log(regularUser.isModerator); // false
```

## 🤖 Discord Bot Integration

### Updated createuser command

```javascript
const { PelicanApp, PelicanRoles } = require('@wazdl/pelicanjs');

// In your createuser command
const app = new PelicanApp({
  url: client.configyaml.panel.url,
  adminKey: client.configyaml.panel.adminkey
});

try {
  const newUser = await app.users.create({
    username: args.getString("username"),
    email: args.getString("email"),
    password: args.getString("password"),
    role: args.getString("role") || PelicanRoles.USER // Use role instead of admin boolean
  });

  const embed = new Discord.EmbedBuilder()
    .setTitle("✅ User Created with PelicanJS")
    .setColor('#00FF00')
    .setDescription(`User **${newUser.username}** created successfully!`)
    .addFields(
      { name: '🆔 ID', value: `\`${newUser.id}\``, inline: true },
      { name: '👤 Username', value: `\`${newUser.username}\``, inline: true },
      { name: '📧 Email', value: `\`${newUser.email}\``, inline: true },
      { name: '🎭 Role', value: `\`${newUser.role}\``, inline: true },
      { name: '🔑 Is Admin', value: newUser.isAdmin ? '✅ Yes' : '❌ No', inline: true }
    );

  await message.reply({ embeds: [embed] });
} catch (error) {
  console.error('PelicanJS Error:', error.message);
  // Error handling...
}
```

### Modified startserver command

```javascript
const { PelicanClient } = require('@wazdl/pelicanjs');

// In your startserver command
const client = new PelicanClient({
  url: client.configyaml.panel.url,
  clientKey: client.configyaml.panel.clientkey
});

try {
  const server = await client.servers.fetch(serverID);
  await server.start();
  
  // Get connection information
  const connectionInfo = await server.getConnectionInfo();
  
  const embed = new Discord.EmbedBuilder()
    .setTitle("✅ Server Started")
    .setColor('#00FF00')
    .setDescription(`Server **${server.name}** started successfully!`)
    .addFields(
      { name: '🆔 ID', value: `\`${server.identifier}\``, inline: true },
      { name: '🌐 Connection', value: `\`${connectionInfo.ip}:${connectionInfo.port}\``, inline: true }
    );

  await message.reply({ embeds: [embed] });
} catch (error) {
  console.error('PelicanJS Error:', error.message);
  // Error handling...
}
```

## 📚 API Reference

### PelicanClient (Client API)

#### Servers
- `servers.fetch(uuid)` - Fetch a server by UUID
- `servers.fetchAll()` - Fetch all servers
- `servers.fetchResources(uuid)` - Fetch server resources
- `servers.fetchAllocations(uuid)` - Fetch network allocations

#### Server Methods
- `server.start()` - Start the server
- `server.stop()` - Stop the server
- `server.restart()` - Restart the server
- `server.kill()` - Force kill the server
- `server.reinstall()` - Reinstall the server
- `server.delete(force?)` - Delete the server permanently
- `server.rename(name)` - Rename the server
- `server.setDockerImage(image)` - Change Docker image
- `server.getConnectionInfo()` - Get IP:Port connection info

### PelicanApp (Application API)

#### Users
- `users.create(options)` - Create a user with role
- `users.fetch(id)` - Fetch a user by ID
- `users.fetchAll()` - Fetch all users
- `users.delete(id)` - Delete a user
- `users.update(id, options)` - Update a user

#### User Methods
- `user.hasRole(role)` - Check if user has specific role
- `user.isAdmin` - Check if user is admin
- `user.isModerator` - Check if user is moderator

## ⚙️ Configuration

```typescript
interface PelicanConfig {
  url: string;           // Pelican panel URL
  clientKey?: string;    // Client API key (for user actions)
  adminKey?: string;     // Admin API key (for admin actions)
}

interface CreateUserOptions {
  username: string;
  email: string;
  password: string;
  role?: string;         // 'admin', 'user', 'moderator'
  first_name?: string;
  last_name?: string;
}
```

## 🛠️ Error Handling

The module throws descriptive errors that you can catch:

```javascript
try {
  const server = await client.servers.fetch('invalid-uuid');
} catch (error) {
  console.error('Error:', error.message);
  // "Pelican API Error: Server not found"
}
```

## 📝 TypeScript Support

This module is written in TypeScript and includes all type definitions:

```typescript
import { PelicanClient, PelicanApp, Server, User, PelicanRoles } from '@wazdl/pelicanjs';

const client = new PelicanClient({
  url: 'https://panel.example.com',
  clientKey: 'your_key'
});

// Types are automatically inferred
const server: Server = await client.servers.fetch('uuid');
const resources: ServerResourcesData = await server.fetchResources();
```

## 🔧 Advanced Examples

### Role Management

```javascript
const users = await app.users.fetchAll();

// Filter by role
const admins = users.filter(user => user.hasRole(PelicanRoles.ADMIN));
const moderators = users.filter(user => user.isModerator);
const regularUsers = users.filter(user => user.hasRole(PelicanRoles.USER));

console.log(`${admins.length} administrators found`);
console.log(`${moderators.length} moderators found`);
console.log(`${regularUsers.length} regular users found`);
```

### Server Deletion (DANGEROUS!)

```javascript
const app = new PelicanApp({
  url: 'https://panel.example.com',
  adminKey: 'your_admin_key'
});

// Get server by ID
const server = await app.servers.fetchById(123);

// Delete server (normal)
await server.delete();

// Force delete server (even if running)
await server.delete(true);

// Or use the manager directly
await app.servers.delete(123); // Normal deletion
await app.servers.delete(123, true); // Force deletion
```

### Server Monitoring

```javascript
const server = await client.servers.fetch('uuid');
const resources = await server.fetchResources();

console.log(`Status: ${resources.current_state}`);
console.log(`RAM: ${(resources.resources.memory_bytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`CPU: ${resources.resources.cpu_absolute.toFixed(2)}%`);
console.log(`Uptime: ${Math.floor(resources.resources.uptime / 3600)}h`);
```

### Batch User Management

```javascript
const users = await app.users.fetchAll();
const adminUsers = users.filter(user => user.isAdmin);

console.log(`${adminUsers.length} administrators found`);
for (const admin of adminUsers) {
  console.log(`- ${admin.username} (${admin.email}) - Role: ${admin.role}`);
}
```

## 📋 Requirements

- Node.js 14.16 or higher
- A working Pelican Panel instance
- Valid API keys (client and/or admin)

## 🔍 Troubleshooting

### Common Issues

1. **"Pelican API Error: Unauthorized"**
   - Check your API key is correct
   - Ensure the key has the right permissions

2. **"Server not found"**
   - Verify the server UUID is correct
   - Check if the server exists in the panel

3. **Connection timeout**
   - Check your panel URL is accessible
   - Verify firewall settings

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [WazdLHost Website](https://wazdlhost.com)
- [Pelican Panel Documentation](https://pelican.dev)
- [GitHub Repository](https://github.com/wazdl/pelicanjs)
- [NPM Package](https://www.npmjs.com/package/@wazdl/pelicanjs)

## 🙏 Acknowledgments

- Thanks to the Pelican Panel team for their excellent API
- Inspired by the need for better Discord bot integration
- Built with modern JavaScript/TypeScript best practices

---

**Developed with ❤️ by [WazdL](https://github.com/wazdl) for the community**