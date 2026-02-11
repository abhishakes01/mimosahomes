const fs = require('fs');
const path = require('path');
const { Facade, FloorPlan, Listing, sequelize } = require('../src/models');

const TEST_DATA_DIR = path.join(__dirname, '../src/testData');
const PUBLIC_UPLOADS_DIR = path.join(__dirname, '../public/uploads');

const FACADE_IMAGES_DIR = path.join(TEST_DATA_DIR, 'facades');
const FLOORPLAN_IMAGES_DIR = path.join(TEST_DATA_DIR, 'Floor plan');
const HOME_IMAGES_DIR = path.join(TEST_DATA_DIR, 'home');

const copyImage = (sourcePath, type, subfolder = '') => {
    if (!fs.existsSync(sourcePath)) {
        console.warn(`Source file not found: ${sourcePath}`);
        return null;
    }

    const destDir = path.join(PUBLIC_UPLOADS_DIR, type === 'listing' ? 'listings' : type + 's', subfolder);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const filename = path.basename(sourcePath);
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1000)}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const destPath = path.join(destDir, uniqueFilename);
    fs.copyFileSync(sourcePath, destPath);

    return `/uploads/${type === 'listing' ? 'listings' : type + 's'}/${subfolder ? subfolder + '/' : ''}${uniqueFilename}`;
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomItems = (arr, count) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};


const generateData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Generate Facades
        console.log('Generating Facades...');
        let facadeImages = [];
        if (fs.existsSync(FACADE_IMAGES_DIR)) {
            facadeImages = fs.readdirSync(FACADE_IMAGES_DIR).map(f => ({
                filename: f,
                path: path.join(FACADE_IMAGES_DIR, f)
            }));
        }

        const facades = [];

        if (facadeImages.length === 0) {
            console.log('No facade images found. Skipping facade generation.');
        } else {
            // Filter dotfiles
            facadeImages = facadeImages.filter(f => !f.filename.startsWith('.'));

            for (let i = 0; i < 10; i++) {
                const img = getRandomItem(facadeImages);
                const imageUrl = copyImage(img.path, 'facade');

                const facade = await Facade.create({
                    title: `Modern Facade ${Date.now().toString().slice(-4)}-${i + 1}`,
                    width: getRandomInt(10, 20) + (Math.random() > 0.5 ? 0.5 : 0),
                    image_url: imageUrl
                });
                facades.push(facade);
            }
        }
        console.log(`Generated ${facades.length} facades.`);

        // 2. Generate Floor Plans
        console.log('Generating Floor Plans...');
        let floorplanImages = [];
        if (fs.existsSync(FLOORPLAN_IMAGES_DIR)) {
            floorplanImages = fs.readdirSync(FLOORPLAN_IMAGES_DIR).map(f => ({
                filename: f,
                path: path.join(FLOORPLAN_IMAGES_DIR, f)
            }));
        }

        const floorplans = [];

        if (floorplanImages.length === 0) {
            console.log('No floorplan images found. Skipping floorplan generation.');
        } else {
            // Filter dotfiles
            floorplanImages = floorplanImages.filter(f => !f.filename.startsWith('.'));

            console.log(`Found ${floorplanImages.length} floorplan images.`);
            for (let i = 0; i < 10; i++) {
                const img = getRandomItem(floorplanImages);
                const imageUrl = copyImage(img.path, 'floorplan');

                const floorplan = await FloorPlan.create({
                    title: `Luxury Layout ${Date.now().toString().slice(-4)}-${i + 1}`,
                    location: getRandomItem(['Ground Floor', 'First Floor']),
                    min_frontage: getRandomInt(12, 18),
                    min_depth: getRandomInt(25, 35),
                    total_area: getRandomInt(200, 350),
                    ground_floor_area: getRandomInt(150, 250),
                    first_floor_area: getRandomInt(0, 150),
                    garage_area: getRandomInt(30, 40),
                    porch_area: getRandomInt(5, 15),
                    alfresco_area: getRandomInt(10, 20),
                    stories: getRandomInt(1, 2),
                    bedrooms: getRandomInt(3, 5),
                    bathrooms: getRandomInt(2, 3),
                    car_spaces: getRandomInt(1, 2),
                    price: getRandomInt(300000, 600000),
                    image_url: imageUrl
                });
                floorplans.push(floorplan);
            }
        }
        console.log(`Generated ${floorplans.length} floor plans.`);

        // Associate Facades and Floor Plans randomly
        if (facades.length > 0 && floorplans.length > 0) {
            for (const facade of facades) {
                // Assign 2-5 random floorplans to each facade
                const numFps = getRandomInt(2, 5);
                const selectedFps = getRandomItems(floorplans, numFps);
                await facade.setFloorplans(selectedFps);
            }
            console.log('Associated facades with floor plans.');
        }

        // 3. Generate Listings
        console.log('Generating Listings...');
        let homeImages = [];
        if (fs.existsSync(HOME_IMAGES_DIR)) {
            homeImages = fs.readdirSync(HOME_IMAGES_DIR).map(f => ({
                filename: f,
                path: path.join(HOME_IMAGES_DIR, f)
            })).filter(f => !f.filename.startsWith('.'));
        }

        const availableImages = [...homeImages, ...facadeImages, ...floorplanImages];

        if (availableImages.length === 0) {
            console.log('No images available for listings.');
        } else {
            for (let i = 0; i < 10; i++) {
                const facade = facades.length > 0 ? getRandomItem(facades) : null;
                const floorplan = floorplans.length > 0 ? getRandomItem(floorplans) : null;

                const listing = await Listing.create({
                    title: `Stunning Home ${Date.now().toString().slice(-4)}-${i + 1}`,
                    address: `${getRandomInt(1, 999)} Random Street, Suburb ${String.fromCharCode(65 + i)}`,
                    price: getRandomInt(500000, 1200000),
                    type: getRandomItem(['house_land', 'ready_built', 'display_home']),
                    status: getRandomItem(['available', 'deposit_taken', 'sold']),
                    description: 'A beautiful home with modern amenities and spacious living areas. Perfect for families.',
                    collection: getRandomItem(['V_Collection', 'M_Collection']),
                    facade_id: facade?.id,
                    floorplan_id: floorplan?.id,
                    latitude: -37.8136 + (Math.random() - 0.5) * 0.1,
                    longitude: 144.9631 + (Math.random() - 0.5) * 0.1,
                    images: []
                });

                // Upload multiple images for listing
                const listingImages = [];
                const numImages = getRandomInt(3, 6);
                for (let j = 0; j < numImages; j++) {
                    const img = getRandomItem(availableImages);
                    if (img) {
                        const imgUrl = copyImage(img.path, 'listing', listing.id);
                        if (imgUrl) listingImages.push(imgUrl);
                    }
                }

                await listing.update({ images: listingImages });
            }
        }
        console.log('Generated 10 listings.');

        console.log('Data generation complete.');
        process.exit(0);

    } catch (error) {
        console.error('Error generating data:', error);
        process.exit(1);
    }
};

generateData();
