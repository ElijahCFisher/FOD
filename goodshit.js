direc = await window.showDirectoryPicker()
vals = await direc.values()
// console.log(Iterators.size(vals))
var sz = 0
for await (const entry of direc.values()) {
    if (entry.kind == 'file')   {
        sz += 1
    }
}
i = 0
ind = Math.floor((Math.random()*sz));
for await (const entry of direc.values()) {
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