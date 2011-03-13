var
	// Requires
	fs = require("fs"),
	exec = require("child_process").exec,

	// folders
	folders = {
		build: "build",
		src: "src"
	},

	// Main project file
	main = "Main.as",

	// SWF compiler
	compiler = "tools/flex-sdk-4.5.0.19786/bin/mxmlc",

	// Compiler parameters
	parameters = "-default-size 640 480 -static-link-runtime-shared-libraries=true",

	// Are we compiling?
	compiling = false,

	// RegExp used to check which files to watch
	rWatchFile = /\.as/;

// Read the sources folder
// TODO: Handle deep folder files
fs.readdir(folders.src, function(err, files) {
	var i, count, file;

	for (i = 0, count = files.length; i < count; i++) {
		// Prepare the filename
		file = folders.src + "/" + files[i];

		// Skip unwanted files
		if (!rWatchFile.test(file)) {
			continue;
		}

		// launch the file's watcher
		fs.watchFile(file, {interval: 100}, handleFileChange);
	}

	console.log("Watchers attached.");
	console.log("Press Ctrl+C to quit.\n")
});

// Handle the compilation of a file
function handleFileChange(curr, prev) {
	// Make sure we're not compiling and we have modified the file (and not just accessing)
	if (!compiling && curr.mtime > prev.mtime) {
		console.log("Launching compilation");

		// Compilation about to be launched, prevent intensive save
		compiling = true;

		// Launch the compilation
		exec(
			compiler + " " + folders.src + "/" + main + " " + parameters + " -output " + folders.build + "/" + main.replace(".as", ".swf"),
			function(error, stdout, stderr) {
				// Display compilation errors/logs
				console.log(stdout);

				// Compilation done
				compiling = false;
			}
		);
	}
}