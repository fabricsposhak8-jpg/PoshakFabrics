import { Redis } from '@upstash/redis';
import 'dotenv/config';

const redis = Redis.fromEnv();

const keys = await redis.keys('product*');
console.log("Keys found:", keys);

if (keys.length > 0) {
    for (const key of keys) {
        await redis.del(key);
        console.log(`Deleted: ${key}`);
    }
}

await redis.del("products");
console.log("Deleted: products");
console.log("✅ Cache cleared!");
