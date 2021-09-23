/**
 * Copyright 2021 - Kevin Rodriguez and Jungle Cats
 * Please do not disclose this source code to anyone not allowed by either
 * Kevin Rodriguez or Jungle Cats.
 * Distributing copies of this piece of code is a violation of copyright law.
 */

import { Chance } from "chance";
import images from "images";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import ora from "ora";
import _ from "lodash";

const __dirname = path.resolve();

const DEV = true;
const TOTAL_JUNGLECATS = 30; // Change to appropiate number
const ALL_JUNGLECATS: Array<typeof JSON_TEMPLATE> = [];

type LayerType = "background" | "body" | "accessory" | "mane" | "shirt"; // Matches the {folder} placed as in ./layers/{folder}

type Attribute = {
  trait_type: LayerType;
  value: string;
};

const globalSpinner = ora({
  text: "Creating JSON Template",
  isSilent: !DEV,
}).start();

/**
 * GOTCHAS:
 * #0 - NFT file names should be a zero-based consecutive number.
 * #1 - PNG Files must be under 8MB I think, but it's HIGHLY desirable to keep them under 2MB.
 * #2 - All creators in the creators array must sign the created NFTs, this is kind of a bummer but it's better in terms of trust.
 *    - This way no one rugs no one, but it's still super important.
 *    - Ideally, we don't have to share our private keys, what we do is:
 *      - #1. Create a new keypair set for each creator.
 *      - #2. Send the cache file to every creator.
 *      - #3. Each creator signs the cache file using the metaplex cli. This sucks but it's the most transparent way to do it.
 *    - If you don't sign the NFTs, bad stuff happen.
 * #3 - File format must be png, i don't know why.
 * #4 - InitialSaleHappenned field is a boolean, ideally is set to true but this will close update authority; Update authority is important if something bad happens we can fix it.
 */
const JSON_TEMPLATE = {
  name: "",
  symbol: "",
  image: "0.png",
  description:
    "Welcome to the Jungle! Congratulations on getting your place in the Jungle Cats Family. https://junglecats.io",
  seller_fee_basis_points: 500, // 500 = 5%
  attributes: [] as Attribute[],
  collection: {
    name: "Jungle Cats",
    family: "Originals",
  },
  properties: {
    files: [
      {
        uri: "junglecats.png",
        type: "image/png",
      },
    ],
    category: "image",
    creators: [
      {
        address: "JUNGLE_CATS_SPECIFIC_MINT_ADDRESS", // CAREFUL NOT TO USE A LEDGER ONE BECAUSE WE'LL NEED IT'S PRIVATE KEY TO SIGN EVERY PIECE USING METAPLEX CLI.
        share: 90,
      },
      {
        address: "OTHER_ADDRESS", // CAREFUL, PRIVATE KEY WILL BE NEEDED TO SIGN EVERY ART PIECE VIA CLI.
        share: 10,
      },
    ],
  },
};

globalSpinner.succeed();
globalSpinner.start("Creating layers and weights");

// #region JUNGLE_CAT layers stuff

/**
 * TODO: Modify accordingly to layers exported by Henzo
 * This process uses the charged dice to generate a random layer.
 * IMPORTANT: background_weights should add up to 100.
 * TODO: Refactor into a nice object that uses {LayerType} as key.
 */

const backgrounds = ["jungle", "space"];
const background_weights = [50, 50];

const junglecat_bodies = ["white_lion", "lion"];
const junglecat_body_weights = [50, 50];

const junglecat_manes = ["long_black", "long_brown"];
const junglecat_mane_weights = [50, 50];

const junglecat_shirts = ["black_shirt", "white_tank_top"];
const junglecat_shirt_weights = [50, 50];

const junglecat_accessories = [
  "black_sunglasses",
  "black_eyepatch",
  "none", // A none, empty layer should also be part of the weights otherwise everyone will have a feature.
];
const junglecat_accessory_weights = [33, 33, 34];

//#endregion

globalSpinner.succeed();

const getLayerUri = (layerType: LayerType, layerName: string) => {
  const spinner = ora({
    text: `Building file from layer ${layerType} and ${layerName}`,
    isSilent: !DEV,
  }).start();
  const layerUri = path.resolve(
    __dirname,
    "layers",
    layerType,
    `${layerName}.png`
  );
  spinner.info(`Got layerUri: ${layerUri}`);
  return `${layerUri}`;
};

const createJungleCatNFT = async (currentJunglecatConsecutive: number) => {
  const spinner = ora({
    text: `Creating JungleCat ${currentJunglecatConsecutive}`,
    isSilent: !DEV,
  }).start();
  const chance = new Chance();

  const backgroundItem = chance.weighted(backgrounds, background_weights); // Pick a background
  const bodyItem = chance.weighted(junglecat_bodies, junglecat_body_weights); // Pick a body
  const shirtItem = chance.weighted(junglecat_shirts, junglecat_shirt_weights); // Pick a shirt
  const accessoryItem = chance.weighted(
    junglecat_accessories,
    junglecat_accessory_weights
  ); // Pick an accessory
  const maneItem = chance.weighted(junglecat_manes, junglecat_mane_weights); // Pick a mane

  spinner.info(
    `Writing .png file for JungleCat - ${currentJunglecatConsecutive}`
  );
  /**
   * SUPER IMPORTANT
   * - The order of layers is MATTERS, imagine putting them in photoshop or something like that.
   */
  await new Promise<void>((res, reject) =>
    images(getLayerUri("background", backgroundItem))
      .draw(images(getLayerUri("body", bodyItem)), 0, 0)
      .draw(images(getLayerUri("shirt", shirtItem)), 0, 0)
      .draw(images(getLayerUri("accessory", accessoryItem)), 0, 0)
      .draw(images(getLayerUri("mane", maneItem)), 0, 0)
      .saveAsync(
        path.resolve(
          __dirname,
          "output",
          `${currentJunglecatConsecutive.toString()}.png`
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

  templateClone.name = `Jungle Cats - #${currentJunglecatConsecutive}`;
  templateClone.attributes = [
    // These show up very nice in Phantom and other wallets.
    {
      trait_type: "background",
      value: backgroundItem,
    },
    { trait_type: "body", value: bodyItem },
    { trait_type: "shirt", value: shirtItem },
    { trait_type: "accessory", value: accessoryItem },
    { trait_type: "mane", value: maneItem },
  ];
  templateClone.image = `${currentJunglecatConsecutive}.png`;

  await promisify(fs.writeFile)(
    path.resolve(
      __dirname,
      "output",
      `${currentJunglecatConsecutive.toString()}.json`
    ),
    JSON.stringify(templateClone, null, 2),
    "utf-8"
  );
  spinner.succeed();
  ALL_JUNGLECATS.push(templateClone);
};

(async () => {
  let currentConsecutive = 0;
  const promises: Promise<void>[] = [];
  do {
    const promise = createJungleCatNFT(currentConsecutive);
    promises.push(promise);
    currentConsecutive += 1;
  } while (currentConsecutive < TOTAL_JUNGLECATS);
  await Promise.all(promises);
  const attrsAndIds = ALL_JUNGLECATS.map((i) => ({
    id: i.name,
    attrs: JSON.stringify(i.attributes),
  }));
  const repeatedAttrs = _.filter(
    attrsAndIds.map((i) => i.attrs),
    (val, i, iteratee) => _.includes(iteratee, val, i + 1)
  );
  const repeated = attrsAndIds.filter((i) => {
    return repeatedAttrs.includes(i.attrs);
  });
  console.log(`Repeated items: ${JSON.stringify(repeated, null, 2)}`);
  console.log(
    `If there are too many repeated Items try adding more features or manually edit them to add some really unique items.`
  );
  globalSpinner.succeed();
})();
