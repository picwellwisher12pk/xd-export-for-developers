/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


const { alert, error } = require("./lib/dialogs.js");




async function CopyForAndroidValue(selection) {
    // Go to Plugins > Development > Developer Console to see this log output


    // Insert a red square at (0, 0) in the current artboard or group/container
    // var shape = new Rectangle();
    // shape.width = 100;
    // shape.height = 100;
    // shape.fill = new Color("#0f0");
    // selection.insertionParent.addChild(shape);

    var assets = require("assets"),
        allColors = assets.colors.get();

    let outtext = "";

    allColors.forEach(ic => {




        if (ic.color) {

            let rgba = ic.color.toRgba();
            let rgbatext = "";
            if (rgba.a == 255) {
                rgbatext += rgba.r.toString(16);
                rgbatext += rgba.g.toString(16);
                rgbatext += rgba.b.toString(16);
            } else {
                rgbatext += rgba.a.toString(16);
                rgbatext += rgba.r.toString(16);
                rgbatext += rgba.g.toString(16);
                rgbatext += rgba.b.toString(16);
            }
            outtext += `<color name="${ic.name ? ic.name : "untitled-" + rgbatext}">#${rgbatext}</color>\n`;

        } //else console.log(ic);


    });


    if (outtext.length == 0) {
        await error("no solid color", //[1]
            "your assets has no color for export"); //[2]
    }
    else {

        let clipboard = require("clipboard");
        clipboard.copyText(outtext);

        /* we'll display a dialog here */
        await alert("Andriod Color Values", //[1]
            "your code is now availible on clipboard"); //[2]
    }


}

module.exports = {
    commands: {
        CopyForAndroidValue: CopyForAndroidValue
    }
};
