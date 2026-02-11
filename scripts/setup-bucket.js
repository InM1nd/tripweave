
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBucket() {
    const bucketName = 'trip-covers';

    console.log(`Checking for bucket '${bucketName}'...`);

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('Error listing buckets:', listError.message);
        return;
    }

    const bucketExists = buckets.find(b => b.name === bucketName);

    if (bucketExists) {
        console.log(`Bucket '${bucketName}' already exists.`);
    } else {
        console.log(`Bucket '${bucketName}' not found. Creating...`);
        // Try to create public bucket
        const { data, error } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });

        if (error) {
            console.error('Error creating bucket:', error.message);
            console.log('Please create the bucket manually in your Supabase dashboard.');
            console.log(`Name: ${bucketName}, Public: true`);
        } else {
            console.log(`Bucket '${bucketName}' created successfully.`);
        }
    }
}

setupBucket();
