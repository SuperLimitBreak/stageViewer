stages['amecon'] = {
	"name": "Amecon",
	"stage": [
		{
			"type": "audio",
			"name": "audio",
			"tags": [],
			"position": {
				"display": "none",
			},
		},
		{
			"type": "screen",
			"name": "left-screen",
			"tags": ["left-screen"],
			"position": {
				"top": "200px",
				"left": "50px",
				"width": "200px",
				"height": "150px",
				"transform": "transform: rotate3d(-1, 1, 0, 45deg)",
			},
		},
		{
			"type": "screen",
			"name": "right-screen",
			"tags": ["right-screen"],
			"position": {
				"top": "200px",
				"right": "50px",
				"width": "200px",
				"height": "150px",
				"transform": "transform: rotate3d(1, 1, 0, 45deg)",
			},
		},
		{
			"type": "screen",
			"name": "back-screen",
			"tags": ["back-screen"],
			"position": {
				"top": "50px",
				"left": "400px",
				"right": "400px",
				"height": "350px",
			},
		},
		{
			"type": "screen holo",
			"name": "front-screen",
			"tags": ["front-screen"],
			"position": {
				"top": "100px",
				"left": "300px",
				"right": "300px",
				"height": "400px",
			},
		},
		{
			"type": "light",
			"name": "top-left",
			"tags": ["top-left", "top", "left", "light"],
			"position": {
				"top": "110px",
				"left": "310px",
			},
		},
		{
			"type": "light",
			"name": "bot-left",
			"tags": ["bot-left", "bot", "left", "light"],
			"position": {
				"top": "440px",
				"left": "310px",
			},
		},
		{
			"type": "light",
			"name": "top-mid",
			"tags": ["top-mid", "top", "mid", "light"],
			"position": {
				"top": "110px",
				"left": "48%",
			},
		},
		{
			"type": "light",
			"name": "bot-mid",
			"tags": ["bot-mid", "bot", "mid", "light"],
			"position": {
				"top": "440px",
				"left": "48%",
			},
		},
		{
			"type": "light",
			"name": "top-right",
			"tags": ["top-right", "top", "right", "light"],
			"position": {
				"top": "110px",
				"right": "310px",
			},
		},
		{
			"type": "light",
			"name": "bot-right",
			"tags": ["bot-right", "bot", "right", "light"],
			"position": {
				"top": "440px",
				"right": "310px",
			},
		},
	]
};
