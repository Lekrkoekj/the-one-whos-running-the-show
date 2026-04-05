import * as rm from "https://deno.land/x/remapper@4.2.0/src/mod.ts"
import * as bundleInfo from '../bundleinfo.json' with { type: 'json' }
import { MODS } from "https://deno.land/x/remapper@4.1.0/src/constants/beatmap.ts";
import assets from "../bundleinfo.json" with { type: 'json' }
import { easeInOutSine } from "https://deno.land/x/remapper@4.2.0/src/utils/math/easing_functions.ts";


const pipeline = await rm.createPipeline({ bundleInfo })

const bundle = rm.loadBundle(bundleInfo)
const materials = bundle.materials
const prefabs = bundle.prefabs


// ----------- { SCRIPT } -----------

async function doMap(file: rm.DIFFICULTY_NAME, noVivify: boolean = false) {
    const map = await rm.readDifficultyV3(pipeline, file)

    if(!noVivify) map.require("Vivify", true);
    map.require("Noodle Extensions", true);
    map.suggest("Chroma", true);

    /// ---------- { FUNCTIONS } ----------

    const lightingMaterialsList = [
        materials["checkered rug"],
        materials["dark wood (shiny)"],
        materials["painting frame"],
        materials["sad clown"],
        materials["wallphoto.001"],
        materials["wallphoto.002"],
        materials["wallphoto.003"],
        materials["wallphoto.004"],
        materials["wallphoto.005"],
        materials["wallphoto.006"],
        materials["wallphoto.007"],
        materials["wallphoto.008"],
        materials["wallphoto.011"],
        materials["wallphoto.012"],
        materials["wallphoto.013"],
        materials["wallphoto.014"],
        materials["wallphoto.016"],
        materials["wallphoto.017"],
        materials["wallphoto.018"],
        materials["wallphoto.019"],
        materials["wallphoto.020"],
        materials["wallphoto.021"],
        materials["wallphoto.022"],
        materials["wallphoto.023"],
        materials["wallphoto.024"],
        materials["wallphoto.026"],
        materials["wallphoto.027"],
        materials["wallphoto.029"],
        materials["wallphoto.030"],
        materials["wallphoto.031"],
        materials["wallphoto.032"],
        materials["wallphoto.033"],
        materials.cat,
        materials.checkers,
        materials.cloth,
        materials.creature,
        materials.cyclops,
        materials.dinosaur,
        materials.dog,
        materials.gangle,
        materials.jax,
        materials.jester,
        materials.kaufmo,
        materials.kinger,
        materials.mannequin,
        materials.metal,
        materials.plant,
        materials.plastic,
        materials.pomni,
        materials.puppet,
        materials.queenie,
        materials.ragatha,
        materials.ribbit,
        materials.rubber,
        materials.wallphoto,
        materials.walls,
        materials.wood,
        materials.worm,
        materials.zooble
    ]

    function setDayNightCycle(beat: number, duration: number, from: number, to: number, precision: number) {
        precision *= duration;
        const diff = to - from;
        
        const cycleObj = { _DayNightCycle: 0}
        if(duration != 0) {
            for (let t = 0; t <= duration; t += precision) {
                const progress = t / duration;
                const value = from + diff * progress;

                cycleObj._DayNightCycle = value;
            
                lightingMaterialsList.forEach(material => {
                    material.set(map, cycleObj, beat + t);
                })
            }
        }
        lightingMaterialsList.forEach(material => {
            material.set(map, { _DayNightCycle: to }, beat + duration);
        });
    }

    /// ---------- { ENVRIONMENT } ----------

    // Non-Vivify environment enhancements
    if(noVivify) {
        rm.environment(map, {
            id: "BigTrackLaneRings",
            lookupMethod: "Contains",
            scale: [0.25, 0.25, 0.25]
        });
        rm.environmentRemoval(map, [
            "SmallTrackLaneRing",
            "FrontLights",
            "Floor"
        ])
    }

    // Vivify environment enhancements and objects
    else {
        rm.environmentRemoval(map, [
            "Spectrograms",
            "SmallTrackLaneRings",
            "BigTrackLaneRings",
            "Building",
            "FrontLights",
            "Floor",
            "Building",
            "PlayersPlace",
            "GlowLine",
            "BackColumns"
        ])

        // UI Panels
        rm.environment(map, {
            id: "LeftPanel",
            lookupMethod: "EndsWith",
            position: [-2.75, 0, 6.75],
            rotation: [0, -20, 0]
        });
        rm.environment(map, {
            id: "RightPanel",
            lookupMethod: "EndsWith",
            position: [2.75, 0, 6.75],
            rotation: [0, 20, 0]
        });

        // Lasers
        rm.environment(map, {
            id: "RotatingLaserLeft",
            lookupMethod: "EndsWith",
            position: [-3, 6.5, 10.25],
            rotation: [0, 0, 0]
        });
        rm.environment(map, {
            id: "RotatingLaserLeft (1)",
            lookupMethod: "EndsWith",
            position: [-3, 6.5, 25.75],
            rotation: [0, 0, 0]
        });
        rm.environment(map, {
            id: "RotatingLaserLeft (2)",
            lookupMethod: "EndsWith",
            position: [-3, 6.5, 41.5],
            rotation: [0, 0, 0]
        });
        rm.environment(map, {
            id: "RotatingLaserLeft (3)",
            lookupMethod: "EndsWith",
            position: [-3, 6.5, 57],
            rotation: [0, 0, 0]
        });
        rm.environment(map, {
            id: "RotatingLaserRight",
            lookupMethod: "EndsWith",
            position: [3, 6.5, 10.25],
            rotation: [0, 0, 0]
        });
        rm.environment(map, {
            id: "RotatingLaserRight (1)",
            lookupMethod: "EndsWith",
            position: [3, 6.5, 25.75],
            rotation: [0, 0, 0]
        });
        rm.environment(map, {
            id: "RotatingLaserRight (2)",
            lookupMethod: "EndsWith",
            position: [3, 6.5, 41.5],
            rotation: [0, 0, 0]
        });
        rm.environment(map, {
            id: "RotatingLaserRight (3)",
            lookupMethod: "EndsWith",
            position: [3, 6.5, 57],
            rotation: [0, 0, 0]
        });

        // Floor Tubes
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 41 } },
            localPosition: [-3.5, -0.179, 15.9488],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 42 } },
            localPosition: [3.46, -0.179, 15.9488],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 43 } },
            localPosition: [-3.5, -0.179, 23.751],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 44 } },
            localPosition: [3.46, -0.179, 23.751],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 45 } },
            localPosition: [-3.5, -0.179, 31.543],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 46 } },
            localPosition: [3.46, -0.179, 31.543],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 47 } },
            localPosition: [-3.5, -0.179, 39.338],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 48 } },
            localPosition: [3.46, -0.179, 39.338],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 49 } },
            localPosition: [-3.5, -0.179, 47.136],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: { shader: "TransparentLight" },
            components: { ILightWithId: { type: 1, lightID: 50 } },
            localPosition: [3.46, -0.179, 47.136],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
    }

    // Ceiling lamps
    if(!noVivify) {
        let lampPositions = [
            12.055, 19.848, 27.647, 35.433, 43.238, 51.027, 58.821, 66.617,
            74.413, 82.214, 89.703, 4.266, -3.532, -11.332, -19.129, -26.922
        ]

        let index = 9;
        lampPositions.forEach(pos => {
            rm.geometry(map, {
                type: "Sphere",
                material: { shader: "OpaqueLight" },
                components: { ILightWithId: { type: 0, lightID: index } },
                localPosition: [-0.026, 6.7325, pos],
                rotation: [0, 0, 0],
                scale: [1.703471, 0.9907869, 1.703471]
            });
            index++;
        })
    }

    // Convert ceiling lamps to back lasers for non-vivify diffs & tube lights to ring lights
    if (noVivify) map.lightEvents.forEach(event => { 
        if (typeof event.lightID === "number") {
            let lightID = event.lightID;
            if (event.type == 0) lightID -= 9;
            if (event.type == 1) lightID -= 40;
            event.lightID = lightID;
        }
    });

    // Make tube lights brighter
    if (!noVivify) map.lightEvents.forEach(event => { 
        if (typeof event.chromaColor?.[3] === "number") {
            let opacity = event.chromaColor?.[3];
            if(event.type == 1) opacity *= 1.5;
            event.chromaColor[3] = opacity;
        }
    });

    // Prefab instantiations
    prefabs.animatedlyrics.instantiate(map, 0);
    prefabs.dormhall.instantiate(map, 0);
    prefabs.explosionverse.instantiate(map, 193.75);
    prefabs.explosionend.instantiate(map, 353.531); 

    /// ---------- { EVENTS } ----------
    setDayNightCycle(0, 0, 0, 0, 1);
    setDayNightCycle(78.75, 1, 0, -0.25, 1/16); 
    setDayNightCycle(87, 3, -1, 0.5, 1/32); 
    setDayNightCycle(126, 1, 0.75, 0.5, 1/16);
    setDayNightCycle(186, 5, 0.75, 0.4, 1/32);
    setDayNightCycle(193.75, 4, 0.75, 0.4, 1/32);
    setDayNightCycle(201.75, 4.25, 0.9, 0.5, 1/32);
    setDayNightCycle(210, 2, 0.75, 0.4, 1/32);
    setDayNightCycle(216, 1, 0.4, 0.5, 1/16);
    setDayNightCycle(243.75, 1, 0.5, 0, 1/16);
    setDayNightCycle(252, 24.5, 0, 0.5, 1/64);
    setDayNightCycle(276.5, 3.5, 0.5, 0.2, 1/16);
    setDayNightCycle(280, 16, 0.5, 0.8, 1/48);
    setDayNightCycle(320.75, 1, 0.8, 0.3, 1/16);
    setDayNightCycle(322.937, 1, 0.8, 0.3, 1/16);
    setDayNightCycle(325, 0.75, 0.8, 0.3, 1/16);
    setDayNightCycle(325.875, 1, 0.8, 0.3, 1/16);
    setDayNightCycle(327, 1, 0.3, 0.8, 1/16);
    setDayNightCycle(335, 1, 0.8, 0.4, 1/16);
    setDayNightCycle(339, 1, 0.4, -0.25, 1/16);
    setDayNightCycle(346.531, 0.25, -0.25, 1, 1/32);
    setDayNightCycle(353.531, 5, 0.8, 0, 1/32);

    // Reduce reaction time for speed up at the end
    map.allNotes.forEach(note => {
        if(map.difficultyInfo.difficulty == "ExpertPlus") {
            if(note.beat >= 296 && note.beat <= 335) {
                note.noteJumpStartBeatOffset = 0
            }
        }
    })

    /// ---------- { PIXY STUFF } ----------

    const spinNoteKeys = new Set<string>()
    map.colorNotes
        .filter(n => n.beat >= 252 && n.beat < 263 && n)
        .forEach(n => spinNoteKeys.add(`${n.beat}-${n.x}-${n.y}`))

    map.allNotes.forEach(note => {
        const key = `${note.beat}-${note.x}-${note.y}`
        const isSpinNote = spinNoteKeys.has(key)
        
        if (isSpinNote) {
            if(map.difficultyInfo.characteristic != "Lawless") note.track.value = 'spinBody'
        } else {
            note.track.add('noteTrack')
            note.track.add('allNotes')
        }

        // Pop-in animation for all notes
        if (note.beat >= 0 && note.beat <= 360) {
            note.animation.scale = [
                [0, 0, 0, 0],
                [1.2, 1.2, 1.2, 0.12, 'easeOutBack'],
                [1, 1, 1, 0.22, 'easeInOutQuad'],
                [1, 1, 1, 1],
            ]
            note.animation.dissolve = [
                [0, 0],
                [1, 0.05],
                [1, 1],
            ]
        }
    })

    // Create fake arrow notes for spin section
    if (!noVivify) {
        
        map.colorNotes
            .filter(n => n.beat >= 252 && n.beat < 263)
            .forEach(note => {
                rm.colorNote(map, {
                    beat: note.beat,
                    x: note.x,
                    y: note.y,
                    color: note.color,
                    cutDirection: note.cutDirection,
                    fake: true,
                    uninteractable: true,
                    disableNoteGravity: true,
                    disableNoteLook: true,
                    spawnEffect: false,
                    track: 'staticArrow',
                    animation: {
                        scale: [
                            [0, 0, 0, 0],
                            [1.2, 1.2, 1.2, 0.12, 'easeOutBack'],
                            [1, 1, 1, 0.22, 'easeInOutQuad'],
                            [1, 1, 1, 1],
                        ]
                    }
                })
            })
    }

    // Apply custom note prefab to normal notes (NOT spin notes pls pls pls)
    if (!noVivify) {
        rm.assignObjectPrefab(map, {
            colorNotes: {
                track: "allNotes",
                asset: prefabs.customnote.path,
                debrisAsset: prefabs.customnotedebris.path,
                anyDirectionAsset: prefabs.customnotedot.path
            },
            chainHeads: {
                track: "allNotes",
                asset: prefabs.customchain.path,
                debrisAsset: prefabs.customchaindebris.path
            },
            chainLinks: {
                track: "allNotes",
                asset: prefabs.customchainlink.path,
                debrisAsset: prefabs.customchainlinkdebris.path
            }
        })

        rm.assignObjectPrefab(map, {
            colorNotes: {
                track: 'spinBody',
                asset: prefabs.customnotebodyonly.path,
                debrisAsset: prefabs.customnotedebris.path
            }
        })

        rm.assignObjectPrefab(map, {
            colorNotes: {
                track: 'staticArrow',
                asset: prefabs.customnotearrowonly.path,
            }
        })
    }

    // Note shadows
    if (!noVivify) {
        const shadowPositions = new Set();
        map.allNotes.forEach(note => {
            // Skip spin notes
            if (note.beat >= 252 && note.beat < 263) return;
            
            const key = `${note.beat}-${note.x}`;
            if (shadowPositions.has(key)) return;
            shadowPositions.add(key);
            
            let trackName = "noteShadowsFull";
            if (note.y == 1) trackName = "noteShadowsHalf"
            else if (note.y == 2) trackName = "noteShadowsFaint"
            
            rm.colorNote(map, {
                beat: note.beat,
                x: note.x,
                y: 0,
                track: trackName,
                fake: true,
                disableNoteLook: true,
                disableNoteGravity: true,
                spawnEffect: false,
                uninteractable: true,
            })
        });

        rm.assignObjectPrefab(map, {
            colorNotes: {
                track: "noteShadowsFull",
                asset: prefabs["custom note shadow full"].path,
            },
            chainHeads: {
                track: "noteShadowsFull",
                asset: prefabs["custom note shadow full"].path,
            },
            chainLinks: {
                track: "noteShadowsFull",
                asset: prefabs["custom note shadow full"].path,
            },
        })
        rm.assignObjectPrefab(map, {
            colorNotes: {
                track: "noteShadowsHalf",
                asset: prefabs["custom note shadow half"].path,
            },
            chainHeads: {
                track: "noteShadowsHalf",
                asset: prefabs["custom note shadow half"].path,
            },
            chainLinks: {
                track: "noteShadowsHalf",
                asset: prefabs["custom note shadow half"].path,
            },
        })
        rm.assignObjectPrefab(map, {
            colorNotes: {
                track: "noteShadowsFaint",
                asset: prefabs["custom note shadow faint"].path,
            },
            chainHeads: {
                track: "noteShadowsFaint",
                asset: prefabs["custom note shadow faint"].path,
            },
            chainLinks: {
                track: "noteShadowsFaint",
                asset: prefabs["custom note shadow faint"].path,
            },
        })
    }

    // ─── SPIN ANIMATION ──────────────────────────────────────────────────────
    /*rm.animateTrack(map, {
        beat: 252,
        duration: 11,
        track: 'spinBody',
        animation: {
            localRotation: [
                [0, 0, 0, 0],
                [0, 0, 180, 0.25, 'easeInOutSine'],
                [0, 0, 360, .5, 'easeInOutSine'],
                [0, 0, 180, 0.75, 'easeInOutSine'],
                [0, 0, 360, 1, 'easeInOutSine'],
            ]
        }
    })*/
   if(map.difficultyInfo.characteristic != "Lawless") {
        map.allNotes.forEach(note => {
            if(note.track.has("spinBody")) {
                note.animation.localRotation = [
                    [0, 0, 90, 0],
                    [0, 0, 0, 0.4, "easeInOutSine"]
                ]
            }
        })
    }

    // ─── NOTE TRACK ANIMATIONS ───────────────────────────────────────────────
    // "don't need to SCREAM"
    rm.animateTrack(map, {
        beat: 110,
        duration: 1.5,
        track: 'noteTrack',
        animation: {
            offsetPosition: [
                [0, 0, 0, 0],
                [-1, 0, 0, 0.08, 'easeOutExpo'],
                [0, 0, 0, 1, 'easeOutBack'],
                [0, 0, 0, 1],
            ]
        }
    })

    // "why bite the HAND that feeds"
    map.walls.forEach(wall => {
        if(wall.beat >= 126 && wall.beat <= 127) {
            wall.track.add("handWalls")
        }
    })
    rm.animateTrack(map, {
        beat: 126,
        duration: 1.5,
        track: ["noteTrack", "handWalls"],
        animation: {
            offsetPosition: [
                [0, 0, 0, 0],
                [-1, 0, 0, 0.08, 'easeOutExpo'],
                [0, 0, 0, 1, 'easeOutBack'],
                [0, 0, 0, 1],
            ]
        }
    })

    // shock
    rm.animateTrack(map, {
        beat: 201.75,
        duration: 2,
        track: 'noteTrack',
        animation: {
            offsetPosition: [
                [0, 0, 0, 0],
                [0.3, 0.2, 0, 0.05],
                [-0.3, -0.2, 0, 0.10],
                [0.4, 0.3, 0, 0.15],
                [-0.4, -0.3, 0, 0.20],
                [0.3, 0.4, 0, 0.25],
                [-0.3, 0.3, 0, 0.30],
                [0.4, -0.2, 0, 0.35],
                [-0.4, 0.2, 0, 0.40],
                [0.2, 0.3, 0, 0.50],
                [-0.2, -0.3, 0, 0.60],
                [0.1, 0.1, 0, 0.75],
                [-0.1, -0.1, 0, 0.85],
                [0, 0, 0, 1, 'easeOutQuad'],
                [0, 0, 0, 1],
            ],
            scale: [
                [1, 1, 1, 0],
                [1.05, 1.05, 1.05, 0.05],
                [0.95, 0.95, 0.95, 0.10],
                [1.05, 1.05, 1.05, 0.20],
                [0.95, 0.95, 0.95, 0.30],
                [1.05, 1.05, 1.05, 0.40],
                [1, 1, 1, 0.60],
                [1, 1, 1, 1],
            ]
        }
    })
    // "watch where you WALK"
    map.walls.forEach(wall => {
        if(wall.beat >= 209.5 && wall.beat <= 211) {
            wall.track.add("watchWhereYouWalk")
        }
    })
    rm.animateTrack(map, {
        beat: 207.5,
        duration: 3,
        track: "watchWhereYouWalk",
        
        animation: {
            offsetPosition: [
                [-3, 1, 0, 0],
                [-1.25, 0.5, 0, 0.69],
                [-0.25, 0, 0, 4/5, "easeOutBounce"]
            ],
            //// ADD POP IN SCALE EFFECT FOR MORE OF A JUMPSCARE
            scale: [
                [0, 0, 0, 0],
                [0.5, 0.3, 0.5, 0.69],
                [1, 1, 1, 4/5, "easeOutBounce"]
            ]
        }
    })

    // "what a GODDAMN SHAME" *stomp*
    map.walls.forEach(wall => {
        if(wall.beat >= 243.5 && wall.beat <= 244) {
            wall.noteJumpStartBeatOffset = 0.25
            wall.animation = {
                offsetPosition: [
                    [0, 2, 0, 0],
                    [0, 1, 0, 0.35, "easeOutQuad"],
                    [0, 0, 0, 0.4]
                ]
            }
        }
    })

    // ─── WALL SHAKE ──────────────────────────────────────────────────────────
    map.walls.forEach(wall => {
        if (wall.beat >= 187.25 && wall.beat <= 191) {
            wall.animation = {
                offsetPosition: [
                    [0, 0, 0, 0],
                    [0.5, 0, 0, 0.07, "easeInOutQuad"],
                    [-0.5, 0, 0, 0.14, "easeInOutQuad"],
                    [0.4, 0, 0, 0.21, "easeInOutQuad"],
                    [-0.4, 0, 0, 0.28, "easeInOutQuad"],
                    [0.5, 0, 0, 0.35, "easeInOutQuad"],
                    [-0.5, 0, 0, 0.42, "easeInOutQuad"],
                    [0.3, 0, 0, 0.49, "easeInOutQuad"],
                    [-0.3, 0, 0, 0.56, "easeInOutQuad"],
                    [0.4, 0, 0, 0.63, "easeInOutQuad"],
                    [-0.4, 0, 0, 0.70, "easeInOutQuad"],
                    [0.2, 0, 0, 0.77, "easeInOutQuad"],
                    [-0.2, 0, 0, 0.84, "easeInOutQuad"],
                    [0.1, 0, 0, 0.92, "easeInOutQuad"],
                    [0, 0, 0, 1, "easeInOutQuad"],
                ]
            }
        }
    })

    // ─── EXPLOSION ───────────────────────────────────────────────────────────
    map.bombs
        .filter(b => b.beat >= 194 && b.beat < 196)
        .forEach(bomb => bomb.track.add('explodeBombs'))

    map.walls
        .filter(w => w.beat >= 194 && w.beat < 196)
        .forEach(wall => wall.track.add('explodeWalls'))

    rm.animateTrack(map, {
        beat: 193.75,
        duration: 1,
        track: 'explodeBombs',
        animation: {
            offsetPosition: [
                [0, 0, 0, 0.10],
                [-4, 3, 0, 1, 'easeOutExpo'],
                [-4, 3, 0, 1],
            ],
            scale: [
                [1, 1, 1, 0],
                [2.5, 2.5, 2.5, 0.15, 'easeOutExpo'],
                [0, 0, 0, 1, 'easeInQuad'],
                [0, 0, 0, 1],
            ],
            dissolve: [
                [1, 0],
                [1, 0.5],
                [0, 1],
            ]
        }
    })

    rm.animateTrack(map, {
        beat: 193.75,
        duration: 1,
        track: 'explodeWalls',
        animation: {
            offsetPosition: [
                [0, 0, 0, 0],
                [-8, 3, 0, 1, 'easeOutExpo'],
                [-8, 3, 0, 1],
            ],
            dissolve: [
                [1, 0],
                [1, 0.5],
                [0, 1],
            ]
        }
    })

}

await Promise.all([
    // Vivify diffs
    doMap('ExpertPlusStandard', false),
    doMap('HardStandard', false),
    doMap('EasyStandard', false),

    // Non-vivify diffs
    doMap('ExpertPlusLawless', true),
    doMap('HardLawless', true),
    doMap('EasyLawless', true),
])

// ----------- { OUTPUT } -----------

pipeline.export({
    outputDirectory: '../OutputMaps/Running The Show'
})