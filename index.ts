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
  | "accessory"
  | "footwear"
  | "hair"
  | "pant"
  | "shirt"
  | "sweater";

type Attribute = {
  trait_type: LayerType;
  value: string;
};

const spinner = ora("Creating JSON Template").start();

const JSON_TEMPLATE = {
  name: "",
  symbol: "",
  image: "0.jpg",
  description:
    "Someone is coming to the city! Congratulations on getting your ticket to the Metropolis. https://metropolisproject.io",
  seller_fee_basis_points: 1200, // 1000 = 12%
  attributes: [
    // { trait_type: "web", value: "yes", },
  ] as Attribute[],
  collection: {
    name: "Metropolis GEN1",
    family: "Metropolis",
  },
  properties: {
    files: [
      {
        uri: "image.jpg",
        type: "image/png",
      },
    ],
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

const backgrounds = [
  "baby_pink",
  "city_blue",
  "lemon_cream",
  "mint_icecream",
  "pale_yellow",
];
const background_weights = [20, 20, 20, 20, 20];

// #region Boy stuff

const boy_bodies = ["body_1", "body_2", "body_3", "body_4"];
const boy_body_weights = [25, 25, 25, 25];

const boy_footwear = ["blue", "green", "orange", "red", "white"];
const boy_footwear_weights = [35, 35, 15, 10, 5];

const boy_pants = [
  "black_jeans",
  "black_pants",
  "blue_jeans",
  "brown_cargos",
  "gray_joggers",
  "khaki_pants",
];
const boy_pant_weights = [5, 15, 35, 15, 20, 10];

const boy_hairs = [
  "black_mohawk_beard",
  "long_black",
  "long_brown",
  "long_red",
  "long_white_beard",
  "short_blonde_beard",
  "short_blonde",
];
const boy_hair_weights = [8, 30, 5, 5, 3, 19, 30];

const boy_shirts = [
  "black_shirt",
  "black_solana",
  "brown_shirt",
  "red_shirt",
  "white_shirt",
  "white_tank_top",
];
const boy_shirt_weights = [7, 3, 15, 20, 30, 25];

const boy_accessories = [
  "black_sunglasses",
  "black_eyepatch",
  "glasses",
  "red_hearts",
  "white_sunglasses",
  "none",
];

const boy_accessory_weights = [15, 10, 15, 5, 20, 35];

const boy_sweaters = [
  "black_sweater",
  "black_white_pattern",
  "red_sweater",
  "yellow_sweater",
  "no_sweater",
];

const boy_sweater_weights = [15, 5, 15, 10, 55];

//#endregion

//#region Girl stuff

const girl_accessories = [
  "black_sunglasses",
  "glasses",
  "pearl_necklace",
  "round_glasses",
  "solana_necklace",
];
const girl_accessory_weights = [30, 20, 10, 10, 30];

const girl_bodies = ["body_1", "body_2", "body_3"];
const girl_body_weights = [33, 33, 34];

const girl_footwears = [
  "black_ankle_boots",
  "black_high_heels",
  "red_ankle_boots",
  "white_ankle_boots",
  "white_high_heels",
];
const girl_footwear_weights = [27, 15, 27, 26, 5];

const girl_hairs = [
  "long_black_hair",
  "long_light_blue_hair",
  "long_orange_hair",
  "pink_hair",
  "short_maroon_hair",
  "short_red_hair",
];
const girl_hair_weights = [30, 5, 20, 10, 25, 10];

const girl_pants = [
  "blue_pants",
  "blue_skirt",
  "green_pants",
  "red_skirt",
  "white_pants",
];
const girl_pant_weights = [40, 5, 20, 5, 30];

const girl_shirts = [
  "pink_sweatshirt",
  "red_shirt",
  "shouldless_black_blouse",
  "strappy_blouse",
  "turquoise_shirt",
  "yellow_sweatshirt",
];
const girl_shirt_weights = [15, 10, 35, 25, 10, 5];

//#endregion

spinner.succeed();

const TOTAL_BOY = 15;
const ALL_BOY: Array<typeof JSON_TEMPLATE> = [];

const TOTAL_GIRL = 15;
const ALL_GIRL: Array<typeof JSON_TEMPLATE> = [];

let CURRENT_BOY_CONSECUTIVE = 0;
let CURRENT_GIRL_CONSECUTIVE = 1;

const getLayerUri = (
  pseudoGender: PseudoGender,
  layerType: LayerType,
  layerName: string
) => {
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
  const bodyItem = chance.weighted(boy_bodies, boy_body_weights);
  const footwearItem = chance.weighted(boy_footwear, boy_footwear_weights);
  const pantItem = chance.weighted(boy_pants, boy_pant_weights);
  const shirtItem = chance.weighted(boy_shirts, boy_shirt_weights);
  const sweaterItem = chance.weighted(boy_sweaters, boy_sweater_weights);
  const accessoryItem = chance.weighted(boy_accessories, boy_accessory_weights);
  const hairItem = chance.weighted(boy_hairs, boy_hair_weights);

  spinner.info("Writing .jpg file");
  await new Promise<void>((res, reject) =>
    images(getLayerUri("boy", "background", backgroundItem))
      .draw(images(getLayerUri("boy", "body", bodyItem)), 0, 0)
      .draw(images(getLayerUri("boy", "footwear", footwearItem)), 0, 0)
      .draw(images(getLayerUri("boy", "pant", pantItem)), 0, 0)
      .draw(images(getLayerUri("boy", "shirt", shirtItem)), 0, 0)
      .draw(images(getLayerUri("boy", "sweater", sweaterItem)), 0, 0)
      .draw(images(getLayerUri("boy", "accessory", accessoryItem)), 0, 0)
      .draw(images(getLayerUri("boy", "hair", hairItem)), 0, 0)
      .saveAsync(
        path.resolve(
          __dirname,
          "output",
          `${CURRENT_BOY_CONSECUTIVE.toString()}.jpg`
        ),
        (err) => {
          if (err) {
            reject(err);
          } else {
            res();
          }
        }
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
    { trait_type: "accessory", value: accessoryItem },
    { trait_type: "hair", value: hairItem },
  ];
  templateClone.image = `${CURRENT_BOY_CONSECUTIVE}.jpg`;

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

const createGirlNFT = async () => {
  spinner.start(`Initializing girl creation: ${CURRENT_GIRL_CONSECUTIVE}`);
  const chance = new Chance();
  // Mujer: FONDO, CUERPO, BLUSA, PANTALÓN, ACCESORIO Y PELO
  const backgroundItem = chance.weighted(backgrounds, background_weights);
  const bodyItem = chance.weighted(girl_bodies, girl_body_weights);
  const shirtItem = chance.weighted(girl_shirts, girl_shirt_weights);
  const pantItem = chance.weighted(girl_pants, girl_pant_weights);
  const footwearItem = chance.weighted(girl_footwears, girl_footwear_weights);
  const accessoryItem = chance.weighted(
    girl_accessories,
    girl_accessory_weights
  );
  const hairItem = chance.weighted(girl_hairs, girl_hair_weights);

  // spinner.info(`Using ${backgroundItem} as background`);
  // spinner.info(`Using ${bodyItem} as body`);
  // spinner.info(`Using ${footwearItem} as footwear`);
  // spinner.info(`Using ${pantItem} as pant`);
  // spinner.info(`Using ${shirtItem} as shirt`);
  // spinner.info(`Using ${accessoryItem} as accessory`);
  // spinner.info(`Using ${hairItem} as hair`);

  spinner.info("Writing .jpg file");
  await new Promise<void>((res, reject) =>
    images(getLayerUri("boy", "background", backgroundItem))
      .draw(images(getLayerUri("girl", "body", bodyItem)), 0, 0)
      .draw(images(getLayerUri("girl", "shirt", shirtItem)), 0, 0)
      .draw(images(getLayerUri("girl", "pant", pantItem)), 0, 0)
      .draw(images(getLayerUri("girl", "footwear", footwearItem)), 0, 0)
      .draw(images(getLayerUri("girl", "accessory", accessoryItem)), 0, 0)
      .draw(images(getLayerUri("girl", "hair", hairItem)), 0, 0)
      .saveAsync(
        path.resolve(
          __dirname,
          "output",
          `${CURRENT_GIRL_CONSECUTIVE.toString()}.jpg`
        ),
        (err) => {
          if (err) {
            reject(err);
          } else {
            res();
          }
        }
      )
  );

  spinner.info("Writing .json file");
  const templateClone = JSON.parse(
    JSON.stringify(JSON_TEMPLATE)
  ) as typeof JSON_TEMPLATE;

  templateClone.name = `Metropolitan - ${CURRENT_GIRL_CONSECUTIVE}`;
  templateClone.attributes = [
    {
      trait_type: "background",
      value: backgroundItem,
    },
    { trait_type: "body", value: bodyItem },
    { trait_type: "footwear", value: footwearItem },
    { trait_type: "pant", value: pantItem },
    { trait_type: "shirt", value: shirtItem },
    { trait_type: "accessory", value: accessoryItem },
    { trait_type: "hair", value: hairItem },
  ];
  templateClone.image = `${CURRENT_GIRL_CONSECUTIVE}.jpg`;

  await promisify(fs.writeFile)(
    path.resolve(
      __dirname,
      "output",
      `${CURRENT_GIRL_CONSECUTIVE.toString()}.json`
    ),
    JSON.stringify(templateClone, null, 2),
    "utf-8"
  );
  spinner.succeed();
  ALL_GIRL.push(templateClone);
  CURRENT_GIRL_CONSECUTIVE += 2; // 2 Because we're intercalating boy-girl
};

(async () => {
  do {
    await createBoyNFT();
    await createGirlNFT();
  } while (
    CURRENT_BOY_CONSECUTIVE < (TOTAL_BOY * 2) &&
    CURRENT_GIRL_CONSECUTIVE < (TOTAL_GIRL * 2) - 1
  );
})();
