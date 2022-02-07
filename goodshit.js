async function fuck(a) {
    var ret = []
    for await (const v of a) {
        ret.push(v)
    }
    return ret
} 

/* TODO
    center and standardize size for image
    save directory chosen
    if day != prevday choose different file
    have button for just selecting pic (not directory again)
    add functionality for text
    add functionality for ".doc"s?
    show raw
*/
const main = async () => {
    direc = await window.showDirectoryPicker({startIn: 'pictures'})
    vals = await direc.values()

    var sz = 0
    var lst = await fuck(direc.values())
    var fileLst = lst.filter(e => e.kind == "file")

    var f = await fileLst[Math.floor((Math.random()*fileLst.length))].getFile()

    var fr = new FileReader();
    fr.readAsDataURL(f)
    fr.onloadend = function() {
        document.getElementById('img').src = fr.result;
    }

}