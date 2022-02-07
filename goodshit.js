function fuck(a) {
    var ret = []
    for await (const v of a) {
        ret.append(v)
    }
    return ret
} 

direc = await window.showDirectoryPicker()
vals = await direc.values()
// console.log(Iterators.size(vals))
var sz = 0
// var lst = fuck(direc.values())
// var fileLst = lst.filter(e => e.kind == "file")

// var f = await fileLst[Math.floor((Math.random()*fileLst.length))].getFile()
// console.log(await f.text())


sz = 3
i = 0
a = direc.values()
ind = Math.floor((Math.random()*sz));
for await (const entry of a) {
    if (entry.kind == 'file')   {
        if (i == ind) {
            var f = await entry.getFile()
            console.log(await f.text())
            break
        }
        i += 1
    }
}
// if (entry.kind == 'file')   { 
//     console.log(f=await entry.getFile())
//     console.log(await f.text())
// }