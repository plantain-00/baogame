module.exports = {
    inputFiles: [
        "static/scripts/index.js",
        "static/scripts/rooms.js",
        "static/scripts/admin.js",
        "static/*.ejs.html",
    ],
    outputFiles: file => file.replace(".ejs", ""),
    json: false,
    ejsOptions: {
        rmWhitespace: true
    },
    sha: 256,
    customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + "-" + md5String + extensionName,
    noOutputFiles: [],
};
