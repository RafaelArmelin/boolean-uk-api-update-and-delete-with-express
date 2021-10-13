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
  const bookToUpdate = {
    id: req.params.id,
    ...req.body,
  };
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
      bookToUpdate.title,
      bookToUpdate.author,
      bookToUpdate.type,
      bookToUpdate.topic,
      bookToUpdate.publicationDate,
      bookToUpdate.id,
    ]);

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("[ERROR] updateOneById: ", { error: error.message });

    res.status(500).json({ error: error.message });
  }
}

function updateByIdDynam(req, res) {
  const id = req.params.id;
  console.log("req.body: ", req.body);
  const bookToUpdate = req.body;

  let updateByIdDynamSQLTemplate = "UPDATE books SET ";

  console.log(bookToUpdate);

  const updateByIdDynamSQLParams = [];

  let i = 1;
  for (const key in bookToUpdate) {
    updateByIdDynamSQLTemplate += `${key} = $${i}`;
    updateByIdDynamSQLTemplate += `,`;
    updateByIdDynamSQLParams.push(bookToUpdate[key]);
    i += 1;
  }
  updateByIdDynamSQLParams.push(id);

  updateByIdDynamSQLTemplate = updateByIdDynamSQLTemplate.slice(
    0,
    updateByIdDynamSQLTemplate.length - 1
  );
  updateByIdDynamSQLTemplate += ` WHERE id = $${i}`;
  updateByIdDynamSQLTemplate += ` RETURNING *`;

  console.log("TEMPLATE --> ", updateByIdDynamSQLTemplate);
  console.log("PARAMS --> ", updateByIdDynamSQLParams);

  db.query(updateByIdDynamSQLTemplate, updateByIdDynamSQLParams)
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

function deleteOneById(req, res) {
  const id = req.params.id;

  const deleteOneByIdSQL = "DELETE FROM books WHERE id = $1";

  db.query(deleteOneByIdSQL, [id])
    .then((result) => res.json({ message: "Delete successful" }))
    .catch(console.log);
}

function deleteOneByTitle(req, res) {
  const title = req.params.title;

  const deleteOneByTitleSQL = "DELETE FROM books WHERE title = $1";

  db.query(deleteOneByTitleSQL, [title])
    .then((result) => res.json({ message: "Delete by name successful!" }))
    .catch(console.log);
}

module.exports = {
  createOne,
  getAll,
  getOneById,
  updateOneById,
  updateByIdDynam,
  deleteOneById,
  deleteOneByTitle,
};
