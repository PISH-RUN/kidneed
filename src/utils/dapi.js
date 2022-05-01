"use strict";

var axios = require("axios");
const qs = require("qs");

const DAPI_URL = "https://dapi.pish.run";

// data: age, days, gender, field
async function plan(data) {
  const response = await axios.post(`${DAPI_URL}/api/plan-generator`, { data });

  return response.data;
}

async function entities(ids, fields, contents) {
  const queryJson = {
    filters: {
      id: {
        $in: ids,
      },
    },
    fields: fields,
    publicationState: "preview",
  };

  if (contents) {
    queryJson.populate = {
      content: {
        fields: contents,
      },
    };
  }

  const query = qs.stringify(queryJson, {
    encodeValuesOnly: true,
  });

  const response = await axios.get(`${DAPI_URL}/api/entities?${query}`);

  return response.data;
}

async function editions(entity, tag) {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            content: { entity },
          },
          {
            tag,
          },
        ],
      },
      publicationState: "preview",
    },
    {
      encodeValuesOnly: true,
    }
  );

  const response = await axios.get(`${DAPI_URL}/api/editions?${query}`);

  return response?.data;
}

module.exports = {
  plan,
  entities,
  editions,
};
