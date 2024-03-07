const grabBtn = document.getElementById("grabBtn");
grabBtn.addEventListener("click",() => {
    // Get active browser tab
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        if (tab) {
            execScript(tab);
        } else {
            alert("There are no active tabs")
        }
    })
})

/**
 * Execute a grabImages() function on a web page,
 * opened on specified tab and on all frames of this page
 * @param tab - A tab to execute script on
 */
function execScript(tab) {
    // Execute a function on a page of the current browser tab
    // and process the result of execution
    chrome.scripting.executeScript(
        {
            target:{tabId: tab.id, allFrames: true},
            func:grabImages
        },
        onResult
    )
}

/**
 * Executed on a remote browser page to grab all images
 * and return their URLs
 *
 *  @return Array of image URLs
 */
function grabImages() {
    //const images = document.querySelectorAll("img");
    //return Array.from(images).map(image=>image.src);
	return document.documentElement.outerHTML;
}

/**
 * Executed after all grabImages() calls finished on
 * remote page
 * Combines results and copy a list of image URLs
 * to clipboard
 *
 * @param {[]InjectionResult} frames Array
 * of grabImage() function execution results
 */
function onResult(frames) {
    // If script execution failed on remote end
    // and could not return results
	
	var regex = /(description)\":\"([^",]+)\",\"(words)\":([^\]]+]),\"(color)\":\"(#\w+)/g
	
	var array = frames[0].result.matchAll(regex);
	
	var resultstr = ""

	document.getElementById("results").innerHTML = ""
	
	for (const match of array) {
		resultstr = ""
		
		
		resultstr += "<div style=\"background-color:" + match[6] + "\">";
		
		resultstr += match[1] + ": ";
		resultstr += match[2];
		resultstr += "<br>"
		
		resultstr += match[3] + ": ";
		resultstr += match[4];
		resultstr += "<\div>"
		
		document.getElementById("results").innerHTML += resultstr
		
		
	}
}
