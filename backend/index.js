const { MeiliSearch } = require("meilisearch");

(async () => {
  try {
    const config = {
      host: "http://127.0.0.1:7700",
    };

    const meili = new MeiliSearch(config);

    await meili.isHealthy();
    try {
      await meili.createIndex("restaurants", { primaryKey: "id" });
    } catch (err) {
      console.log("Error");
    }

    const restaurant = require("./restaurants.json");
    const index = await meili.getIndex("restaurants");
    await index.updateSortableAttributes(["_geo"]);
    await index.updateFilterableAttributes(["_geo"]);

    await index.addDocuments(restaurant);
    const newSettings = {
      rankingRules: [
        "typo",
        "words",
        "proximity",
        "attribute",
        "wordsPosition",
        "exactness",
        "desc(creation_date)",
      ],
    };

    await index.updateSettings(newSettings);

    console.log(await index.search("berlin"));
  } catch (e) {
    console.error(e);
    console.log("Meili error: ", e.message);
  }
})();
