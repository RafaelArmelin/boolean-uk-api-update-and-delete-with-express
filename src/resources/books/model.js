const db = require("../../utils/database")
const { buildBooksDatabase } = require("../../utils/mockData")

function Book() {
  function checkTable() {
    const sql = `
      SELECT * FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'books';
    `

    return db.query(sql).then(result => {
      if (result.rowCount > 0) return true
    })
  }

  function createTable() {
    const sql = `      
      CREATE TABLE IF NOT EXISTS books (
        id              SERIAL        PRIMARY KEY,
        title           VARCHAR(255)   NOT NULL,
        type            VARCHAR(255)   NOT NULL,
        author          VARCHAR(255)   NOT NULL,
        topic           VARCHAR(255)   NOT NULL,
        publicationDate DATE           NOT NULL
      );
    `

    return db
      .query(sql)
      .then(result => console.log("[DB] Book table ready."))
      .catch(console.error)
  }

  function mockData() {
    const createBook = `
      INSERT INTO books
        (title, type, author, topic, publicationDate)
      VALUES
        ($1, $2, $3, $4, $5)
    `

    const books = buildBooksDatabase()

    books.forEach(book => {
      db.query(createBook, Object.values(book)).catch(console.error)
    })
  }

  checkTable().then(tableExists => {
    if (tableExists) {
      console.log("[DB] Book table ready.\n")

      return
    }

    createTable().then(() => {
      console.log("\nMocking data for Books...\n")

      mockData()
    })
  })
}

module.exports = Book