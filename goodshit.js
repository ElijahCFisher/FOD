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

async function load() {
    direcs = localStorage.getItem('dirs')
    if (direcs == null) return
    direc = [Math.floor((Math.random()*direcs.length))]

    vals = await direc.values()

    var lst = await fuck(direc.values())
    var fileLst = lst.filter(e => e.kind == "file")

    console.log(lst, lst[0], await direc.values())
    var f = await fileLst[Math.floor((Math.random()*fileLst.length))].getFile()
    var fr = new FileReader();
    fr.readAsDataURL(f)

    if (f.name.includes(".pdf")) {//hopefully we don't get trolled
        unhide("pdf")
    }
    else if (f.name.includes(".txt")) {
        fr.onloadend = function() {
            document.getElementById("txt").innerText = fr.result;
            unhide("txt")
            console.log("meh")
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
const button = async () => {
    direc = await window.showDirectoryPicker({startIn: "pictures"})
    console.log(direc)
    
    //testd
    // try {
        await set('dir', direc)
        direc = await get('dir')
    // }
    // catch (error){
        alert(error.name, error.message)
    // }
    //test
    
    // if (!(d = localStorage.getItem("dirs")).includes(direc))
    //     localStorage.setItem("dirs", (d == null ? [direc] : [...d, direc]))
    // await load()

    vals = await direc.values()

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

export default button;