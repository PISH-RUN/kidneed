module.exports = {
  collectionName: "seeds",
  info: {
    name: "seed",
    singularName: "seed",
    pluralName: "seeds",
    displayName: "seed",
  },
  // pluginOptions: {
  //   "content-manager": {
  //     visible: false,
  //   },
  //   "content-type-builder": {
  //     visible: false,
  //   },
  // },
  options: {
    draftAndPublish: false,
    comment: "",
  },
  attributes: {
    file: {
      type: "string",
      unique: true,
      configurable: false,
    },
  },
};
