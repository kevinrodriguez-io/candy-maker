# Candy Maker

## Usage Instructions

1. Modify `index.ts` to match your project.

### Constants

`DEV` - Indicates whether to output logs or not.
`TOTAL_NFTITEMS` - Amount of Image/Metadata pairs to create.
`ALL_NFTITEMS` - JSON Template containing all the NFTItems, modify the script to save it if you want to use a rarity service.
`type LayerType` - Should match your layer folders.
`JSON_TEMPLATE` - Super important, edit to match your project.
`#region layers` - Everything here should match the layers included in the `layers` folder, by name. Weights should add up to a 100% and match the layers positionally.
`#region Chose by weight` - Just be sure it matches the layers.
`#region Image Assembly` - Use this to assemble the image, make sure it has a logical order and matches the layers.
`#region Metadata for this NFT` - Here is the specific data for the current NFT, usually just `name`, `atrributes` and `image` changes.
