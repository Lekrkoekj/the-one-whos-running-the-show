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
    if(noVivify) map.suggest("Cinema", true);

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
    /**
     * Linearly changes the day/night cycle of the environment.
     * @param beat The beat on which this event should start.
     * @param duration How many beats this event should take.
     * @param from The value of the day/night cycle at the beginning of the event.
     * @param to The value of the day/night cycle at the end of the event.
     * @param precision How smooth the event should look / how many custom events this should take.
     */
    function setDayNightCycle(beat: number, duration: number, from: number, to: number, precision: number) {
        precision *= duration; // make the precision not per 1 beat, but scale over the entire length of the event
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
            position: [
                -2.75,
                0,
                6.75
            ],
            rotation: [
                0,
                -20,
                0
            ]
        });
        rm.environment(map, {
            id: "RightPanel",
            lookupMethod: "EndsWith",
            position: [
                2.75,
                0,
                6.75
            ],
            rotation: [
                0,
                20,
                0
            ]
        });

        // Lasers
        rm.environment(map, {
            id: "RotatingLaserLeft",
            lookupMethod: "EndsWith",
            position: [
                -3, 
                6.5, 
                10.25
            ],
            rotation: [
                0,
                0,
                0
            ]
        });
        rm.environment(map, {
            id: "RotatingLaserLeft (1)",
            lookupMethod: "EndsWith",
            position: [
                -3, 
                6.5, 
                25.75
            ],
            rotation: [
                0,
                0,
                0
            ]
        });

        rm.environment(map, {
            id: "RotatingLaserLeft (2)",
            lookupMethod: "EndsWith",
            position: [
                -3, 
                6.5, 
                41.5
            ],
            rotation: [
                0,
                0,
                0
            ]
        });

        rm.environment(map, {
            id: "RotatingLaserLeft (3)",
            lookupMethod: "EndsWith",
            position: [
                -3, 
                6.5, 
                57
            ],
            rotation: [
                0,
                0,
                0
            ]
        });

        rm.environment(map, {
            id: "RotatingLaserRight",
            lookupMethod: "EndsWith",
            position: [
                3, 
                6.5, 
                10.25
            ],
            rotation: [
                0,
                0,
                0
            ]
        });
        rm.environment(map, {
            id: "RotatingLaserRight (1)",
            lookupMethod: "EndsWith",
            position: [
                3, 
                6.5, 
                25.75
            ],
            rotation: [
                0,
                0,
                0
            ]
        });

        rm.environment(map, {
            id: "RotatingLaserRight (2)",
            lookupMethod: "EndsWith",
            position: [
                3, 
                6.5, 
                41.5
            ],
            rotation: [
                0,
                0,
                0
            ]
        });

        rm.environment(map, {
            id: "RotatingLaserRight (3)",
            lookupMethod: "EndsWith",
            position: [
                3, 
                6.5, 
                57
            ],
            rotation: [
                0,
                0,
                0
            ]
        });

        // Floor Tubes
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 41
                }
            },
            localPosition: [-3.5, -0.179, 15.9488],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 42
                }
            },
            localPosition: [3.46, -0.179, 15.9488],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 43
                }
            },
            localPosition: [-3.5, -0.179, 23.751],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 44
                }
            },
            localPosition: [3.46, -0.179, 23.751],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 45
                }
            },
            localPosition: [-3.5, -0.179, 31.543],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 46
                }
            },
            localPosition: [3.46, -0.179, 31.543],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 47
                }
            },
            localPosition: [-3.5, -0.179, 39.338],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 48
                }
            },
            localPosition: [3.46, -0.179, 39.338],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 49
                }
            },
            localPosition: [-3.5, -0.179, 47.136],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
        rm.geometry(map, {
            type: "Cylinder",
            material: {
                shader: "TransparentLight"
            },
            components: {
                ILightWithId: {
                    type: 1,
                    lightID: 50
                }
            },
            localPosition: [3.46, -0.179, 47.136],
            rotation: [90, 0, 0],
            scale: [0.22905, 2.547955, 0.2290501]
        });
    }

    // Ceiling lamps
    if(!noVivify) {
        let lampPositions = [
            12.055,
            19.848,
            27.647,
            35.433,
            43.238,
            51.027,
            58.821,
            66.617,
            74.413,
            82.214,
            89.703,
            4.266,
            -3.532,
            -11.332,
            -19.129,
            -26.922
        ]

        let index = 9;
        lampPositions.forEach(pos => {
            rm.geometry(map, {
                type: "Sphere",
                material: {
                    shader: "OpaqueLight"
                },
                components: {
                    ILightWithId: {
                        type: 0,
                        lightID: index
                    }
                },
                localPosition: [-0.026, 6.7325, pos],
                rotation: [0, 0, 0],
                scale: [1.703471, 0.9907869, 1.703471]
            });
            index++;
        })
    }

    // Assign all notes to a track
    if(!noVivify) map.allNotes.forEach(note => {
        note.track.add("allNotes")
    })

    // Apply custom note prefab to all notes
    if(!noVivify) rm.assignObjectPrefab(map, {
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

    // Convert ceiling lamps to back lasers for non-vivify diffs & tube lights to ring lights
    if (noVivify) map.lightEvents.forEach(event => { 
        if (typeof event.lightID === "number") {
            let lightID = event.lightID;
    
            if (event.type == 0) {
                lightID -= 9;
            }
    
            if (event.type == 1) {
                lightID -= 40;
            }
    
            event.lightID = lightID;
        }
    });

    // Make tube lights brighter
    if (!noVivify) map.lightEvents.forEach(event => { 
        if (typeof event.chromaColor?.[3] === "number") {
            let opacity = event.chromaColor?.[3];

            if(event.type == 1) {
                opacity *= 1.5;
            }
            event.chromaColor[3] = opacity;
        }
        
    });

    // Note shadows 
    if(!noVivify) {
        const shadowPositions = new Set();
        map.allNotes.forEach(note => {
            // Create a unique key for this shadow position
            const key = `${note.beat}-${note.x}`;

            // If a shadow for this column & beat was already spawned → skip
            if (shadowPositions.has(key)) return;
            shadowPositions.add(key);
            let trackName = "noteShadowsFull";
            if(note.y == 1) trackName = "noteShadowsHalf"
            else if(note.y == 2) trackName = "noteShadowsFaint"
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
                // animation: {
                //     localRotation: [[0, 0, 0, 0]]
                // }
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
    setDayNightCycle(327, 1, 0.3, 0.8 , 1/16);
    setDayNightCycle(335, 1, 0.8, 0.4, 1/16);
    setDayNightCycle(339, 1, 0.4, -0.25, 1/16);
    setDayNightCycle(346.531, 0.25, -0.25, 1, 1/32);
    setDayNightCycle(353.531, 5, 0.8, 0, 1/32);
}

await Promise.all([
    doMap('ExpertPlusStandard', false),
    doMap('ExpertPlusLawless', true)
])

// ----------- { OUTPUT } -----------

pipeline.export({
    outputDirectory: '../OutputMaps/Running The Show'
})