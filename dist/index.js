"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PelicanRoles = exports.Role = exports.User = exports.Server = exports.RoleManager = exports.UserManager = exports.ServerManager = exports.PelicanApp = exports.PelicanClient = void 0;
var PelicanClient_1 = require("./client/PelicanClient");
Object.defineProperty(exports, "PelicanClient", { enumerable: true, get: function () { return PelicanClient_1.PelicanClient; } });
var PelicanApp_1 = require("./application/PelicanApp");
Object.defineProperty(exports, "PelicanApp", { enumerable: true, get: function () { return PelicanApp_1.PelicanApp; } });
var ServerManager_1 = require("./managers/ServerManager");
Object.defineProperty(exports, "ServerManager", { enumerable: true, get: function () { return ServerManager_1.ServerManager; } });
var UserManager_1 = require("./managers/UserManager");
Object.defineProperty(exports, "UserManager", { enumerable: true, get: function () { return UserManager_1.UserManager; } });
var RoleManager_1 = require("./managers/RoleManager");
Object.defineProperty(exports, "RoleManager", { enumerable: true, get: function () { return RoleManager_1.RoleManager; } });
var Server_1 = require("./structures/Server");
Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return Server_1.Server; } });
var User_1 = require("./structures/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
var Role_1 = require("./structures/Role");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return Role_1.Role; } });
__exportStar(require("./types/index"), exports);
// Exporter les constantes de rôles
exports.PelicanRoles = {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator'
};
//# sourceMappingURL=index.js.map