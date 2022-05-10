"use strict";

var axios = require("axios");
const qs = require("qs");

const DAPI_URL = "https://dapi.pish.run";

// data: age, days, gender, field
async function plan(data) {
  const response = await axios.post(`${DAPI_URL}/api/plan-generator`, { data });

  return response.data;
}

async function contents(ids, fields) {
  const queryJson = {
    filters: {
      id: {
        $in: ids,
      },
    },
    fields: fields,
    publicationState: "preview",
  };

  const query = qs.stringify(queryJson, {
    encodeValuesOnly: true,
  });

  const response = await axios.get(`${DAPI_URL}/api/contents?${query}`);

  return response.data;
}

async function editions(content, tag) {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            content,
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
  contents: contents,
  editions,
};
