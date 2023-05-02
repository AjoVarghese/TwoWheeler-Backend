const vehicle = require("../../../Models/vehicleSchema");

//global_variables
const ACCEPTED = "Acccepted"
exports.filterBikes = (req, res) => {
  const itemsPerPage = 3;
  const page = req.query.page || 1;
  let pageCount;
  let currentPage = parseInt(page);

  const { location, brand } = req.body;
  try {
    if (location !== null && brand === null) {
      try {
        vehicle
          .find({
            $and: [
              {
                Location: location,
              },
              {
                Status: ACCEPTED,
              },
            ],
          })
          .skip(itemsPerPage * page - itemsPerPage)
          .limit(itemsPerPage)
          .then((data) => {
            vehicle
              .countDocuments({
                $and: [
                  {
                    Location: location,
                  },
                  { Status: ACCEPTED},
                ],
              })
              .then((count) => {
                pageCount = Math.ceil(count / itemsPerPage);
                const response = {
                  data: data,
                  pagination: {
                    count: count,
                    pageCount: pageCount,
                    currentPage: currentPage,
                  },
                };

                res.status(200).json(response);
              })
              .catch((error) => {
                console.log(error);
                res
                  .status(500)
                  .json({
                    message:
                      "Error occurred while fetching the count in search bikes",
                  });
              });
          })
          .catch((error) => {
            console.log(error);
            res
              .status(500)
              .json({
                message:
                  "Error occurred while fetching the data in search bikes",
              });
          });
      } catch (error) {
        console.log("ERROR in filter by loaction", error);
      }
    } else if (location === null && brand !== null) {
      console.log("BRAND");
      try {
        vehicle
          .find({
            $and: [
              {
                Brand: { $regex: brand, $options: "i" },
              },
              {
                Status: ACCEPTED,
              },
            ],
          })
          .skip(itemsPerPage * page - itemsPerPage)
          .limit(itemsPerPage)
          .then((data) => {
            vehicle
              .countDocuments({
                $and: [
                  {
                    Brand: { $regex: brand, $options: "i" },
                  },
                  {
                    Status: ACCEPTED,
                  },
                ],
              })
              .then((count) => {
                pageCount = Math.ceil(count / itemsPerPage);
                const response = {
                  data: data,
                  pagination: {
                    count: count,
                    pageCount: pageCount,
                    currentPage: currentPage,
                  },
                };

                res.status(200).json(response);
              })
              .catch((error) => {
                console.log(error);
                res
                  .status(500)
                  .json({
                    message:
                      "Error occurred while fetching the count in search bikes",
                  });
              });
          })
          .catch((error) => {
            console.log(error);
            res
              .status(500)
              .json({
                message:
                  "Error occurred while fetching the data in search bikes",
              });
          });
      } catch (error) {
        console.log("Error in filter by brand", error);
      }
    } else if (location !== null && brand !== null) {
      console.log("not bull");
      try {
        vehicle
          .find({
            $and: [
              {
                Location: location,
              },
              {
                Brand: { $regex: brand, $options: "i" },
              },
              {
                Status: ACCEPTED,
              },
            ],
          })
          .skip(itemsPerPage * page - itemsPerPage)
          .limit(itemsPerPage)
          .then((data) => {
            vehicle
              .countDocuments({
                $and: [
                  {
                    Location: location,
                  },
                  {
                    Brand: { $regex: brand, $options: "i" },
                  },
                  {
                    Status: ACCEPTED,
                  },
                ],
              })
              .then((count) => {
                pageCount = Math.ceil(count / itemsPerPage);
                const response = {
                  data: data,
                  pagination: {
                    count: count,
                    pageCount: pageCount,
                    currentPage: currentPage,
                  },
                };

                res.status(200).json(response);
              })
              .catch((error) => {
                console.log(error);
                res
                  .status(500)
                  .json({
                    message:
                      "Error occurred while fetching the count in search bikes",
                  });
              });
          })
          .catch((error) => {
            console.log(error);
            res
              .status(500)
              .json({
                message:
                  "Error occurred while fetching the data in search bikes",
              });
          });
      } catch (error) {
        console.log("error in filter by loca and brand", error);
      }
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
