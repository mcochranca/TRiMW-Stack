import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongoose';
import Identity from '../../../models/Identity';
import { decapsulateKey, decryptData } from '../../../lib/quantumCrypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const identity = await Identity.findOne({ userId });
        if (!identity) {
            // Create new identity if needed...
        }
        const symmetricKey = decapsulateKey(identity.tokenData.encapsulatedKey);
        const data = decryptData(identity.tokenData.encryptedData, symmetricKey);
        res.status(200).json({ ...identity.toObject(), decryptedData: data });
    } catch (error) {
        res.status(500).json({ error: 'Error processing identity' });
    }
}