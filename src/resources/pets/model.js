const db = require("../../utils/database");
const { buildAnimalDatabase } = require("../../utils/mockData");

function Pet() {
  function checkTable() {
    const sql = `
      SELECT * FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'pets';
    `;

    return db.query(sql).then((result) => {
      if (result.rowCount > 0) return true;
    });
  }

  function createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS pets (
        id        SERIAL        PRIMARY KEY,
        name      VARCHAR(255)   NOT NULL,
        age       INTEGER       NOT NULL,
        type      VARCHAR(255)   NOT NULL,
        breed     VARCHAR(255)   NOT NULL,
        microchip BOOLEAN       NOT NULL
      );
    `;

    return db
      .query(sql)
      .then((result) => console.log("[DB] Pet table ready."))
      .catch(console.error);
  }

  function mockData() {
    const createPet = `
      INSERT INTO pets
        (name, age, type, breed, microchip)
      VALUES
        ($1, $2, $3, $4, $5)
    `;

    const pets = buildAnimalDatabase();

    pets.forEach((pet) => {
      db.query(createPet, Object.values(pet));
    });
  }

  checkTable().then((tableExists) => {
    if (tableExists) {
      console.log("[DB] Pets table ready.\n");

      return;
    }

    createTable().then(() => {
      console.log("\nMocking data for Pets...\n");

      mockData();
    });
  });
}

module.exports = Pet;
