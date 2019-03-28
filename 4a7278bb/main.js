"use strict";
const { ShowAlert, error } = require("./lib/dialogs.js");
function GetName(str) {
    let a = str.replace(/\ /g, "_").replace(/\-/g, "_").toLowerCase();
    let ChosenName = "";
    let capslock = false;
    for (var i = 0; i < a.length; i++) {
        if (a[i] >= 'a' && a[i] <= 'z')
            ChosenName += capslock ? a[i].toString().toUpperCase() : a[i];
        if (a[i] >= '0' && a[i] <= '9')
            ChosenName += a[i];
        capslock = false;
        if (a[i] == '_') {
            ChosenName += a[i];
            capslock = true;
        }
    }
    while (a.indexOf("__") >= 0)
        a = a.replace("__", "_");
    return ChosenName;
}
async function CopyForAndroidValue(selection) {
    let outtext = "";
    let DataFound = false;
    console.log("selection", selection, JSON.stringify(selection));
    console.log("selection", selection.items.length, JSON.stringify(selection.items));
    if (selection.items.length > 0) {
        outtext += "<!-- COLOR FROM SELECTED ITEMS -->\n";
        var validelements = ["Rectangle", "Ellipse", "Path", "Artboard"];
        selection.items.forEach(element => {
            if (validelements.includes(element.constructor.name)) {
                if (element.fillEnabled) {
                    var color = element.fill;
                    if (color.value) {
                        let rgbatext = color.toHex();
                        outtext += `<color name="color_${GetName(element.constructor.name + "_" + element.name)}_bg">#${rgbatext}</color>\n`;
                        DataFound = true;
                    }
                }
                if (element.strokeEnabled) {
                    var color = element.stroke;
                    if (color.value) {
                        let rgbatext = color.toHex();
                        outtext += `<color name="color_${GetName(element.constructor.name + "_" + element.name)}_fg">#${rgbatext}</color>\n`;
                        DataFound = true;
                    }
                }
            }
            else {
                console.log("invalid name", element.constructor.name);
            }
        });
    }
    outtext += "\n\n<!-- COLOR FROM ASSETS PANEL -->\n";
    var allColors = require("assets").colors.get();
    allColors.forEach((ic) => {
        if (ic.color) {
            let rgbatext = ic.color.toHex();
            outtext += `<color name="color_${GetName(ic.name ? ic.name : "untitled-" + rgbatext)}">#${rgbatext}</color>\n`;
            DataFound = true;
        }
    });
    if (DataFound) {
        let clipboard = require("clipboard");
        clipboard.copyText(outtext);
        await ShowAlert("Andriod Color Values", "your code is now availible on clipboard");
    }
    else {
        await error("no solid color", "You need to add colors to assets First or Select An Element");
    }
}
module.exports = {
    commands: {
        CopyForAndroidValue: CopyForAndroidValue
    }
};
