const db = require("../../utils/database");

function createOne(req, res) {
  const createOne = `
    INSERT INTO books
      (name, type, author, topic, publicationDate)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  db.query(createOne, Object.values(req.body))
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

function getAll(req, res) {
  const getAll = `
    SELECT *
    FROM books;
  `;

  db.query(getAll)
    .then((result) => res.json({ data: result.rows }))
    .catch(console.error);
}

function getOneById(req, res) {
  const idToGet = req.params.id;

  const getOneById = `
    SELECT *
    FROM books
    WHERE id = $1;
  `;

  db.query(getOneById, [idToGet])
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

async function updateOneById(req, res) {
  console.log({ params: req.params, body: req.body });

  const updateOneByIdSQL = `
  UPDATE books
  SET
    title = $1,
    author = $2,
    type = $3,
    topic = $4,
    publicationDate = $5
  WHERE 
    id = $6
  RETURNING *;
  `;

  try {
    const result = await db.query(updateOneByIdSQL, [
      updateOneById.title,
      updateOneById.author,
      updateOneById.type,
      updateOneById.topic,
      updateOneById.publicationDate,
    ]);

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("[ERROR] updateOneById: ", { error: error.message });

    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createOne,
  getAll,
  getOneById,
  updateOneById,
};
