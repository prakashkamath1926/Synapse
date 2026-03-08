import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

// Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                ...(process.env.AWS_SESSION_TOKEN
                    ? { sessionToken: process.env.AWS_SESSION_TOKEN }
                    : {}),
            },
        }
        : {}),
});

/**
 * Uploads a generated visual summary (JSON) to Amazon S3
 * @param {string} topic - The topic of the summary (used for filename)
 * @param {object} data - The JSON data of the generated summary
 * @returns {Promise<string>} - The S3 object key or URL
 */
export async function uploadVisualSummaryToS3(topic, data) {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
        console.warn('⚠️ AWS_S3_BUCKET_NAME is not defined. Skipping S3 upload.');
        return null;
    }

    try {
        // Create a URL-safe filename
        const safeTopic = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const objectKey = `visual-summaries/${safeTopic}_${Date.now()}.json`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            Body: JSON.stringify(data, null, 2),
            ContentType: 'application/json',
        });

        await s3Client.send(command);
        console.log(`✅ Visual Summary uploaded to S3: s3://${bucketName}/${objectKey}`);

        return objectKey;
    } catch (error) {
        console.error('❌ Failed to upload visual summary to S3:', error.message);
        // We do not throw the error to avoid breaking the user experience if S3 fails
        return null;
    }
}
