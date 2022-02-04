direc = await window.showDirectoryPicker()
for await (const entry of direc.values()) {
    if (entry.kind == 'file')   { 
        console.log(f=await entry.getFile())
        console.log(await f.text())
    }
}