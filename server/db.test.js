const { TestWatcher } = require("jest")
const db = require("./db/index.js")
const product = require("./products.json")

test('properly get db ', ()=>{
    expect(
        db.getDB()
    )
})