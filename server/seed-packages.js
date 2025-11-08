const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// Package Schema
const packageSchema = new mongoose.Schema({
    name: String,
    cc_range_min: Number,
    cc_range_max: Number,
    price_per_hour: Number,
    price_per_km: Number,
    vehicle_type: String,
    description: String,
    is_active: Boolean
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

const samplePackages = [
    {
        name: '100-150cc Bike Package',
        cc_range_min: 100,
        cc_range_max: 150,
        price_per_hour: 30,
        price_per_km: 3,
        vehicle_type: 'bike',
        description: 'Economy package for small bikes',
        is_active: true
    },
    {
        name: '150-200cc Bike Package',
        cc_range_min: 151,
        cc_range_max: 200,
        price_per_hour: 50,
        price_per_km: 5,
        vehicle_type: 'bike',
        description: 'Standard package for medium bikes',
        is_active: true
    },
    {
        name: '200cc+ Bike Package',
        cc_range_min: 201,
        cc_range_max: 500,
        price_per_hour: 80,
        price_per_km: 8,
        vehicle_type: 'bike',
        description: 'Premium package for high-performance bikes',
        is_active: true
    },
    {
        name: '800-1200cc Car Package',
        cc_range_min: 800,
        cc_range_max: 1200,
        price_per_hour: 100,
        price_per_km: 10,
        vehicle_type: 'car',
        description: 'Economy package for small cars',
        is_active: true
    },
    {
        name: '1200-1600cc Car Package',
        cc_range_min: 1201,
        cc_range_max: 1600,
        price_per_hour: 150,
        price_per_km: 15,
        vehicle_type: 'car',
        description: 'Standard package for sedans',
        is_active: true
    },
    {
        name: '1600cc+ Car Package',
        cc_range_min: 1601,
        cc_range_max: 5000,
        price_per_hour: 250,
        price_per_km: 25,
        vehicle_type: 'car',
        description: 'Premium package for luxury cars & SUVs',
        is_active: true
    }
];

mongoose.connect(DB)
    .then(async () => {
        console.log('✅ MongoDB connection successful!');
        
        // Clear existing packages
        await Package.deleteMany({});
        console.log('🗑️  Cleared existing packages');
        
        // Insert new packages
        const result = await Package.insertMany(samplePackages);
        console.log(`✅ Successfully inserted ${result.length} packages`);
        
        console.log('\n📦 Packages:');
        result.forEach(pkg => {
            console.log(`  - ${pkg.name}: ₹${pkg.price_per_hour}/hr | ₹${pkg.price_per_km}/km`);
        });
        
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
