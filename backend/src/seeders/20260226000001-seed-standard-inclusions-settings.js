'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const inclusionsData = {
            categories: [
                {
                    title: "STRUCTURAL FOUNDATIONS",
                    items: [
                        "FOUNDATIONS: 'M' Class concrete engineer designed waffle pod slab (Excluding alfresco and porch). Includes SL72 fabric mesh, N12 bars & 3-L11 trench mesh with 310mm overall slab height.",
                        "SITE EXCAVATIONS: Up to 700m2 land size - excavation and soil removal with allowance for 300mm of fill, 400mm fall and 5m setback (excludes retaining walls and AGI drains).",
                        "CONNECTIONS: Connection of services - water, gas, electricity, 100mm sewer, 100mm storm water with additional outlets and telephone conduit with draw string (excludes usage)",
                        "Two external water taps in addition to mains metered water tap.",
                        "Excludes telephone/Fibre Optic connection costs and excludes gas and electricity account opening fees (up to 700m2 land size with up to 5m house setback).",
                        "FRAME: MGP 10 or equivalent stabilised pine 90mm wall frames and engineered designed roof trusses.",
                        "EXTERNAL CLADDING: Choice of bricks selected from essential range. (Ground floor to double storey only)",
                        "Lightweight cladding to first floor of double storey (double storey, product specific)",
                        "Lightweight cladding to single storey (design specific)",
                        "Feature render to facade (One colour, product specific)",
                        "Brick infills above all windows to front elevation. (Double storey ground floor only, product & design specific)",
                        "Lightweight infills above windows and sliding doors to side and rear elevation (design specific, single storey)",
                        "Natural colour rolled mortar joints",
                        "ROOFING MATERIAL: Concrete roof tiles selected from essential range 22.5 degree roof pitch (single storeys only)",
                        "A roof made from Colorbond steel (double storey only & facade specific)",
                        "GUTTER / FASCIA / DOWNPIPES: Colorbond gutter, fascia & downpipes",
                        "EXTERNAL PAINTWORK: Low sheen acrylic paint to all external surfaces.",
                        "Water based acrylic enamel gloss paint to front entry door.",
                        "Flat acrylic paint to eaves (if applicable).",
                        "WINDOWS: Powder coated aluminium double glazed feature windows to front elevation (facade specific)",
                        "Powder coated aluminium double glazed awning windows to remainder of home.",
                        "Powder coated aluminium single glazed sliding doors",
                        "Keyed window locks to all openable windows.",
                        "FRONT DOOR: Choice of feature front entry door clear or translucent glazed.",
                        "Designer front entry door handle.",
                        "Powder coated aluminium door frame.",
                        "GARAGE: Concrete floor, plaster lined ceiling & walls.",
                        "Colorbond panel lift door.",
                        "Brick infill above garage door opening (product specific)",
                        "Weatherproof hinged access door to rear with aluminium powder coated door frame.",
                        "Hinged internal access door to garage (design specific)",
                        "Ramp between garage & house entry to comply with National Construction Code 2022."
                    ]
                },
                {
                    title: "WARRANTIES & GUARANTEES",
                    items: [
                        "7 year structural guarantee.",
                        "All statutory warranties, insurances and guarantees.",
                        "6 month maintenance period.",
                        "Independent inspections by registered building surveyor.",
                        "Termite protection (if required)."
                    ]
                },
                {
                    title: "INTERNAL FEATURES",
                    items: [
                        "67mm x 12mm primed single bevel skirtings",
                        "67mm x 12mm primed single bevel architraves",
                        "75mm cove cornice",
                        "2 coat paint system (flat acrylic ceilings, matt washable walls, gloss woodwork)",
                        "2440mm ceiling height (single & double storey options)",
                        "Melamine single shelving & metal hanging rail to robes",
                        "Ceramic wall tiles to kitchen, bathroom, ensuite & laundry",
                        "Ceramic floor tiles to wet areas",
                        "100mm high skirting tiles to wet areas",
                        "2040mm high flush panel hinged internal doors",
                        "Chrome lever door handles",
                        "Privacy lever door handles to bathroom, WC (main) & master bedroom",
                        "Air cushion door stops"
                    ]
                },
                {
                    title: "ELECTRICAL & SUSTAINABLE ENERGY",
                    items: [
                        "Double/Single powerpoints as per electrical plan",
                        "Fixed batten holders with cowl shades and energy efficient globes",
                        "Weather proof paraflood lights externally",
                        "TV points (2 for single, 3 for double storey) with coaxial cable",
                        "Pre-wired telephone point with wall plate",
                        "Self sealing exhaust fans vented externally",
                        "3 star gas ducted heating unit with digital control",
                        "Ducted to all living areas and bedrooms",
                        "Independent 7 star energy report obtained for every individual home",
                        "3.52kw photovoltaic solar system (battery ready)",
                        "Solar gas boosted hot water unit",
                        "240v Hardwired smoke detectors with battery backup",
                        "Ceiling insulation batts (7 star) and Class 4 Vapour permeance barrier wall wrap/batts",
                        "RCD safety switch and circuit breakers"
                    ]
                },
                {
                    title: "STAIRCASE (DOUBLE STOREY)",
                    items: [
                        "Staircase finishes are house design specific (check master standard drawings)"
                    ]
                },
                {
                    title: "KITCHEN & LAUNDRY",
                    items: [
                        "Laminated base cabinetry & overhead cupboards (design specific)",
                        "White melamine finish to all internal surfaces",
                        "Designer handles from essential range",
                        "Laminated 32mm square edge benchtop",
                        "Dishwasher provision with single power point and water connection",
                        "900mm stainless steel dual fuel upright cooker (designs above 20sq)",
                        "600mm built-in oven and cooktop (designs under 20sq)",
                        "900mm stainless steel canopy rangehood (designs above 20sq)",
                        "600mm stainless steel slide out rangehood (designs under 20sq)",
                        "Stainless steel double bowl sink with side drainer",
                        "Designer sink mixer with chrome finish",
                        "Powdercoated steel laundry cabinet (45L) with stainless steel trough",
                        "Wall mounted washing machine stops"
                    ]
                },
                {
                    title: "BATHROOM & ENSUITE",
                    items: [
                        "Recessed tiled shower base to one shower (NCC 2022 compliant)",
                        "Durable shower base to remaining showers (design specific)",
                        "Polished silver frame shower screen with pivot door and clear laminated glass",
                        "Designer hand held shower rail (adjustable) with flickmixer (chrome)",
                        "Laminated base cabinetry from essential range",
                        "White melamine finish to internal surfaces",
                        "Designer white bathtub with flickmixer and gooseneck spout",
                        "Laminated 19mm square edge benchtop",
                        "White toilet suite with concealed waste and dual flush cistern",
                        "Designer vanity basin with flickmixer (essential range)",
                        "Polished edge mirrors to full width of vanities"
                    ]
                },
                {
                    title: "ADDED VALUE INCLUSIONS",
                    items: [
                        "Quality assurance inspections throughout build",
                        "Professional cleaning prior to handover",
                        "Dedicated customer service team"
                    ]
                }
            ]
        };

        // Use raw query for UPSERT in PostgreSQL
        await queryInterface.sequelize.query(`
      INSERT INTO "Settings" (key, value, "createdAt", "updatedAt")
      VALUES ('standard_inclusions', :value, NOW(), NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, "updatedAt" = NOW();
    `, {
            replacements: { value: JSON.stringify(inclusionsData) }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Settings', { key: 'standard_inclusions' }, {});
    }
};
