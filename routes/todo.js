const { todoModel } = require("../database");
const { middleware } = require("../middlewares/middle");
const { Router } = require("express");

const todoRouter = Router();

todoRouter.post("/create", middleware, async (req, res) => {
  const userid = req.userid;
  const title = req.body.title;

  try {
    await todoModel.create({
      title,
      done: false,
      date: new Date(),
      userId: userid
    });

    res.json({ message: "Todo created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating todo" });
  }
});

todoRouter.put('/update/:id', middleware, async (req, res) => {
  const todoId = req.params.id;
  const userId = req.userid;
  const { title } = req.body;

  try {
    // Update the todo if it belongs to the user
    const updatedTodo = await todoModel.findOneAndUpdate(
      { _id: todoId, userId },
      { title, updated: new Date() },
      { new: true }  // return the updated doc
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(updatedTodo); // Return updated todo (or success message)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update todo" });
  }
})

todoRouter.get("/mytodo", middleware, async (req, res) => {
  const userid = req.userid;

  try {
    const todos = await todoModel.find({ userId: userid });
    // Wrap todos in an object for consistent frontend consumption
    res.json({ todos }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

todoRouter.delete("/delete/:id", middleware, async (req, res) => {
  const todoId = req.params.id;
  const userId = req.userid;

  try {
    const result = await todoModel.deleteOne({ _id: todoId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Todo not found or not yours" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting todo" });
  }
});

module.exports = { todoRouter };



