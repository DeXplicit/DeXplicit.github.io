window.DEX_DATA = {
  "rgb": [
    {
      "id": "002362-part01",
      "title": "Toy-house reorientation",
      "tag": "Rotation",
      "description": "Two hands reorient a toy house. Watch the roof edges and object identity as new surfaces become visible.",
      "paperLabel": "S4",
      "base": "assets/002362-part01",
      "frames": 33,
      "protocol": "DeXplicit renderer (14B)",
      "crop": [
        180,
        60,
        832,
        480
      ]
    },
    {
      "id": "002082-part00",
      "title": "Flask lift & tilt",
      "tag": "Lift & tilt",
      "description": "A flask lifts away from the table and tilts, with a changing viewpoint and partial hand occlusion.",
      "paperLabel": "S3",
      "base": "assets/002082-part00",
      "frames": 33,
      "protocol": "DeXplicit renderer (14B)",
      "crop": [
        160,
        120,
        800,
        480
      ]
    },
    {
      "id": "002408-part00",
      "title": "Spoon transfer",
      "tag": "Bimanual",
      "description": "A spoon passes between the hands over a bowl, combining articulated finger motion with object transport.",
      "paperLabel": "S1",
      "base": "assets/002408-part00",
      "frames": 33,
      "protocol": "DeXplicit renderer (14B)",
      "crop": [
        260,
        180,
        800,
        480
      ]
    },
    {
      "id": "002422-part01",
      "title": "Coffee-pot lift",
      "tag": "Transport",
      "description": "A coffee pot rises from the desk and changes orientation as the hand carries it forward.",
      "paperLabel": "S6",
      "base": "assets/002422-part01",
      "frames": 33,
      "protocol": "DeXplicit renderer (14B)",
      "crop": [
        100,
        120,
        832,
        480
      ]
    }
  ],
  "geometry": [
    {
      "id": "01",
      "title": "In-hand object transport",
      "dataset": "HOT3D",
      "base": "assets/geometry-01",
      "sample": "clip-002751-part01",
      "motion": 794.0,
      "error": 28.9,
      "fps": 8
    },
    {
      "id": "03",
      "title": "Pick and place",
      "dataset": "HOT3D",
      "base": "assets/geometry-03",
      "sample": "clip-002775-part01",
      "motion": 491.8,
      "error": 28.8,
      "fps": 8
    },
    {
      "id": "04",
      "title": "Object reorientation",
      "dataset": "HOT3D",
      "base": "assets/geometry-04",
      "sample": "clip-002285-part00",
      "motion": 624.5,
      "error": 58.8,
      "fps": 8
    },
    {
      "id": "05",
      "title": "Bimanual handover",
      "dataset": "OakInk2",
      "base": "assets/geometry-05",
      "sample": "scene_03__A008_seq__0920ef008fac6fefdd88__2023-04-23-11-23-08-part01",
      "motion": 120.1,
      "error": 13.7,
      "fps": 8
    }
  ],
  "causal": [
    {
      "id": "box",
      "title": "Box reorientation",
      "src": "assets/causal-box-crop.mp4",
      "poster": "assets/causal-box-crop.jpg",
      "full": "assets/causal-box.mp4",
      "crop": [
        220,
        160,
        790,
        480
      ]
    },
    {
      "id": "bottle",
      "title": "Bottle rotation",
      "src": "assets/causal-bottle-crop.mp4",
      "poster": "assets/causal-bottle-crop.jpg",
      "full": "assets/causal-bottle.mp4",
      "crop": [
        300,
        200,
        800,
        480
      ]
    },
    {
      "id": "plant",
      "title": "Toy-to-container interaction",
      "src": "assets/causal-plant-crop.mp4",
      "poster": "assets/causal-plant-crop.jpg",
      "full": "assets/causal-plant.mp4",
      "crop": [
        156,
        100,
        832,
        480
      ]
    }
  ],
  "spatial": [
    {
      "id": "3",
      "title": "Laptop-lid motion",
      "dataset": "oakink2",
      "state": 24,
      "paths": {
        "reference": "assets/spatial-3-reference.jpg",
        "pointworld": "assets/spatial-3-pointworld.jpg",
        "ours": "assets/spatial-3-ours.jpg"
      },
      "error": {
        "ours": 17.092830657958984,
        "pointworld": 31.04903221130371
      },
      "note": "Selected saved forecast from the paper."
    },
    {
      "id": "4",
      "title": "Cloth deformation",
      "dataset": "phystwin",
      "state": 20,
      "paths": {
        "reference": "assets/spatial-4-reference.jpg",
        "pointworld": "assets/spatial-4-pointworld.jpg",
        "ours": "assets/spatial-4-ours.jpg"
      },
      "error": {
        "ours": 31.328901290893555,
        "pointworld": 69.43275451660156
      },
      "note": "Selected illustration from a training sequence."
    },
    {
      "id": "5",
      "title": "Rope pushing",
      "dataset": "phystwin",
      "state": 32,
      "paths": {
        "reference": "assets/spatial-5-reference.jpg",
        "pointworld": "assets/spatial-5-pointworld.jpg",
        "ours": "assets/spatial-5-ours.jpg"
      },
      "error": {
        "ours": 19.070476531982422,
        "pointworld": 89.70005798339844
      },
      "note": "Selected illustration from a training sequence."
    }
  ]
};
