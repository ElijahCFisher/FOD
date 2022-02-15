import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'

var vidFileTypes = ["mp4", "mkv", "mov", "webm"]

async function fuck(a) {
    var ret = []
    for await (const v of a) {
        ret.push(v)
    }
    return ret
}

function unhide(a) {
    for (const typ of ["txt", "img", "pdf", "vid"] ){
        document.getElementById(typ).style.display = a==typ ? "block" : "none" 
    }
}

export async function makePicker() {
    var direcs = await get("dirs")

    var select = document.getElementById("selection")

    for (var i = select.options.length-1; i > -1; i--)
        select.remove(i)

    var option = document.createElement("option")
    option.text = "all"
    option.value = "all"
    select.append(option)
    // console.log("uh", direcs)

    for (var i = 0; i < direcs.length; i++) {
        var dir = direcs[i]
        // console.log("OKK", dir, dir.name)
        var option = document.createElement("option")
        option.text = dir.name
        option.value = i
        select.appendChild(option)
    }
}

export async function load(event, direc = null) {
    console.log("direc is ", direc)
    if (direc == null) {
        var direcs = await get('dirs')
        // console.log(direcs)
        if (direcs == null || direcs.length == 0) return

        var selection = document.getElementById("selection").value
        if (selection == "all")
            direc = direcs[Math.floor((Math.random()*direcs.length))]
        else
            direc = direcs[selection]
    }

    console.log("this is a direc", direcs)

    const options = {}
    // console.log("uhhh")
    options.mode = 'read'
    // console.log("mmmm")
    if (await direc.queryPermission(options) != 'granted')
        await direc.requestPermission(options)
    
    // console.log("tf?")
    var lst = await fuck(direc.values())
    var fileLst = lst.filter(e => e.kind == "file")

    var f = await fileLst[Math.floor((Math.random()*fileLst.length))].getFile()
    var txt = await f.text();
    var fr = new FileReader();
    fr.readAsDataURL(f)

    if (f.name.includes(".pdf")) {//hopefully we don't get trolled
        var fileURL = window.URL.createObjectURL(f) 
        document.getElementById("pdf").src = fileURL;
        console.log("uhh", fileURL)
        unhide("pdf")
    }
    else if (f.name.includes(".txt")) {
        fr.onloadend = function() {
            document.getElementById("txt").innerText = txt;
            unhide("txt")
        }
    }
    else if(vidFileTypes.some(v => f.name.includes(v))) {
        fr.onloadend = function() {
            console.log("loaded a vid")
            var fileURL = window.URL.createObjectURL(f) 
            document.getElementById("vid").src = fileURL
            unhide("vid")
        }
    }
    else {
        fr.onloadend = function() {
            document.getElementById("img").src = fr.result;
            unhide("img")
        }
    }
}

export async function unload() {
    await set('dirs', null)
    makePicker()
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
    // console.log(dirs)
    // console.log(dirs.reduce((acc, v) => {
    //     return acc + v.name
    // }, ""))
    // console.log(await dirs[0].isSameEntry(direc), await dirs.reduce(async (acc, v) => {
    //     // console.log("meh", acc, (await v.isSameEntry(direc)), (await acc) || (await v.isSameEntry(direc)))
    //     return ((await acc) || (await v.isSameEntry(direc)))
    // }, false))
    if (dirs == null || !(await dirs.reduce(async (acc, v) => {return ((await acc) || (await v.isSameEntry(direc)))}, false))) {
        await set('dirs', dirs==null? [direc] : [...dirs, direc])
        // console.log("12", await get('dirs'))
    }

    await makePicker()
    await load(null, direc)
}

// export default button;