import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const IdentitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    tokenData: { type: Schema.Types.Mixed, required: true },
    auditLog: [{ type: Schema.Types.Mixed }], // Logs each change event for audit purposes
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Identity || mongoose.model('Identity', IdentitySchema);
