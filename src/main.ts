import * as rm from "https://deno.land/x/remapper@4.2.0/src/mod.ts"
import * as bundleInfo from '../bundleinfo.json' with { type: 'json' }

const pipeline = await rm.createPipeline({ bundleInfo })

const bundle = rm.loadBundle(bundleInfo)
const materials = bundle.materials
const prefabs = bundle.prefabs

// ----------- { SCRIPT } -----------

async function doMap(file: rm.DIFFICULTY_NAME, noVivify: boolean = false) {
    const map = await rm.readDifficultyV3(pipeline, file)

    if(!noVivify) map.require("Vivify", true);
    if(!noVivify) map.require("Noodle Extensions", true);
    map.suggest("Chroma", true);
    map.suggest("Cinema", true);


    // Non-Vivify environment enhancements
    if(noVivify) {
        rm.environment(map, {
            id: "BigTrackLaneRings",
            lookupMethod: "Contains",
            scale: [
                0.25,
                0.25,
                0.25
            ]
        });
        rm.environmentRemoval(map, [
            "SmallTrackLaneRing",
            "FrontLights",
            "Floor"
        ])
    }

    prefabs.plane.instantiate(map, 0);

    // Example: Run code on every note!

    // map.allNotes.forEach(note => {
    //     console.log(note.beat)
    // })

    // For more help, read: https://github.com/Swifter1243/ReMapper/wiki
}

await Promise.all([
    doMap('ExpertPlusStandard', false)
])

// ----------- { OUTPUT } -----------

pipeline.export({
    outputDirectory: '../OutputMaps/Running The Show'
})
