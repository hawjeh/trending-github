module.exports = function (arr) {
  return new Promise((resolve, reject) => {
    let builderImgs = [];
    arr.each((index, builder) => {
      builderImgs.push(builder.attribs.src)
    });
    resolve(builderImgs);
  });
};
