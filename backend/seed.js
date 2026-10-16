require("dotenv").config();
const mongoose = require("mongoose");
const Pizza = require("./models/Pizza");

const pizzas = [
  {
    name: "Margherita",
    description: "Classic cheese, tomato sauce, and fresh basil.",
    price: 249,
    category: "Classic",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800",
    isVeg: true,
  },
  {
    name: "Farmhouse",
    description: "A garden of fresh vegetables and melted cheese.",
    price: 329,
    category: "Veggie",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800",
    isVeg: true,
  },
  {
    name: "Paneer Tikka",
    description: "Indian-style paneer with bold tikka flavours.",
    price: 349,
    category: "Veggie",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800",
    isVeg: true,
  },
  {
    name: "Spicy Inferno",
    description: "A fiery pizza for fans of a little extra heat.",
    price: 299,
    category: "Spicy",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    isVeg: true,
  },
  {
    name: "Cheese Overload",
    description: "Extra cheese for the ultimate cheese lover.",
    price: 379,
    category: "Classic",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800",
    isVeg: true,
  },
  {
    name: "Garden Fresh",
    description: "Fresh vegetables on a delicious cheesy base.",
    price: 289,
    category: "Veggie",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800",
    isVeg: true,
  },
];

async function seedPizzas() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Replaces existing pizza records in this development database.
    await Pizza.deleteMany({});
    const inserted = await Pizza.insertMany(pizzas);

    console.log(`Successfully inserted ${inserted.length} pizzas.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedPizzas();
