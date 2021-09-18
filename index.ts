import { Chance } from "chance";
import images from "images";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import ora from "ora";

const __dirname = path.resolve();

type PseudoGender = "boy" | "girl";
type LayerType =
  | "background"
  | "body"
  | "eyewear"
  | "footwear"
  | "hair"
  | "pant"
  | "shirt"
  | "sweater";

// Mujer: FONDO, CUERPO, BLUSA, PANTALÓN. ACCESORIO Y PELO

type Attribute = {
  trait_type: LayerType;
  value: string;
};

const spinner = ora("Creating JSON Template").start();

const JSON_TEMPLATE = {
  name: "",
  symbol: "",
  description:
    "Someone is coming to the city! Congratulations on getting your ticket to the Metropolis. https://metropolisproject.io",
  seller_fee_basis_points: 1000, // 1000 = 10%
  attributes: [
    // { trait_type: "web", value: "yes", },
  ] as Attribute[],
  collection: {
    name: "Metropolis GEN1",
    family: "Metropolis",
  },
  properties: {
    category: "image",
    creators: [
      {
        address: "2dxeRwuUTpCULzCe48sQACRVrhD1aju9VUnFVWTYBU8z",
        share: 100,
      },
    ],
  },
};

spinner.succeed();

spinner.start("Creating layers and weights");
//#region Male stuff

const backgrounds = [
  "baby_pink",
  "city_blue",
  "lemon_cream",
  "mint_icecream",
  "pale_yellow",
];
const background_weights = [20, 20, 20, 20, 20];

const bodies = ["body_1", "body_2", "body_3", "body_4"];
const body_weights = [25, 25, 25, 25];

const footwear = ["blue", "green", "orange", "red", "white"];
const footwear_weights = [35, 35, 15, 10, 5];

const pants = [
  "black_jeans",
  "black_pants",
  "blue_jeans",
  "brown_cargos",
  "gray_joggers",
  "khaki_pants",
];
const pant_weights = [5, 15, 35, 15, 20, 10];

const hairs = [
  "black_mohawk_beard",
  "long_black",
  "long_brown",
  "long_red",
  "long_white_beard",
  "short_blonde_beard",
  "short_blonde",
];
const hair_weights = [8, 30, 5, 5, 3, 19, 30];

const shirts = [
  "black_shirt",
  "black_solana",
  "brown_shirt",
  "red_shirt",
  "white_shirt",
  "white_tank_top",
];
const shirt_weights = [7, 3, 15, 20, 30, 25];

const eyewear = [
  "black_sunglasses",
  "black_eyepatch",
  "glasses",
  "red_hearts",
  "white_sunglasses",
  "none",
];

const eyewear_weights = [15, 10, 15, 5, 20, 35];

const sweaters = [
  "black_sweater",
  "black_white_pattern",
  "red_sweater",
  "yellow_sweater",
  "no_sweater",
];

const sweater_weights = [15, 5, 15, 10, 55];

spinner.succeed();

const TOTAL_BOY = 1500;
const ALL_BOY: Array<typeof JSON_TEMPLATE> = [];
let CURRENT_BOY_CONSECUTIVE = 0;

const getLayerUri = (
  pseudoGender: PseudoGender,
  layerType: LayerType,
  layerName: string
) => {
  // const layerUri = `./layers/${pseudoGender}/${layerType}/${layerName}.png`;
  const layerUri = path.resolve(
    __dirname,
    "layers",
    pseudoGender,
    layerType,
    `${layerName}.${layerType === "background" ? "jpg" : "png"}`
  );
  spinner.info(`Got layerUri: ${layerUri}`);
  return `${layerUri}`;
};

const createBoyNFT = async () => {
  spinner.start(`Initializing boy creation: ${CURRENT_BOY_CONSECUTIVE}`);
  const chance = new Chance();

  const backgroundItem = chance.weighted(backgrounds, background_weights);
  const bodyItem = chance.weighted(bodies, body_weights);
  const footwearItem = chance.weighted(footwear, footwear_weights);
  const pantItem = chance.weighted(pants, pant_weights);
  const shirtItem = chance.weighted(shirts, shirt_weights);
  const sweaterItem = chance.weighted(sweaters, sweater_weights);
  const eyewearItem = chance.weighted(eyewear, eyewear_weights);
  const hairItem = chance.weighted(hairs, hair_weights);
  spinner.info(`Using ${backgroundItem} as background`);
  spinner.info(`Using ${bodyItem} as body`);
  spinner.info(`Using ${footwearItem} as footwear`);
  spinner.info(`Using ${pantItem} as pant`);
  spinner.info(`Using ${shirtItem} as shirt`);
  spinner.info(`Using ${sweaterItem} as sweater`);
  spinner.info(`Using ${eyewearItem} as eyewear`);
  spinner.info(`Using ${hairItem} as hair`);

  spinner.info("Writing .png file");
  images(getLayerUri("boy", "background", backgroundItem))
    .draw(images(getLayerUri("boy", "body", bodyItem)), 0, 0)
    .draw(images(getLayerUri("boy", "footwear", footwearItem)), 0, 0)
    .draw(images(getLayerUri("boy", "pant", pantItem)), 0, 0)
    .draw(images(getLayerUri("boy", "shirt", shirtItem)), 0, 0)
    .draw(images(getLayerUri("boy", "sweater", sweaterItem)), 0, 0)
    .draw(images(getLayerUri("boy", "eyewear", eyewearItem)), 0, 0)
    .draw(images(getLayerUri("boy", "hair", hairItem)), 0, 0)
    .save(
      path.resolve(
        __dirname,
        "output",
        `${CURRENT_BOY_CONSECUTIVE.toString()}.jpg`
      )
    );

  spinner.info("Writing .json file");
  const templateClone = JSON.parse(
    JSON.stringify(JSON_TEMPLATE)
  ) as typeof JSON_TEMPLATE;

  templateClone.name = `Metropolitan - ${CURRENT_BOY_CONSECUTIVE}`;
  templateClone.attributes = [
    {
      trait_type: "background",
      value: backgroundItem,
    },
    { trait_type: "body", value: bodyItem },
    { trait_type: "footwear", value: footwearItem },
    { trait_type: "pant", value: pantItem },
    { trait_type: "shirt", value: shirtItem },
    { trait_type: "sweater", value: sweaterItem },
    { trait_type: "eyewear", value: eyewearItem },
    { trait_type: "hair", value: hairItem },
  ];

  await promisify(fs.writeFile)(
    path.resolve(
      __dirname,
      "output",
      `${CURRENT_BOY_CONSECUTIVE.toString()}.json`
    ),
    JSON.stringify(templateClone, null, 2),
    "utf-8"
  );
  spinner.succeed();
  ALL_BOY.push(templateClone);
  CURRENT_BOY_CONSECUTIVE += 2; // 2 Because we're intercalating boy-girl
};

(async () => {
  do {
    await createBoyNFT();
  } while (CURRENT_BOY_CONSECUTIVE < TOTAL_BOY * 2);
})();

//#endregion

//#region Female stuff

//#endregion
