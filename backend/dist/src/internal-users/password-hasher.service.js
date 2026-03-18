"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHasherService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let PasswordHasherService = class PasswordHasherService {
    hash(password) {
        const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
        const derivedKey = (0, node_crypto_1.scryptSync)(password, salt, 64).toString('hex');
        return `scrypt$${salt}$${derivedKey}`;
    }
    verify(password, passwordHash) {
        const [algorithm, salt, storedHash] = passwordHash.split('$');
        if (algorithm !== 'scrypt' || !salt || !storedHash) {
            return false;
        }
        const derivedKey = (0, node_crypto_1.scryptSync)(password, salt, 64);
        const storedKey = Buffer.from(storedHash, 'hex');
        return (0, node_crypto_1.timingSafeEqual)(derivedKey, storedKey);
    }
};
exports.PasswordHasherService = PasswordHasherService;
exports.PasswordHasherService = PasswordHasherService = __decorate([
    (0, common_1.Injectable)()
], PasswordHasherService);
//# sourceMappingURL=password-hasher.service.js.map