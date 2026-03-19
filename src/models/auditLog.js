import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},
action: {
  type: String,
  required: true,
    enum: [
    "CREATE_USER",
    "DELETE_USER",
    "ASSIGN_ROLE",
    "CREATE_ORDER",
    "UPDATE_PRODUCT",
    "DELETE_PRODUCT"
  ]
},

target: {
  type: String,
  required: true,
  enum: ["USER", "ORDER", "PRODUCT"]
},

targetId: {
  type: mongoose.Schema.Types.ObjectId,
  required: true
},

metadata: {
  type: Object
}


},
{ timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
