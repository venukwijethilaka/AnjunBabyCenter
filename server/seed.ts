import prisma from "./prisma.js";

async function main() {
  console.log("Starting database seeding...");

  // Clean up existing data
  console.log("Cleaning up existing data...");
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // Create categories
  const babyClothing = await prisma.category.create({
    data: {
      name: "Baby Clothing",
      isActive: true,
    },
  });

  const babyGear = await prisma.category.create({
    data: {
      name: "Baby Gear",
      isActive: true,
    },
  });

  const toys = await prisma.category.create({
    data: {
      name: "Toys & Games",
      isActive: true,
    },
  });

  const feeding = await prisma.category.create({
    data: {
      name: "Feeding",
      isActive: true,
    },
  });

  // Create products
  const products = [
    {
      name: "Soft Cotton Baby T-Shirt",
      description: "Comfortable and soft cotton t-shirt for babies aged 0-12 months",
      price: 29.99,
      quantity: 50,
      color: "Blue",
      size: "6-12 months",
      availability: true,
      isFeatured: true,
      isTrending: true,
      isFlashSale: false,
      discountPercentage: 10,
      categoryId: babyClothing.id,
      images: [
        {
          url: "https://ik.imagekit.io/venukwijethilaka/baby-tshirt-blue.jpg",
          isMain: true,
          altText: "Blue baby t-shirt",
        },
      ],
    },
    {
      name: "Organic Baby Bodysuit",
      description: "100% organic cotton bodysuit, gentle on baby's skin",
      price: 39.99,
      quantity: 35,
      color: "White",
      size: "0-3 months",
      availability: true,
      isFeatured: true,
      isTrending: false,
      isFlashSale: true,
      discountPercentage: 20,
      categoryId: babyClothing.id,
      images: [
        {
          url: "https://ik.imagekit.io/venukwijethilaka/baby-bodysuit-white.jpg",
          isMain: true,
          altText: "White organic bodysuit",
        },
      ],
    },
    {
      name: "Baby Stroller Deluxe",
      description: "Premium lightweight stroller with all-terrain wheels",
      price: 299.99,
      quantity: 12,
      availability: true,
      isFeatured: true,
      isTrending: true,
      isFlashSale: false,
      discountPercentage: 15,
      categoryId: babyGear.id,
      images: [
        {
          url: "https://ik.imagekit.io/venukwijethilaka/stroller-deluxe.jpg",
          isMain: true,
          altText: "Deluxe baby stroller",
        },
      ],
    },
    {
      name: "Baby Car Seat",
      description: "Safety-certified car seat for newborns and infants up to 2 years",
      price: 249.99,
      quantity: 18,
      availability: true,
      isFeatured: true,
      isTrending: false,
      isFlashSale: false,
      discountPercentage: 5,
      categoryId: babyGear.id,
      images: [
        {
          url: "https://ik.imagekit.io/venukwijethilaka/car-seat.jpg",
          isMain: true,
          altText: "Baby car seat",
        },
      ],
    },
    {
      name: "Colorful Wooden Blocks",
      description: "Safe and educational wooden building blocks for babies 6+ months",
      price: 34.99,
      quantity: 45,
      availability: true,
      isFeatured: false,
      isTrending: true,
      isFlashSale: true,
      discountPercentage: 25,
      categoryId: toys.id,
      images: [
        {
          url: "https://ik.imagekit.io/venukwijethilaka/wooden-blocks.jpg",
          isMain: true,
          altText: "Colorful wooden blocks",
        },
      ],
    },
    {
      name: "Teething Ring",
      description: "Soft silicone teething ring with various textures for sore gums",
      price: 14.99,
      quantity: 80,
      color: "Rainbow",
      availability: true,
      isFeatured: false,
      isTrending: true,
      isFlashSale: false,
      discountPercentage: 0,
      categoryId: toys.id,
      images: [
        {
          url: "https://ik.imagekit.io/venukwijethilaka/teething-ring.jpg",
          isMain: true,
          altText: "Rainbow teething ring",
        },
      ],
    },
    {
      name: "Silicone Baby Bottle",
      description: "BPA-free silicone bottles with ergonomic design, heat resistant",
      price: 19.99,
      quantity: 60,
      color: "Pink",
      size: "240ml",
      availability: true,
      isFeatured: true,
      isTrending: false,
      isFlashSale: false,
      discountPercentage: 10,
      categoryId: feeding.id,
      images: [
        {
          url: "https://ik.imagekit.io/venukwijethilaka/baby-bottle-pink.jpg",
          isMain: true,
          altText: "Pink silicone baby bottle",
        },
      ],
    },
    {
      name: "High Chair with Tray",
      description: "Adjustable high chair with removable tray and safety harness",
      price: 159.99,
      quantity: 22,
      availability: true,
      isFeatured: true,
      isTrending: true,
      isFlashSale: true,
      discountPercentage: 30,
      categoryId: feeding.id,
      images: [
        {
          url: "https://ik.imagekit.io/venukwijethilaka/high-chair.jpg",
          isMain: true,
          altText: "Baby high chair",
        },
      ],
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        color: product.color ?? null,
        size: product.size ?? null,
        availability: product.availability,
        isFeatured: product.isFeatured,
        isTrending: product.isTrending,
        isFlashSale: product.isFlashSale,
        discountPercentage: product.discountPercentage ?? null,
        category: {
          connect: { id: product.categoryId },
        },
        images: {
          create: product.images,
        },
      },
      include: { category: true, images: true },
    });
    console.log(`✓ Created product: ${createdProduct.name}`);
  }

  console.log("✓ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
