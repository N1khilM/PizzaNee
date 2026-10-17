// Fallback menu for UI development if the backend is unavailable.
// These placeholder IDs are not real database IDs, so checkout requires the backend menu.
const fallbackPizzas = [
  {
    _id: "000000000000000000000001",
    name: "Margherita Bliss",
    description: "Tomato, mozzarella, basil and a beautifully crisp crust.",
    price: 249,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&auto=format&fit=crop&q=80",
    isVeg: true,
    category: "Classic",
  },
  {
    _id: "000000000000000000000002",
    name: "Garden Party",
    description: "Peppers, onion, sweet corn, olives and mushrooms.",
    price: 299,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900&auto=format&fit=crop&q=80",
    isVeg: true,
    category: "Veggie",
  },
  {
    _id: "000000000000000000000003",
    name: "Firecracker Paneer",
    description: "Spiced paneer, red onion and a lively chilli kick.",
    price: 329,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=900&auto=format&fit=crop&q=80",
    isVeg: true,
    category: "Signature",
  },
  {
    _id: "000000000000000000000004",
    name: "Smoky BBQ",
    description: "Smoky barbecue sauce, capsicum and melted cheese.",
    price: 349,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80",
    isVeg: true,
    category: "Signature",
  },
  {
    _id: "000000000000000000000005",
    name: "Double Cheese Dream",
    description: "A creamy, extra-cheesy classic for cheese lovers.",
    price: 319,
    image: "https://images.unsplash.com/photo-1534308983496-4f0034c13dcb?w=900&auto=format&fit=crop&q=80",
    isVeg: true,
    category: "Cheesy",
  },
  {
    _id: "000000000000000000000006",
    name: "Olive & Earth",
    description: "Olives, mushrooms, herbs and a tangy tomato base.",
    price: 289,
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=900&auto=format&fit=crop&q=80",
    isVeg: true,
    category: "Veggie",
  },
];

export default fallbackPizzas;
