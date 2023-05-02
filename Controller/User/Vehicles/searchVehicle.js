const vehicle = require("../../../Models/vehicleSchema");

exports.searchBikes = (req, res) => {
  const itemsPerPage = 3;
  const page = req.query.page || 1;
  let pageCount;
  let currentPage = parseInt(page);
  try {
    vehicle
      .find({
        $and: [
          { vehicleName: { $regex: req.body.searchTerm, $options: "i" } },
          { Status: "Acccepted" },
          {
            $or: [
              {
                OwnerId: { $ne: req.query.id },
              },
              { OwnerId: { $exists: false } },
            ],
          },
        ],
      })
      .skip(itemsPerPage * page - itemsPerPage)
      .limit(itemsPerPage)
      .then((data) => {
        vehicle
          .countDocuments({
            $and: [{ Status: "Acccepted" }],
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
            console.log(data);
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
            message: "Error occurred while fetching the data in search bikes",
          });
      });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
