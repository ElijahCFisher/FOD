import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'

async function fuck(a) {
    var ret = []
    for await (const v of a) {
        ret.push(v)
    }
    return ret
}

function unhide(a) {
    document.getElementById('txt').hidden = a!="txt"
    document.getElementById('img').hidden = a!="img"
    document.getElementById('pdf').hidden = a!="pdf"
}

export async function load(event, direc = null) {
    if (direc == null) {
        var direcs = await get('dirs')
        console.log(direcs)
        if (direcs == null || direcs.length == 0) return
        direc = direcs[Math.floor((Math.random()*direcs.length))]
    }

    console.log(direc)

    const options = {}
    console.log("uhhh")
    options.mode = 'read'
    console.log("mmmm")
    if (await direc.queryPermission(options) != 'granted')
        await direc.requestPermission(options)
    
    console.log("tf?")
    var lst = await fuck(direc.values())
    var fileLst = lst.filter(e => e.kind == "file")

    var f = await fileLst[Math.floor((Math.random()*fileLst.length))].getFile()
    var txt = await f.text();
    var fr = new FileReader();
    fr.readAsDataURL(f)

    if (f.name.includes(".pdf")) {//hopefully we don't get trolled
        unhide("pdf")
    }
    else if (f.name.includes(".txt")) {
        fr.onloadend = function() {
            document.getElementById("txt").innerText = txt;
            unhide("txt")
        }
    }
    else {
        fr.onloadend = function() {
            document.getElementById("img").src = fr.result;
            unhide("img")
        }
    }
}

/* TODO
    save directory chosen
    if day != prevday choose different file
    have button for just selecting pic (not directory again)
    add functionality for text
    add functionality for ".doc"s?
    show raw
    integrate ads
    make sure video works
    nicetohave: change how to open file (e.g. gif as text file)

   NOTES
    works with jpg, png, webp (moving and not), gif (moving and not)
*/
export const button = async () => {
    var direc = await window.showDirectoryPicker({startIn: "pictures"})
    
    // await set('dirs', null)
    var dirs = await get('dirs')
    console.log(dirs)
    // console.log(await dirs[0].isSameEntry(direc))
    if (dirs == null || dirs.filter(a => a.isSameEntry(direc)).length == 0) {
        await set('dirs', dirs==null? [direc] : [...dirs, direc])
        console.log(await get('dirs'))
    }

    await load(null, direc)
}

// export default button;