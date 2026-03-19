import AuditLog from "../models/auditLog.js";

export const createAuditLog = async ({
userId,
action,
target,
targetId,
metadata = {}
}) => {
try {
await AuditLog.create({
user: userId,
action,
target,
targetId,
metadata
});
} catch (error) {
// Do NOT break main logic if audit fails
console.error("Audit log failed:", error.message);
}
};
