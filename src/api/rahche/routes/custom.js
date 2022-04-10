module.exports = {
  routes: [
    {
      method: "POST",
      path: "/rahche/select",
      handler: "rahche.select",
    },
    {
      method: "GET",
      path: "/rahche/:rahche/signs",
      handler: "signs.find",
      config: {
        policies: ["rahche-owner"],
      },
    },
    {
      method: "POST",
      path: "/rahche/:rahche/signs",
      handler: "signs.select",
      config: {
        policies: ["rahche-owner"],
      },
    },
    {
      method: "POST",
      path: "/rahche/:rahche/roots",
      handler: "roots.select",
      config: {
        policies: ["rahche-owner"],
      },
    },
  ],
};
