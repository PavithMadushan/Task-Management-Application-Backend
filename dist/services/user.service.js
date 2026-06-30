"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_repository_1 = require("../data/user.repository");
exports.userService = {
    async updateUser(id, updates) {
        const updated = await user_repository_1.userRepo.updateUser(id, updates);
        if (!updated) {
            return null;
        }
        const { passwordHash, ...safeUser } = updated;
        return safeUser;
    },
    async deleteUser(id) {
        const existing = await user_repository_1.userRepo.findById(id);
        if (!existing) {
            return false;
        }
        await user_repository_1.userRepo.deleteUser(id);
        return true;
    },
};
