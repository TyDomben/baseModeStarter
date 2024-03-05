const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

/**
 * GET route to retrieve the "dog" table from the DB
 */
router.get("/", async (req, res) => {
  console.log("/dog GET route ");
  console.log("is authenticated?", req.isAuthenticated());
  console.log("user", req.user);
  // console.log("role", req.body.userRole)

  if (req.isAuthenticated()) {
    let connection;
    try {
      connection = await pool.connect(); // Get a connection from the pool
      const userId = req.user.id;
      // const userRole = req.body.userRole

      const query = `
            SELECT
            "dogs"."user_id",
            "dogs"."name", 
            "dogs"."age", 
            "dogs"."breed", 
            "dogs"."spayed_neutered", 
            "dogs"."food_type", 
            "dogs"."food_amount", 
            "dogs"."meals_per_day", 
            "dogs"."eating_times", 
            "dogs"."medical_conditions", 
            "dogs"."recovering_from_surgery", 
            "dogs"."medications", 
            "dogs"."in_heat", 
            "dogs"."potty_routine", 
            "dogs"."potty_habits_notes", 
            "exercise_limitations"."exercise_limitations", 
            "exercise_equipment"."exercise_equipment", 
            "dogs"."crate_manners", 
            "dogs"."house_manners", 
            "dogs"."living_with_other_dogs", 
            "dogs"."living_with_cats", 
            "dogs"."living_with_children_older_ten", 
            "dogs"."living_with_children_younger_ten", 
            "dogs"."living_with_adults", 
            "dogs"."living_with_small_animals", 
            "dogs"."living_with_large_animals", 
            "behavior_dog"."behavior_category_name" AS "behavior_with_other_dogs",
            "behavior_cat"."behavior_category_name" AS "behavior_with_cats",
            "behavior_child"."behavior_category_name" AS "behavior_with_children"
        FROM 
            "dogs"
        JOIN 
            "dog_hosting" ON "dogs"."id" = "dog_hosting"."dog_id"
        JOIN 
            "exercise_limitations" AS "exercise_limitations" ON "dogs"."exercise_limitations" = "exercise_limitations"."id"
        JOIN 
            "exercise_equipment" AS "exercise_equipment" ON "dogs"."exercise_equipment" = "exercise_equipment"."id"
        JOIN 
            "behavior" AS "behavior_dog" ON "dogs"."behavior_with_other_dogs" = "behavior_dog"."id"
        JOIN 
            "behavior" AS "behavior_cat" ON "dogs"."behavior_with_cats" = "behavior_cat"."id"
        JOIN 
            "behavior" AS "behavior_child" ON "dogs"."behavior_with_children" = "behavior_child"."id"
        WHERE
            "dog_hosting"."user_id" = $1;
            `;

      const result = await connection.query(query, [userId]);
      const dogsResult = result.rows;

      res.json(dogsResult);
    } catch (error) {
      console.error("error fetching dogs", error);
      res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } else {
    res.sendStatus(403);
  }
});

/**
 * POST route to create a new dog profile
 */
router.post("/", (req, res) => {
  console.log("/dog POST router");
  console.log("req body", req.body);
  console.log("Is authenticated?", req.isUnauthenticated());
  console.log("user", req.user);

  if (req.isAuthenticated()) {
    const user = req.user.id;

    const dogData = [
      req.body.user_id, // assuming you're now including this in the insert
      req.body.name,
      req.body.age,
      req.body.breed,
      req.body.spayed_neutered,
      req.body.food_type,
      req.body.food_amount,
      req.body.meals_per_day,
      req.body.eating_times,
      req.body.medical_conditions,
      req.body.recovering_from_surgery,
      req.body.medications,
      req.body.in_heat,
      req.body.potty_routine,
      req.body.potty_habits_notes,
      req.body.exercise_limitations,
      req.body.exercise_equipment,
      req.body.crate_manners,
      req.body.house_manners,
      req.body.living_with_other_dogs,
      req.body.living_with_cats,
      req.body.living_with_children_older_ten,
      req.body.living_with_children_younger_ten,
      req.body.living_with_adults,
      req.body.living_with_small_animals,
      req.body.living_with_large_animals,
      req.body.behavior_with_other_dogs,
      req.body.behavior_with_cats,
      req.body.behavior_with_children,
    ];

    console.log("dog data", dogData);
    console.log("req.user.id", user);

    const queryText = `
            INSERT INTO "dogs" (
                "user_id",
                "name",
                "age",
                "breed",
                "spayed_neutered",
                "food_type",
                "food_amount",
                "meals_per_day",
                "eating_times",
                "medical_conditions",
                "recovering_from_surgery",
                "medications",
                "in_heat",
                "potty_routine",
                "potty_habits_notes",
                "exercise_limitations",
                "exercise_equipment",
                "crate_manners",
                "house_manners",
                "living_with_other_dogs",
                "living_with_cats",
                "living_with_children_older_ten",
                "living_with_children_younger_ten",
                "living_with_adults",
                "living_with_small_animals",
                "living_with_large_animals",
                "behavior_with_other_dogs",
                "behavior_with_cats",
                "behavior_with_children")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29);
            `;

    pool
      .query(queryText, dogData)
      .then(() => res.sendStatus(201))
      .catch((error) => {
        console.log("Adding a dog failed", error);
        res.sendStatus(500);
      });
  }
});

router.delete("/:id", (req, res) => {
  const dogId = req.params.id;
if(req.isAuthenticated()){
  const deleteDogQuery = `
        DELETE FROM "dogs"
        WHERE "id" = $1;`;

  pool
    .query(deleteDogQuery, [dogId])
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.log("Failed to delete dog profile", error);
      res.sendStatus(500);
    })}
});

router.put("/:id", async (req, res) => {
  console.log("/dog PUT route");
  const dogId = req.params.id;
  const updates = req.body; // All available fields to update ("dogs" table)

  if (req.isAuthenticated()) {
    let connection;
    try {
      connection = await pool.connect();

      //Build the SQL update statement based on the fields the user updates
      //keys are the db property names  of the fields the user is trying to update

      const setClause = Object.keys(updates) 
        .map((key, index) => `"${key}" = $${index + 1}`)  //iterate over the keys(db fields) to create an array of string segments for the SET clause
                                                          //Each segment maps a field name to a placeholder value ($1, $2`). 
        .join(", "); // this combines the segments above and creates a single string. This forms the SET piece of the queryText

      const values = Object.values(updates); //This takes the SetClause object and creates an array. Corresponds to new data being put in the db

     
     //construct the SQL Query Text using setClause and values.length +1 = dog id
     //RETURNING is just asking PostgreSQL to return the updated row of data
      const queryText = `UPDATE "dogs" SET ${setClause} WHERE "id" = $${
        values.length + 1
      } RETURNING *;`;

      // Execute the update query ...values = placeholder values ($1, $2, $3, etc.)
      const result = await connection.query(queryText, [...values, dogId]);

      if (result.rows.length > 0) {
        // If the update was successful, return the updated dog profile
        res.json(result.rows[0]);
      } else {
        // If no rows were updated, it means the dog ID was not found
        res.status(404).send({ message: "Dog not found" });
      }
    } catch (error) {
      console.error("Error updating dog profile", error);
      res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } else {
    res.sendStatus(403); // Not authenticated
  }
});

module.exports = router;
