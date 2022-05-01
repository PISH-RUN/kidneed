function flatStrapiResponse(data) {
  if (Array.isArray(data)) {
    return data.map(flatStrapiResponse);
  }

  const { id, attributes } = data;
  const flatted = {};
  flatted.id = id;

  if (!attributes) {
    return flatted;
  }

  Object.keys(attributes).forEach((key) => {
    if (attributes[key].data) {
      flatted[key] = flatStrapiResponse(attributes[key].data);
      return;
    }
    flatted[key] = attributes[key];
  });

  return flatted;
}

module.exports = flatStrapiResponse;
