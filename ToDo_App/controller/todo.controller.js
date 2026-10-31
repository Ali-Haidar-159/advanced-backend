"use strict";

// import all the packages
const createError = require("http-errors");

const prismObj = require("../lib/prisma.lib");

// create controllers

const createTodos = async function (req, res) {
  try {
    const { title, description, tags } = req.body;

    if (!title || !description || !tags) {
      throw createError(400, "Give all required data");
    }

    const newTodo = await prismObj.todo.create({
      data: {
        title,
        description,
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    const createdTags = await Promise.all(
      tags.map(async function (tag) {
        return await prismObj.tag.create({
          data: {
            name: tag.name,
            color: tag.color,
          },
        });
      }),
    );

    await Promise.all(
      createdTags.map(function (tag) {
        return prismObj.todoTag.create({
          data: {
            todo: {
              connect: {
                id: newTodo.id,
              },
            },

            tag: {
              connect: {
                id: tag.id,
              },
            },
          },
        });
      }),
    );

    return res.redirect("/");
  } catch (err) {
    console.log(err.message);
    throw createError(400, "Find error to create todo");
  }
};

const getAllTodo = async function (req, res) {
  try {
    const [todos, allTags] = await Promise.all([
      prismObj.todo.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          todoTags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prismObj.tag.findMany(),
    ]);

    return res.render("dashboard", {
      user: req.user,
      allTodos: todos,
      allTags,
    });
  } catch (err) {
    throw createError(400, `Find error to get all todos : ${err.message}`);
  }
};

const getSingleTodo = async function (req, res) {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    const todo = await prismObj.todo.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        todoTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.json({ todo });
  } catch (err) {
    throw createError(500, `Find error to get todo details: ${err.message}`);
  }
};

const deleteTodo = async function (req, res) {
  try {
    const todoId = req.body.id;
    if (typeof todoId !== "string" || !/^[a-f\d]{24}$/i.test(todoId)) {
      return res.status(400).json({
        success: false,
        message: "A valid todo id is required",
      });
    }

    const todo = await prismObj.todo.findFirst({
      where: {
        id: todoId,
        userId: req.user.id,
      },
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    await prismObj.todoTag.deleteMany({
      where: {
        todoId: todo.id,
      },
    });

    await prismObj.todo.delete({
      where: {
        id: todo.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      deleted_todo: todo,
    });
  } catch (err) {
    throw createError(500, `Find error to delete todo: ${err.message}`);
  }
};

// export codes
module.exports = {
  createTodos,
  getAllTodo,
  getSingleTodo,
  deleteTodo,
};
